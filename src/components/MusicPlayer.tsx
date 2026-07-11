import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { motion } from "motion/react";

interface MusicPlayerProps {
  url: string;
  title: string;
  autoPlayTriggered: boolean;
  onStateChange?: (isPlaying: boolean) => void;
}

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function MusicPlayer({ url, title, autoPlayTriggered, onStateChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  const youtubeId = getYoutubeId(url);
  const isYoutube = !!youtubeId;

  // 1. HTML5 AUDIO CONTROLLER (For MP3/Standard files)
  useEffect(() => {
    if (isYoutube) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = url;
    }

    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.log("Audio play blocked:", err);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [url, isYoutube]);

  // Handle standard audio volume and mute
  useEffect(() => {
    if (audioRef.current && !isYoutube) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, isYoutube]);

  // 2. YOUTUBE IFRAME CONTROLLER
  const postToYoutube = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args }),
          "*"
        );
      } catch (err) {
        console.error("Failed to post message to YouTube iframe:", err);
      }
    }
  };

  // Sync YouTube state whenever isPlaying, isMuted, or volume changes
  useEffect(() => {
    if (!isYoutube) return;

    if (isPlaying) {
      postToYoutube("playVideo");
    } else {
      postToYoutube("pauseVideo");
    }
  }, [isPlaying, isYoutube]);

  useEffect(() => {
    if (!isYoutube) return;
    postToYoutube("setVolume", [volume * 100]);
    postToYoutube("mute", []); // YouTube is separate
    if (!isMuted) {
      postToYoutube("unMute", []);
    }
  }, [volume, isMuted, isYoutube]);

  // Handle Autoplay signal (after Visitor Clicks Enter)
  useEffect(() => {
    if (autoPlayTriggered) {
      setIsPlaying(true);
      if (onStateChange) onStateChange(true);

      if (!isYoutube && audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.log("HTML5 Autoplay blocked:", err);
          setIsPlaying(false);
        });
      } else if (isYoutube) {
        // Send play command to YouTube iframe player
        postToYoutube("playVideo");
      }
    }
  }, [autoPlayTriggered, isYoutube]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (onStateChange) onStateChange(nextState);

    if (!isYoutube && audioRef.current) {
      if (nextState) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    } else if (isYoutube) {
      if (nextState) {
        postToYoutube("playVideo");
      } else {
        postToYoutube("pauseVideo");
      }
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);

    if (!isYoutube && audioRef.current) {
      audioRef.current.muted = nextMute;
    } else if (isYoutube) {
      postToYoutube(nextMute ? "mute" : "unMute");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) {
      setIsMuted(false);
      if (isYoutube) {
        postToYoutube("unMute");
        postToYoutube("setVolume", [val * 100]);
      }
    } else {
      setIsMuted(true);
      if (isYoutube) {
        postToYoutube("mute");
      }
    }
  };

  // Embed URL with required query parameters for controls & API interaction
  const embedUrl = isYoutube
    ? `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=${autoPlayTriggered ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3`
    : "";

  return (
    <div id="music-player-container" className="fixed bottom-4 left-4 z-40 max-w-xs bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-indigo-500/10 flex flex-col gap-3 direction-rtl">
      {/* Hidden YouTube Iframe Player */}
      {isYoutube && (
        <div className="absolute w-0 h-0 overflow-hidden pointer-events-none opacity-0">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title="YouTube Background Music Player"
            allow="autoplay; encrypted-media"
            className="w-0 h-0"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          id="music-play-btn"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 shrink-0"
          title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
        >
          {isPlaying ? (
            <Pause size={18} className="text-white" />
          ) : (
            <Play size={18} className="text-white fill-white ml-0.5" />
          )}
        </button>

        {/* Info & Waves */}
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase flex items-center gap-1">
            <Music size={10} className={isPlaying ? "animate-bounce" : ""} />
            الآن يستمع إلى:
          </p>
          <p className="text-xs font-bold text-white truncate" title={title}>
            {title || "موسيقى الواجهة"}
          </p>
        </div>

        {/* Wave Animation */}
        {isPlaying && (
          <div className="flex items-end gap-[2px] h-6 px-1 shrink-0">
            <span className="w-[3px] bg-indigo-400 animate-[pulse_0.8s_infinite_alternate]" style={{ height: '35%' }} />
            <span className="w-[3px] bg-purple-500 animate-[pulse_1.2s_infinite_alternate]" style={{ height: '75%' }} />
            <span className="w-[3px] bg-indigo-400 animate-[pulse_1s_infinite_alternate]" style={{ height: '50%' }} />
            <span className="w-[3px] bg-pink-500 animate-[pulse_0.7s_infinite_alternate]" style={{ height: '90%' }} />
          </div>
        )}
      </div>

      {/* Volume Bar & Controls */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
        <button
          id="music-mute-btn"
          onClick={toggleMute}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          id="music-volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>
    </div>
  );
}
