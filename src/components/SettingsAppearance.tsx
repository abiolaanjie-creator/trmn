/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAppTheme } from './ThemeHandler';
import { Settings, Minimize2 } from 'lucide-react';

export function SettingsAppearance() {
  const { settings, updateSettings } = useAppTheme();

  return (
    <div className="card shadow-md p-6 border border-slate-100 dark:border-indigo-950/20 bg-white dark:bg-[#16152B] relative select-text">
      {/* Panel header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/45 text-indigo-500 dark:text-indigo-400">
          <Settings className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold font-sans">App Preferences</h3>
      </div>

      <div className="space-y-6">
        {/* ── SEGMENT 1: THREE-SEGMENT THEME TOGGLE ── */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            System Appearance
          </label>
          <div className="theme-toggle" role="group" aria-label="Theme selection control">
            {(['light', 'system', 'dark'] as const).map((t) => (
              <button
                key={t}
                onClick={() => updateSettings({ theme: t })}
                className={`theme-btn capitalize cursor-pointer font-semibold ${settings.theme === t ? 'active' : ''}`}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── SEGMENT 2: TEXT SCALE ADJUSTMENT ── */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Interface Text Scaling
          </label>
          <div className="flex gap-2">
            {(['small', 'default', 'large'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => updateSettings({ textSize: sz })}
                className={`flex-1 h-9 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  settings.textSize === sz
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm'
                    : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {sz === 'small' ? 'Small' : sz === 'large' ? 'Large' : 'Default'}
              </button>
            ))}
          </div>
        </div>

        {/* ── SEGMENT 3: REDUCED MOTION SWITCH ── */}
        <div className="settings-row !px-0 bg-transparent dark:bg-transparent border-t border-slate-100 dark:border-indigo-950/20 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Minimize2 className="w-4 h-4 text-slate-400" />
            <div className="text-left">
              <p className="font-semibold text-xs text-slate-700 dark:text-slate-200">Reduce Interface Motion</p>
              <p className="text-[10px] text-slate-400 font-normal">Halts high-intensity flashing, sliding, or keyframes</p>
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="reduced-motion-checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
              aria-label="Reduce motion checkbox toggle"
            />
            <div className="switch-track"></div>
            <div className="switch-thumb"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
