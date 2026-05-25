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
        <TrmnLogo className="h-7" themeMode="adaptive" showTagline={true} />
        
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
            
            <AnimatePresence mode="wait">
              {/* STATE 1: SELECTION METHOD */}
              {authMethod === 'none' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center mb-1">
                    ESTABLISH DISCOVER IDENTITY
                  </p>
                  
                  {/* BUTTON: MOBILE */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('mobile');
                      setShowCodeVerification(false);
                    }}
                    className="w-full h-12 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 border border-black/10 transition-transform duration-150 active:scale-98 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    Continue with Mobile
                  </button>

                  {/* BUTTON: EMAIL */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email');
                      setShowCodeVerification(false);
                    }}
                    className="w-full h-12 rounded-xl bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/20 text-slate-850 dark:text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 transition-transform duration-150 active:scale-98 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-indigo-400" />
                    Continue with Email
                  </button>

                  {/* THIRD PARTY SEPARATOR */}
                  <div className="flex items-center gap-3 pt-2 text-[10px] text-slate-400 font-mono tracking-widest my-2">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-white/5" />
                    <span>OR CONNECT DIRECT</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-white/5" />
                  </div>

                  {/* DOUBLE BOTTOM SOCIAL COLUMNS */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Google OAuth mockup button */}
                    <button
                      type="button"
                      onClick={handleInstantGoogleLogin}
                      className="h-11 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200/55 dark:border-white/5 transition-all duration-150 hover:scale-102 cursor-pointer"
                      title="Google sign-in"
                    >
                      {/* Stylized Google G logo */}
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66-1.06-1.01-2.27-1.01-3.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Google G</span>
                    </button>

                    {/* Fingerprint key code card passkey */}
                    <button
                      type="button"
                      onClick={handleInstantGoogleLogin}
                      className="h-11 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200/55 dark:border-white/5 transition-all duration-150 hover:scale-102 cursor-pointer"
                      title="Key pass code login"
                    >
                      <Key className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Passkey</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STATE 2: EMAIL INPUT SUBMIT FORM */}
              {authMethod === 'email' && !showCodeVerification && (
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleContinueEmail}
                  className="space-y-4 text-left"
                >
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs font-bold text-slate-400 font-mono">STEP 1: IDENTITY CREDENTIALS</span>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('none')}
                      className="text-xs text-indigo-400 hover:underline cursor-pointer"
                    >
                      Go Back
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Preferred Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Abiola Anjie"
                      className="w-full h-11 px-4 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-indigo-950/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Digital Email Coordinates
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full h-11 px-4 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-indigo-950/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
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
                        <span>Sending Access Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Request Security Passcode</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* STATE 3: MOBILE INPUT SUBMIT FORM */}
              {authMethod === 'mobile' && !showCodeVerification && (
                <motion.form
                  key="mobile-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleContinueMobile}
                  className="space-y-4 text-left"
                >
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs font-bold text-slate-400 font-mono">STEP 1: WIRELESS MOBILE</span>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('none')}
                      className="text-xs text-indigo-400 hover:underline cursor-pointer"
                    >
                      Go Back
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Preferred Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Abiola Anjie"
                      className="w-full h-11 px-4 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-indigo-950/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Cellular Phone Network Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">+1</span>
                      <input
                        type="tel"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="(555) 019-2834"
                        className="w-full h-11 pl-10 pr-4 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-indigo-950/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold text-xs select-none active:scale-95 transition-all shadow-md shadow-indigo-500/15 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending SMS Verify Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Request SMS Code</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* STATE 4: TWO-FACTOR OTP ACCESS LINK VERIFICATION */}
              {showCodeVerification && (
                <motion.form
                  key="code-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleVerifyCode}
                  className="space-y-4 text-left"
                >
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs font-bold text-amber-500 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      SECURE TERMINUS LINK
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCodeVerification(false)}
                      className="text-xs text-indigo-400 hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>

                  <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[10.5px] text-slate-400 text-center leading-relaxed font-sans">
                    🔑 Security code sent! Because you are logging into terminal <span className="text-indigo-400 font-bold">{authMethod === 'email' ? emailInput : `+1 ${phoneInput}`}</span>, type any 6-digit numeric pass pattern to verify.
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">
                      6-Digit Terminus Passcode
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={tempCode}
                      onChange={(e) => setTempCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • •  • • •"
                      className="w-full h-12 text-center text-lg tracking-[0.6em] font-extrabold rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-indigo-950/40 text-slate-800 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || tempCode.length < 4}
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800/50 text-white font-bold text-xs select-none active:scale-95 transition-all shadow-md shadow-emerald-500/15 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Ledger Keys...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Passage & Enter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

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
