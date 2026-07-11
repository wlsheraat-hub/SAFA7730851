import React, { useState } from "react";
import { AppConfig } from "../types";
import { Gamepad2, MessageSquare, Video, Music, Settings, ExternalLink, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VisitorViewProps {
  config: AppConfig;
  onEnterWithMusic: () => void;
  isMusicPlaying: boolean;
  onToggleAdmin: () => void;
}

export default function VisitorView({ config, onEnterWithMusic, isMusicPlaying, onToggleAdmin }: VisitorViewProps) {
  const [hasEntered, setHasEntered] = useState(true);

  const handleEnter = () => {
    setHasEntered(true);
    onEnterWithMusic();
  };

  // Safe fallback icons
  const TiktokIcon = Video;
  const SteamIcon = Gamepad2;
  const DiscordIcon = MessageSquare;

  return (
    <div id="visitor-view-wrapper" className="min-h-[85vh] flex flex-col items-center justify-center px-4 relative">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          /* CINEMATIC ENTRY PORTAL */
          <motion.div
            key="entry-portal"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full max-w-lg bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-indigo-500/5 z-10 direction-rtl"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mx-auto w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/5"
            >
              <Headphones className="text-indigo-400 animate-pulse" size={36} />
            </motion.div>

            <h1 className="text-3xl font-black text-white tracking-wide mb-3 leading-snug">
              نورتو نورتو بس تبحبشوش كثير
            </h1>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-light">
              قلتلك تبحبشش كثير بس بمزح معك خد راحتك يلا اكبس خلصني
            </p>

            <button
              id="enter-site-btn"
              onClick={handleEnter}
              className="relative group w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 overflow-hidden text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                ادخل وشوف صفحاتي وسوي متابعه 🎵
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-transform duration-500" />
            </button>
          </motion.div>
        ) : (
          /* MAIN SHOWCASE INTERFACE (Sleek Theme Applied) */
          <motion.div
            key="main-showcase"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="w-full max-w-2xl bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-950/40 z-10 relative overflow-hidden direction-rtl"
          >
            {/* Ambient Background Glow inside the card */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Floating Music Notes Animation if playing */}
            {isMusicPlaying && (
              <div className="absolute top-4 right-4 text-indigo-400/50 pointer-events-none animate-bounce">
                <Music size={20} className="animate-pulse" />
              </div>
            )}

            {/* Profile Avatar / Photo with Sleek Theme Circular Gradient Border */}
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 p-1 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-4xl overflow-hidden">
                  {config.profileImage ? (
                    <img
                      id="profile-avatar"
                      src={config.profileImage}
                      alt={config.profileTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    "👤"
                  )}
                </div>
              </div>
            </div>

            {/* Title / Name */}
            <h1 id="profile-title" className="text-4xl font-extrabold text-white tracking-tight mb-2 select-all leading-tight">
              {config.profileTitle}
            </h1>

            {/* Badge Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              حساباتي الرسمية
            </div>

            {/* Custom Description written by the owner */}
            <p className="text-slate-400 text-lg leading-relaxed text-center mb-8 whitespace-pre-line select-all">
              {config.description}
            </p>

            {/* THE THREE SOCIAL LINKS WITH SLEEK INTERFACE STYLING */}
            <div id="social-links-container" className="grid grid-cols-1 gap-4 text-right">
              
              {/* 1. TikTok Link */}
              <motion.a
                id="tiktok-link-btn"
                href={config.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-4 bg-[#010101] border border-white/10 p-5 rounded-2xl hover:border-pink-500/50 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl shrink-0">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.42-1.58 2.39-.06.44-.04.9.05 1.34.25 1.33 1.46 2.45 2.8 2.57.88.11 1.77-.1 2.51-.59.81-.54 1.32-1.4 1.44-2.35.03-1.04.01-2.08.01-3.12 0-4.17 0-8.33.02-12.5z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="font-bold text-xl text-white">TikTok</div>
                  <div className="text-xs text-slate-500 truncate">تيك توك الرسمي</div>
                </div>
                <div className="text-slate-600 group-hover:text-pink-500 text-lg font-bold transition-colors">←</div>
              </motion.a>

              {/* 2. Steam Link (Disabled) */}
              <div
                id="steam-link-btn"
                className="group flex items-center gap-4 bg-[#1b2838]/40 border border-red-500/20 p-5 rounded-2xl opacity-50 cursor-not-allowed select-none transition-all"
              >
                <div className="w-12 h-12 bg-[#2a475e]/30 flex items-center justify-center rounded-xl shrink-0 grayscale">
                  <svg className="w-7 h-7 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.385 0 0 5.385 0 12c0 2.212.6 4.28 1.637 6.06l4.24-1.74a3.344 3.344 0 0 1 1.09-2.846l1.37-6.09c-.066-.352-.102-.714-.102-1.084 0-2.927 2.373-5.3 5.3-5.3s5.3 2.373 5.3 5.3-2.373 5.3-5.3 5.3c-.37 0-.732-.036-1.084-.102L6.36 12.768a3.344 3.344 0 0 1-2.846 1.09l-1.74 4.24C3.72 23.4 8.72 24 12 24c6.615 0 12-5.385 12-12S18.615 0 12 0zm1.75 6.3a2.45 2.45 0 1 1-2.45 2.45 2.453 2.453 0 0 1 2.45-2.45z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="font-bold text-xl text-slate-400">Steam</div>
                  <div className="text-xs text-red-500 font-bold truncate">موقفه</div>
                </div>
                <div className="text-red-500/50 text-lg font-bold">✕</div>
              </div>

              {/* 3. Discord Link */}
              <motion.a
                id="discord-link-btn"
                href={config.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-4 bg-[#5865F2] border border-white/10 p-5 rounded-2xl hover:bg-[#4752c4] transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center rounded-xl shrink-0">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="font-bold text-xl text-white">Discord</div>
                  <div className="text-xs text-white/70 truncate">فوت على ماجيك سيتي تستحيش</div>
                </div>
                <div className="text-white/40 group-hover:text-white text-lg font-bold transition-colors">←</div>
              </motion.a>
            </div>

            {/* QUICK STATS AS REQUESTED BY SLEEK THEME */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-center backdrop-blur-md">
                <div className="text-2xl font-bold text-white tracking-tight">نشط</div>
                <span className="text-[10px] uppercase text-slate-500 tracking-wider">الحالة الحالية</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-center backdrop-blur-md">
                <div className="text-2xl font-bold text-indigo-400 tracking-tight">قناة موثقة</div>
                <span className="text-[10px] uppercase text-slate-500 tracking-wider">التحقق</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Button Panel in Bottom-Right Corner */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          id="toggle-admin-btn"
          onClick={onToggleAdmin}
          className="w-11 h-11 rounded-full bg-slate-900/80 border border-slate-800 hover:border-indigo-500 text-gray-400 hover:text-indigo-400 flex items-center justify-center shadow-lg shadow-black/50 backdrop-blur-md transition-all cursor-pointer active:scale-95 group"
          title="لوحة التحكم الخاصة بي"
        >
          <Settings size={18} className="group-hover:rotate-45 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}