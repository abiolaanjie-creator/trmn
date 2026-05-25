import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrmnLogo } from './TrmnLogo';
import { 
  ArrowRight, 
  Smartphone, 
  Mail, 
  Globe, 
  Sparkles, 
  Key, 
  ChevronRight, 
  ShieldCheck, 
  Wine, 
  Music, 
  Pizza, 
  Compass, 
  BookOpen, 
  HeartHandshake, 
  Flame 
} from 'lucide-react';

interface OnboardingLoginProps {
  onLoginSuccess: (email: string, name: string) => void;
  defaultEmail?: string;
  defaultName?: string;
}

// Custom event sticker layout mapping shown in Luma screenshots
const FLOATING_STICKERS = [
  {
    id: 'st-pizza',
    title: 'Pizza Fest',
    badge: '🍕 PIZZA',
    color: 'from-amber-400 to-orange-500',
    rotate: -12,
    yInit: 60,
    xInit: 40,
    duration: 5.5,
    icon: Pizza,
    accent: '#E07A5F',
  },
  {
    id: 'st-90s',
    title: "Back to the 90's",
    badge: '🕺 DANCE',
    color: 'from-pink-500 to-indigo-600',
    rotate: 8,
    yInit: 150,
    xInit: 300,
    duration: 6.2,
    icon: Music,
    accent: '#F43F5E',
  },
  {
    id: 'st-breathe',
    title: 'Breathe Yoga',
    badge: '🧘‍♂️ ZEN',
    color: 'from-emerald-400 to-teal-600',
    rotate: -6,
    yInit: 260,
    xInit: 80,
    duration: 4.8,
    icon: Compass,
    accent: '#10B981',
  },
  {
    id: 'st-book',
    title: 'Book Talk',
    badge: '📚 NOVEL',
    color: 'from-yellow-400 to-amber-500',
    rotate: 15,
    yInit: 360,
    xInit: 240,
    duration: 5.8,
    icon: BookOpen,
    accent: '#F59E0B',
  },
  {
    id: 'st-cocktail',
    title: 'Cocktail Hour',
    badge: '🍸 MARINI',
    color: 'from-teal-400 to-cyan-600',
    rotate: -10,
    yInit: 480,
    xInit: 50,
    duration: 6.5,
    icon: Wine,
    accent: '#06B6D4',
  },
  {
    id: 'st-sunset',
    title: 'Solstice Sunset',
    badge: '🌇 MUSIC',
    color: 'from-orange-500 to-rose-600',
    rotate: 6,
    yInit: 580,
    xInit: 260,
    duration: 5.2,
    icon: Flame,
    accent: '#F97316',
  },
];

// Terminus branding copy variations
const TERMINUS_QUOTES = [
  {
    tagline: "The Ultimate Gathering Terminus",
    titlePrimary: "Delightful events",
    titleAccent: "start here",
    titleColor: "from-red-500 via-pink-500 to-amber-500",
    desc: "A terminus is the ultimate destination where all social pathways converge. Enter the terminal and sign your customized access passes.",
  },
  {
    tagline: "All Circles Converge Here",
    titlePrimary: "Sovereign communities",
    titleAccent: "converge here",
    titleColor: "from-emerald-400 via-teal-500 to-indigo-500",
    desc: "Connecting local event organizers, edge-secured digital verification passes, and unified subscriber calendars in under four minutes.",
  },
  {
    tagline: "Event Verification Reimagined",
    titlePrimary: "Cryptography passes",
    titleAccent: "validate here",
    titleColor: "from-pink-500 via-purple-500 to-indigo-500",
    desc: "Host, scan, and manage your crowd with robust cryptography. From intimate jazz cellars to high-energy rooftop sessions.",
  }
];

export function OnboardingLogin({ onLoginSuccess, defaultEmail = 'abiolaanjie@gmail.com', defaultName = 'Abiola Anjie' }: OnboardingLoginProps) {
  const [slide, setSlide] = useState(0);
  const [authMethod, setAuthMethod] = useState<'none' | 'email' | 'mobile'>('none');
  const [emailInput, setEmailInput] = useState(defaultEmail);
  const [nameInput, setNameInput] = useState(defaultName);
  const [phoneInput, setPhoneInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempCode, setTempCode] = useState('');
  const [showCodeVerification, setShowCodeVerification] = useState(false);

  // Rotating adjectives for delightful events slogan dynamic morphing
  const [typedAdjIndex, setTypedAdjIndex] = useState(0);
  const ADJECTIVES = ["Delightful", "Incredible", "Vibrant", "Intimate", "Sovereign", "Spectacular"];

  React.useEffect(() => {
    if (slide === 0) {
      const timer = setInterval(() => {
        setTypedAdjIndex((prev) => (prev + 1) % ADJECTIVES.length);
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [slide]);

  // Auto-play interval for cycling through slides and changing the title/desc
  React.useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % TERMINUS_QUOTES.length);
    }, 5500); // slightly longer so readers can see the multiple adjectives
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setSlide((prev) => (prev + 1) % TERMINUS_QUOTES.length);
  };

  const handleContinueEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubmitting(true);
    // Simulate sending a OTP passkey
    setTimeout(() => {
      setIsSubmitting(false);
      setShowCodeVerification(true);
    }, 1200);
  };

  const handleContinueMobile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setIsSubmitting(true);
    // Simulate sending code
    setTimeout(() => {
      setIsSubmitting(false);
      setShowCodeVerification(true);
    }, 1200);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate verifying code and logging in
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(emailInput.trim() || 'abiolaanjie@gmail.com', nameInput.trim() || 'Abiola Anjie');
    }, 1500);
  };

  const handleInstantGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(defaultEmail, defaultName);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-slate-100 flex flex-col justify-between overflow-x-hidden relative transition-colors duration-300">
      
      {/* BACKGROUND FLOATING GRADIENT GLOWS */}
      <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] rounded-full bg-violet-500/10 dark:bg-violet-950/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] rounded-full bg-indigo-500/10 dark:bg-indigo-950/20 blur-[120px] pointer-events-none" />

      {/* TOP HEADER: ICON BRANDING */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex justify-between items-center z-10">
        <TrmnLogo className="h-5" themeMode="adaptive" showTagline={true} />
        
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Globe className="w-3.5 h-3.5 animate-spin-slow text-indigo-400" />
          <span>TERMINAL PORTAL STATUS: ACTIVE</span>
        </div>
      </header>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center py-6 sm:py-10 z-10">
        
        {/* LEFT COLUMN: FLOATING ANIMATED POSTER STICKERS */}
        <div className="lg:col-span-6 relative h-[360px] sm:h-[500px] lg:h-[640px] w-full flex items-center justify-center select-none overflow-hidden rounded-2xl bg-white/20 dark:bg-slate-900/10 backdrop-blur-3xl border border-white/10 dark:border-white/5 shadow-inner">
          
          {/* Ambient center anchor for visual depth */}
          <div className="absolute flex flex-col items-center justify-center text-center p-8 z-0">
            <div className="w-32 h-32 rounded-full border border-indigo-500/10 dark:border-indigo-400/15 flex items-center justify-center animate-pulse">
              <Compass className="w-12 h-12 text-indigo-400/20 dark:text-indigo-400/30" />
            </div>
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-indigo-500/30 mt-3">trmn interactive stage</p>
          </div>

          {/* ACTIVE FLOATING CARDS - ANIMATED VIA FRAMER MOTION */}
          <div className="absolute inset-0 w-full h-full">
            {FLOATING_STICKERS.map((sticker, idx) => {
              const IconComp = sticker.icon;
              return (
                <motion.div
                  key={sticker.id}
                  className="absolute pointer-events-auto cursor-pointer"
                  style={{
                    top: `${sticker.yInit / 6.4}%`, // Responsive percentage scaling
                    left: `${sticker.xInit / 3.8}%`,
                  }}
                  initial={{ opacity: 0, scale: 0.8, rotate: sticker.rotate - 10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: [sticker.rotate, sticker.rotate + 3, sticker.rotate - 3, sticker.rotate],
                    y: [0, -12, 12, 0],
                  }}
                  whileHover={{ 
                    scale: 1.12, 
                    rotate: sticker.rotate * 1.5,
                    zIndex: 40,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: idx * 0.15 },
                    scale: { duration: 0.3 },
                    y: {
                      repeat: Infinity,
                      duration: sticker.duration,
                      ease: "easeInOut",
                    },
                    rotate: {
                      repeat: Infinity,
                      duration: sticker.duration * 1.5,
                      ease: "easeInOut",
                    }
                  }}
                >
                  <div className="max-w-[130px] sm:max-w-[155px] p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-indigo-950/30 shadow-lg text-left select-none relative group overflow-hidden">
                    {/* Glowing highlight border on hover */}
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${sticker.color}`} />
                    
                    {/* Decorative radial card background */}
                    <div className="absolute -right-3 -bottom-3 w-12 h-12 rounded-full opacity-5 bg-indigo-500 dark:bg-white" />

                    <div className="flex justify-between items-start gap-1 mb-2">
                      <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono tracking-wider">
                        {sticker.badge}
                      </span>
                      <IconComp className="w-3.5 h-3.5 text-slate-400 shrink-0" style={{ color: sticker.accent }} />
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-snug">
                      {sticker.title}
                    </h4>
                    
                    <p className="text-[8px] text-slate-400 font-mono mt-1">
                      ✦ {14 + idx} JUN 2026
                    </p>
                    <div className="mt-2 w-full flex justify-between items-center text-[7px] text-slate-400 border-t border-slate-100 dark:border-white/5 pt-1.5 font-mono">
                      <span>VERIFIED TICKET</span>
                      <span className="text-indigo-400">trmn#0{idx+1}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: AUTH ACTIONS & TERMINUS INTRO */}
        <div className="lg:col-span-6 space-y-8 flex flex-col justify-center text-left max-w-md mx-auto lg:max-w-none w-full">
          
          {/* SLIDESHOW COPY ANCHOR */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-500 dark:text-indigo-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{TERMINUS_QUOTES[slide].tagline}</span>
            </div>

            <div className="space-y-2">
              <div className="h-[96px] sm:h-[110px] lg:h-[135px] flex items-center overflow-visible">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={slide}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight w-full"
                  >
                    {slide === 0 ? (
                      <span className="inline-flex flex-wrap items-center">
                        <span className="relative inline-block mr-2 text-violet-600 dark:text-violet-400 min-w-[130px] sm:min-w-[160px]">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={typedAdjIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.25 }}
                              className="absolute left-0 top-0 inline-block whitespace-nowrap"
                            >
                              {ADJECTIVES[typedAdjIndex]}
                            </motion.span>
                          </AnimatePresence>
                        </span>
                        <span className="text-slate-950 dark:text-white">events</span>
                      </span>
                    ) : (
                      <span>{TERMINUS_QUOTES[slide].titlePrimary}</span>
                    )} <br/>
                    <span className={`bg-gradient-to-r ${TERMINUS_QUOTES[slide].titleColor} bg-clip-text text-transparent`}>
                      {TERMINUS_QUOTES[slide].titleAccent}
                    </span>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 ml-1.5 animate-pulse" />
                  </motion.h1>
                </AnimatePresence>
              </div>
              
              <div className="h-[76px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={slide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-2"
                  >
                    {TERMINUS_QUOTES[slide].desc}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-2 pt-1">
              {TERMINUS_QUOTES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    slide === index ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-label={`Slide ${index}`}
                />
              ))}
              <button 
                onClick={handleNextSlide}
                className="ml-3 text-[10px] text-slate-400 hover:text-indigo-500 flex items-center gap-1 font-mono hover:underline cursor-pointer"
              >
                <span>NEXT PRESET</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* MAIN TRANSACTION AREA AND ACTION BUTTONS */}
          <div className="card-outer border border-slate-200/50 dark:border-indigo-950/30 bg-white dark:bg-slate-900/50 p-6 rounded-3xl shadow-xl space-y-5 backdrop-blur-xl relative">
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!emailInput.trim() || !nameInput.trim()) return;
                setIsSubmitting(true);
                setTimeout(() => {
                  setIsSubmitting(false);
                  onLoginSuccess(emailInput.trim(), nameInput.trim());
                }, 1000);
              }}
              className="space-y-4 text-left font-sans"
            >
              <div className="pb-1 text-center">
                <span className="text-[10px] font-bold text-indigo-505 dark:text-indigo-400 uppercase tracking-widest font-mono">
                  Enter Identity Credentials
                </span>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Authenticate using your name and email to enter the terminal.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Preferred Display Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Abiola Anjie"
                  className="w-full h-11 px-4 rounded-xl text-xs bg-slate-55 dark:bg-slate-905 border border-slate-200 dark:border-indigo-950/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/10 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Digital Email Coordinates
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full h-11 px-4 rounded-xl text-xs bg-slate-55 dark:bg-slate-905 border border-slate-200 dark:border-indigo-950/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/10 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold text-xs select-none active:scale-95 transition-all shadow-md shadow-indigo-500/15 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Establishing secure passage...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Passage & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>

          {/* PRIVACY FOOTER STATEMENT */}
          <footer className="text-center text-[10px] text-slate-400 dark:text-slate-500 leading-normal font-sans">
            By continuing, you agree to Trmn's local <span className="underline hover:text-indigo-400 cursor-pointer">Terms of Service</span>, <span className="underline hover:text-indigo-400 cursor-pointer">Sovereign Encryption Manifesto</span> and cookie specifications.
          </footer>

        </div>

      </main>

      {/* BOTTOM FOOTER CREDITS */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-slate-200/40 dark:border-indigo-950/20 flex flex-col sm:flex-row justify-between items-center gap-3 z-10 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
        <span>© 2026 TERMINUS COLLECTIVE INC. ALL ROADS LEAD TO TRMN.</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-indigo-400 cursor-pointer">Manifesto</span>
          <span>•</span>
          <span className="hover:text-indigo-400 cursor-pointer">Cryptography Ledger</span>
          <span>•</span>
          <span className="text-emerald-500 font-bold">● CLOUD SECURE DECK</span>
        </div>
      </footer>

    </div>
  );
}
