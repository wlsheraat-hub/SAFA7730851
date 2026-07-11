import { useState, useEffect, useMemo, CSSProperties } from "react";
import { AppConfig } from "./types";
import VisitorView from "./components/VisitorView";
import AdminView from "./components/AdminView";
import MusicPlayer from "./components/MusicPlayer";
import { Sparkles, ArrowLeft, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_CONFIG: AppConfig = {
  profileTitle: "شاهر",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  description: "نورتو صفحات ازعم واحد من اونريه عصابات ماجيك سيتي اونر عصابه بلاك ليست رساله سريعه للمبعوصين نعلو ولا يعلا علينا وخليكم مبعوصين \nSAFA7 30851 ON_TOOP",
  backgroundImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80",
  musicUrl: "https://www.youtube.com/watch?v=rolD6KVBBO8",
  musicTitle: "موسيقى الواجهة الرسمية",
  tiktokUrl: "https://www.tiktok.com/@tiktok",
  steamUrl: "https://steamcommunity.com/",
  discordUrl: "https://discord.gg/"
};

export default function App() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [view, setView] = useState<"visitor" | "admin">("visitor");
  const [token, setToken] = useState<string>("");
  const [autoPlayMusic, setAutoPlayMusic] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Generate stable custom embers/sparks for performance-friendly background fire
  const embers = useMemo(() => {
    return Array.from({ length: 55 }).map((_, i) => {
      const size = Math.random() * 4.5 + 2.5; // 2.5px to 7px (Larger)
      const left = Math.random() * 100; // 0% to 100%
      const delay = Math.random() * 4; // 0s to 4s (Faster start)
      const duration = Math.random() * 3.5 + 2.5; // 2.5s to 6s (Much faster rise)
      const drift = `${Math.random() * 200 - 100}px`; // -100px to 100px drift
      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          "--drift": drift,
        } as CSSProperties
      };
    });
  }, []);

  // Load config on mount & setup global autoplay trigger on ANY user interaction
  useEffect(() => {
    fetchConfig();
    // Retrieve auth token if present
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
    }

    // Auto-play music instantly upon ANY click/touch/interaction with the page
    const triggerAutoplay = () => {
      setAutoPlayMusic(true);
      setIsMusicPlaying(true);
      // Clean up listeners immediately once triggered
      window.removeEventListener("click", triggerAutoplay);
      window.removeEventListener("touchstart", triggerAutoplay);
      window.removeEventListener("keydown", triggerAutoplay);
    };

    window.addEventListener("click", triggerAutoplay);
    window.addEventListener("touchstart", triggerAutoplay);
    window.addEventListener("keydown", triggerAutoplay);

    return () => {
      window.removeEventListener("click", triggerAutoplay);
      window.removeEventListener("touchstart", triggerAutoplay);
      window.removeEventListener("keydown", triggerAutoplay);
    };
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/config");
      const data = await response.json();
      if (response.ok && data.success) {
        setConfig(data.data);
      }
    } catch (err) {
      console.error("Error fetching config:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("admin_token", newToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("admin_token");
  };

  const handleUpdateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
  };

  const handleEnterWithMusic = () => {
    setAutoPlayMusic(true);
    setIsMusicPlaying(true);
  };

  const handleMusicStateChange = (playing: boolean) => {
    setIsMusicPlaying(playing);
  };

  const toggleView = () => {
    setView(view === "visitor" ? "admin" : "visitor");
  };

  return (
    <div className="relative min-h-screen w-full select-none overflow-x-hidden flex flex-col justify-between">
      {/* 1. DYNAMIC BACKGROUND IMAGE LAYER (Covered with professional dark overlay to keep high-contrast text perfectly readable) */}
      <div
        id="app-bg-image"
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${config.backgroundImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80"})`,
        }}
      />
      {/* Blur & Dark Backdrop filter overlay */}
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-xs" />

      {/* AMBIENT LIGHTNING & THUNDER ANIMATED LAYERS */}
      {/* Lightning Flash Overlay 1 */}
      <div className="absolute inset-0 z-0 bg-white pointer-events-none opacity-0 animate-lightning-1 mix-blend-overlay" />
      {/* Lightning Flash Overlay 2 */}
      <div className="absolute inset-0 z-0 bg-indigo-200 pointer-events-none opacity-0 animate-lightning-2 mix-blend-overlay" />

      {/* Jagged SVG Lightning Bolt Strikes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Bolt Left */}
        <svg
          className="absolute top-0 left-[15%] w-32 h-[80vh] text-indigo-400/70 pointer-events-none opacity-0 animate-bolt-1"
          viewBox="0 0 100 800"
          preserveAspectRatio="none"
        >
          <path
            d="M50 0 L30 150 L65 300 L25 480 L75 620 L40 800"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Bolt Right */}
        <svg
          className="absolute top-0 right-[20%] w-40 h-[90vh] text-purple-400/70 pointer-events-none opacity-0 animate-bolt-2"
          viewBox="0 0 100 800"
          preserveAspectRatio="none"
        >
          <path
            d="M60 0 L40 200 L75 380 L35 550 L85 690 L50 800"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* VOLCANIC FIRE / LAVA LOWER GLOW */}
      <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-red-600/35 via-orange-500/15 to-transparent blur-3xl pointer-events-none z-0 animate-fire-glow" />

      {/* RISING FIRE SPARK EMBERS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {embers.map((ember) => (
          <div
            key={ember.id}
            style={{
              ...ember.style,
              animationName: "ember-rise",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
            className="absolute bottom-[-10px] rounded-full bg-gradient-to-t from-red-500 via-amber-400 to-amber-300 shadow-[0_0_8px_#f97316,0_0_15px_#f59e0b] opacity-0"
          />
        ))}
      </div>

      {/* 2. HEADER NAVIGATION FOR ADMIN MODE */}
      <header className="relative z-30 w-full px-6 py-4 flex items-center justify-between">
        <div />

        {view === "admin" && (
          <button
            id="back-to-visitor-btn"
            onClick={() => setView("visitor")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 cursor-pointer"
          >
            <ArrowLeft size={14} />
            الرجوع لمعاينة الموقع
          </button>
        )}
      </header>

      {/* 3. MAIN CONTENT CONTAINER WITH ANIMATION SWITCH */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-6 sm:py-12">
        <AnimatePresence mode="wait">
          {view === "visitor" ? (
            <motion.div
              key="visitor-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <VisitorView
                config={config}
                onEnterWithMusic={handleEnterWithMusic}
                isMusicPlaying={isMusicPlaying}
                onToggleAdmin={toggleView}
              />
            </motion.div>
          ) : (
            <motion.div
              key="admin-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <AdminView
                config={config}
                token={token}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                onUpdateConfig={handleUpdateConfig}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. BACKGROUND MUSIC AUDIO CONTROLLER PLAYER */}
      <MusicPlayer
        url={config.musicUrl}
        title={config.musicTitle}
        autoPlayTriggered={autoPlayMusic}
        onStateChange={handleMusicStateChange}
      />

      {/* 5. FOOTER */}
      <footer className="relative z-10 py-6 text-center text-[11px] text-gray-500 font-medium">
        {token && (
          <div className="mt-1 inline-flex items-center gap-1 text-green-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
            أنت متصل بصفتك مالك الموقع
          </div>
        )}
      </footer>
    </div>
  );
}
