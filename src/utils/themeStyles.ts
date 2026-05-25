/**
 * Theme style configurations for Trmn Event Pages.
 * Separated into clean modular Tailwind style variables to modify both the
 * Creator Studio workspace (manage view) and the public-facing booking pages.
 */

import React from 'react';

export type EventPageThemeType =
  | 'default'
  | 'standard_minimalist'
  | 'midnight_cosmic'
  | 'radiant_cyber_neon'
  | 'rustic_amber'
  | 'moss_whisper'
  | 'geometric_grid'
  | 'solstice_shift'
  | 'standard' // Compatibility mapping
  | 'midnight' // Compatibility mapping
  | 'neon'     // Compatibility mapping
  | 'warm'     // Compatibility mapping
  | 'forest';   // Compatibility mapping

export interface ThemeStylesConfig {
  key: EventPageThemeType;
  name: string;
  description: string;
  // CSS Classes
  isDarkTheme: boolean;
  pageBg: string; // Background class for the outer page
  textPrimary: string; // Core headings color
  textSecondary: string; // Labels and descriptions
  cardBg: string; // Inner container backgrounds
  cardBorder: string; // Inner boundaries
  btnPrimary: string; // Core solid button color & animation
  btnSecondary: string; // Outline hover style
  inputBg: string; // Dropdowns / fields background
  inputBorder: string; // Field borders
  accentBadge: string; // Little text pill chips
  focusRing: string; // Blue, magenta, or cobalt focus borders
  fontFamily: string; // sans, serif, or mono
  customStyles?: React.CSSProperties; // Repeating radial gradients or seasonal shift variables
}

/**
 * Gets the current season for Solstice Shift
 * Spring & Summer (March 21 - Sept 21): crisp white, solar coral, mint
 * Autumn & Winter (Sept 22 - March 20): rich navy, cinnamon amber, frosted blue
 */
export function getSolsticeThemeConfig(): {
  seasonName: string;
  isSpringSummer: boolean;
  pageBg: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  cardBorder: string;
  btnPrimary: string;
  btnSecondary: string;
  inputBg: string;
  inputBorder: string;
  accentBadge: string;
  focusRing: string;
  fontFamily: string;
  customBgStyle?: React.CSSProperties;
} {
  // Use the system month (0-indexed, so May is 4, June is 5, Sept is 8)
  const month = new Date().getMonth();
  // Spring/Summer: April (3), May (4), June (5), July (6), August (7)
  // Plus mid-March (index 2) and mid-Sept (index 8)
  const isSpringSummer = month >= 3 && month <= 7;

  if (isSpringSummer) {
    return {
      seasonName: 'Solstice Spring/Summer',
      isSpringSummer: true,
      pageBg: 'bg-white',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      cardBg: 'bg-slate-50/70 border border-slate-205/50 shadow-sm rounded-2xl',
      cardBorder: 'border-slate-200/50',
      btnPrimary: 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[#F97316]/20 shadow-md rounded-xl font-bold cursor-pointer transition-all', // solar coral
      btnSecondary: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 rounded-xl font-bold cursor-pointer transition-all',
      inputBg: 'bg-white',
      inputBorder: 'border-slate-200 focus:border-[#F97316]',
      accentBadge: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-bold', // mint accent
      focusRing: 'focus:ring-[#F97316] focus:border-[#F97316]',
      fontFamily: 'font-sans',
    };
  } else {
    return {
      seasonName: 'Solstice Autumn/Winter',
      isSpringSummer: false,
      pageBg: 'bg-[#0B132B]', // rich navy
      textPrimary: 'text-white',
      textSecondary: 'text-slate-350',
      cardBg: 'bg-[#1C2541]/80 border border-[#222E50]/40 shadow-xl rounded-2xl',
      cardBorder: 'border-[#222E50]/40',
      btnPrimary: 'bg-[#D97706] hover:bg-[#B45309] text-white shadow-[#D97706]/20 shadow-md rounded-xl font-bold cursor-pointer transition-all', // cinnamon amber
      btnSecondary: 'bg-[#1C2541] hover:bg-[#2A355A] text-[#93C5FD] border-transparent rounded-xl font-bold cursor-pointer transition-all', // frosted blue text
      inputBg: 'bg-[#0B132B]/80',
      inputBorder: 'border-[#222E50] focus:border-[#D97706]',
      accentBadge: 'bg-[#93C5FD]/10 text-[#93C5FD] border border-[#93C5FD]/20 font-bold', // frosted blue accent
      focusRing: 'focus:ring-[#D97706] focus:border-[#D97706]',
      fontFamily: 'font-sans',
    };
  }
}

export function getThemeStyles(theme: EventPageThemeType = 'default'): ThemeStylesConfig {
  const normTheme = (theme || 'default').toLowerCase() as EventPageThemeType;

  switch (normTheme) {
    case 'standard_minimalist':
    case 'standard':
      return {
        key: 'standard_minimalist',
        name: 'Standard Minimalist',
        description: 'High-end "Tech Minimal" look utilizing ample whitespace, soft shadows, off-white background and deep charcoal.',
        isDarkTheme: false,
        pageBg: 'bg-[#F9FAFB]',
        textPrimary: 'text-[#111827] font-semibold',
        textSecondary: 'text-slate-500',
        cardBg: 'bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03),0_2px_4px_-1px_rgba(0,0,0,0.02)] border border-slate-100 rounded-2xl',
        cardBorder: 'border-slate-100',
        btnPrimary: 'bg-[#111827] hover:bg-slate-800 text-white font-semibold shadow-md active:scale-95 transition-all rounded-xl cursor-pointer',
        btnSecondary: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm rounded-xl font-semibold cursor-pointer transition-all',
        inputBg: 'bg-white',
        inputBorder: 'border-slate-200 focus:border-blue-650',
        accentBadge: 'bg-blue-50 text-blue-600 border border-blue-100 font-bold rounded-full',
        focusRing: 'focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ring-offset-2',
        fontFamily: 'font-sans',
      };

    case 'midnight_cosmic':
    case 'midnight':
    case 'radiant_cyber_neon':
    case 'neon':
      return getThemeStyles('default');

    case 'rustic_amber':
    case 'warm':
      return {
        key: 'rustic_amber',
        name: 'Rustic Amber',
        description: 'Warm espresso typography, oatmeal texturing background and wider rounded borders with terracotta accents.',
        isDarkTheme: false,
        pageBg: 'bg-[#FAF6F0]',
        textPrimary: 'text-[#3E2723] font-serif font-black',
        textSecondary: 'text-[#6D4C41] font-serif',
        cardBg: 'bg-[#FDFBF7] border border-[#E7D7C1] hover:border-[#D7BA9D] shadow-sm rounded-3xl p-6 transition-all duration-300',
        cardBorder: 'border-[#E7D7C1]',
        btnPrimary: 'bg-[#D95D39] hover:bg-[#C24E2B] text-white font-serif font-bold shadow-md shadow-[#D95D39]/10 rounded-3xl active:scale-95 transition-all cursor-pointer',
        btnSecondary: 'bg-[#FAF6F0] hover:bg-[#F0E6D8] text-[#3E2723] border-[#E7D7C1] rounded-3xl font-serif font-bold cursor-pointer transition-all',
        inputBg: 'bg-white',
        inputBorder: 'border-[#E7D7C1] focus:border-[#D95D39]',
        accentBadge: 'bg-[#D95D39]/10 text-[#D95D39] border border-[#D95D39]/20 font-bold rounded-2xl font-serif',
        focusRing: 'focus:ring-2 focus:ring-[#D95D39] focus:border-[#D95D39]',
        fontFamily: 'font-serif',
      };

    case 'moss_whisper':
    case 'forest':
      return {
        key: 'moss_whisper',
        name: 'Moss Whisper',
        description: 'Pale biophilic sage background, deep forest slate font, eucalyptus buttons and flat quiet layouts.',
        isDarkTheme: false,
        pageBg: 'bg-[#ECEFEA]',
        textPrimary: 'text-[#2C3E35] font-semibold tracking-tight',
        textSecondary: 'text-[#556F60]',
        cardBg: 'bg-[#FAFCFA] border border-[#D2DDD6] shadow-sm rounded-none',
        cardBorder: 'border-[#D2DDD6]',
        btnPrimary: 'bg-[#4E705F] hover:bg-[#3E5B4B] text-white font-medium rounded-none active:translate-y-px shadow-none transition-all cursor-pointer',
        btnSecondary: 'bg-[#FAFCFA] hover:bg-[#EFF3EF] text-[#2C3E35] border-[#D2DDD6] rounded-none font-medium cursor-pointer transition-all',
        inputBg: 'bg-[#FAFCFA] rounded-none',
        inputBorder: 'border-[#D2DDD6] focus:border-[#4E705F]',
        accentBadge: 'bg-[#4E705F]/10 text-[#4E705F] border border-[#4E705F]/20 font-bold rounded-none',
        focusRing: 'focus:ring-1 focus:ring-[#4E705F] focus:border-[#4E705F]',
        fontFamily: 'font-sans',
      };

    case 'geometric_grid':
      return {
        key: 'geometric_grid',
        name: 'Geometric Grid',
        description: 'Repeating dot-matrix graph background pattern with solid white mask layouts and high contrast cobalt accents.',
        isDarkTheme: false,
        pageBg: 'bg-[#F1F5F9]',
        textPrimary: 'text-slate-900 font-bold tracking-tight',
        textSecondary: 'text-slate-500',
        cardBg: 'bg-white/95 border-2 border-slate-300 shadow-[4px_4px_0px_0px_#2563EB] rounded-lg p-6 hover:shadow-[6px_6px_0px_0px_#2563EB] transition-all duration-300',
        cardBorder: 'border-slate-300 border-2',
        btnPrimary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg cursor-pointer',
        btnSecondary: 'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 rounded-lg font-bold cursor-pointer transition-all',
        inputBg: 'bg-white border-2 rounded-lg',
        inputBorder: 'border-r-2 border-l-2 border-2 border-slate-300 focus:border-[#2563EB]',
        accentBadge: 'bg-[#2563EB]/10 text-[#2563EB] border-2 border-[#2563EB]/25 font-black text-[9px] uppercase tracking-wide rounded-md',
        focusRing: 'focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]',
        fontFamily: 'font-sans',
        customStyles: {
          backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
        },
      };

    case 'solstice_shift': {
      const liveSeasonal = getSolsticeThemeConfig();
      return {
        key: 'solstice_shift',
        name: `Solstice Shift (${liveSeasonal.isSpringSummer ? 'Spring/Summer' : 'Autumn/Winter'})`,
        description: 'Automatically shifts styling layout based on the current season (Spring/Summer vs Autumn/Winter).',
        isDarkTheme: !liveSeasonal.isSpringSummer,
        pageBg: liveSeasonal.pageBg,
        textPrimary: liveSeasonal.textPrimary,
        textSecondary: liveSeasonal.textSecondary,
        cardBg: liveSeasonal.cardBg,
        cardBorder: liveSeasonal.cardBorder,
        btnPrimary: liveSeasonal.btnPrimary,
        btnSecondary: liveSeasonal.btnSecondary,
        inputBg: liveSeasonal.inputBg,
        inputBorder: liveSeasonal.inputBorder,
        accentBadge: liveSeasonal.accentBadge,
        focusRing: liveSeasonal.focusRing,
        fontFamily: liveSeasonal.fontFamily,
      };
    }

    case 'default':
    default:
      // System default responsive state
      return {
        key: 'default',
        name: 'System Default',
        description: 'Standard responsive dark/light system setup. Adapts natively with user workspace triggers.',
        isDarkTheme: false, // controlled by app state
        pageBg: 'bg-[#F7F6F3] dark:bg-[#09081A]',
        textPrimary: 'text-slate-800 dark:text-white font-bold',
        textSecondary: 'text-slate-400 dark:text-slate-500',
        cardBg: 'bg-white dark:bg-[#110F2B] border border-slate-200/40 dark:border-slate-800/50 shadow-sm',
        cardBorder: 'border-slate-200/40 dark:border-slate-805/50',
        btnPrimary: 'bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer',
        btnSecondary: 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/30 dark:border-white/5 shadow-inner rounded-xl font-bold cursor-pointer transition-all',
        inputBg: 'bg-white dark:bg-slate-950',
        inputBorder: 'border-slate-200/50 dark:border-white/5 focus:border-violet-500',
        accentBadge: 'bg-indigo-500/10 text-violet-500 dark:text-violet-400 font-bold px-2 py-0.5 rounded',
        focusRing: 'focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
        fontFamily: 'font-sans',
      };
  }
}
