/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, createContext, useContext } from 'react';
import { ThemeSettings } from '../types';

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    const savedAccent = localStorage.getItem('accentColor') || '#6366F1';
    const savedTextSize = localStorage.getItem('textSize') as 'small' | 'default' | 'large' || 'default';
    const savedReduceMotion = localStorage.getItem('reduceMotion') === 'true';

    return {
      theme: savedTheme,
      accentColor: savedAccent,
      textSize: savedTextSize,
      reduceMotion: savedReduceMotion,
    };
  });

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('theme', updated.theme);
      localStorage.setItem('accentColor', updated.accentColor);
      localStorage.setItem('textSize', updated.textSize);
      localStorage.setItem('reduceMotion', String(updated.reduceMotion));
      return updated;
    });
  };

  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Inject CSS variables for custom styling variables dynamically
      document.documentElement.style.setProperty('--brand-500', settings.accentColor);
      document.documentElement.style.setProperty('--text-brand', settings.accentColor);
      
      // Derived accent hover (darker / lighter based on theme context)
      const adjustedHoverHex = isDark ? '#A5B4FC' : '#4F46E5';
      document.documentElement.style.setProperty('--brand-600', adjustedHoverHex);
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme, settings.accentColor]);

  // Handle global font size sizing classes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    if (settings.textSize === 'small') {
      root.classList.add('text-sm');
    } else if (settings.textSize === 'large') {
      root.classList.add('text-lg');
    } else {
      root.classList.add('text-base');
    }
  }, [settings.textSize]);

  // Handle reduced motion attribute
  useEffect(() => {
    if (settings.reduceMotion) {
      document.documentElement.setAttribute('data-reduce-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduce-motion');
    }
  }, [settings.reduceMotion]);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}
