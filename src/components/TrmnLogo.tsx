import React from 'react';

interface TrmnLogoProps {
  className?: string; // height/width classes like "h-8"
  themeMode?: 'light' | 'dark' | 'adaptive';
  showTagline?: boolean;
}

export function TrmnLogo({ className = "h-8", themeMode = 'adaptive', showTagline = false }: TrmnLogoProps) {
  // Determine color matching current theme
  const fillColor = themeMode === 'light' 
    ? '#6366F1' 
    : themeMode === 'dark' 
      ? '#FFFFFF' 
      : 'currentColor';

  const accentColor = themeMode === 'light' 
    ? '#6366F1' 
    : themeMode === 'dark' 
      ? '#FFFFFF' 
      : 'currentColor';

  const textColorClass = themeMode === 'light'
    ? 'text-[#6366F1]'
    : themeMode === 'dark'
      ? 'text-white'
      : 'text-[#6366F1] dark:text-white';

  return (
    <div className={`flex flex-col items-start select-none ${textColorClass}`}>
      <div className={`flex items-center gap-1.5 ${className}`}>
        {/* Interlocking Monogram custom vector path recreating the logo structure */}
        <svg
          viewBox="0 0 280 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          {/* Linked t-r monogram */}
          <path
            d="M50 22 C50 22, 60 10, 78 10 C96 10, 102 24, 102 42 L102 80 M78 10 C70 10, 64 15, 60 22 M60 22 L60 80 M34 34 L82 34"
            stroke={accentColor}
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Letter t vertical stem */}
          <path
            d="M44 14 L44 80"
            stroke={accentColor}
            strokeWidth="13"
            strokeLinecap="round"
          />
          
          {/* Letter m */}
          <path
            d="M125 34 C125 34, 131 22, 144 22 C157 22, 161 34, 161 46 L161 80 M161 46 C161 46, 167 22, 180 22 C193 22, 197 34, 197 46 L197 80 M113 34 L113 80"
            stroke={fillColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Letter n */}
          <path
            d="M225 34 C225 34, 232 22, 246 22 C260 22, 265 34, 265 46 L265 80 M213 34 L213 80"
            stroke={fillColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core Sparkle Star at endpoint */}
          <path
            d="M268 4 L271 10 L277 13 L271 16 L268 22 L265 16 L259 13 L265 10 Z"
            fill={accentColor}
          />
        </svg>
      </div>
      {showTagline && (
        <span className="text-[10px] uppercase tracking-[0.25em] text-indigo-500 font-bold mt-1 scale-90 origin-left select-none">
          Trmn pass
        </span>
      )}
    </div>
  );
}
