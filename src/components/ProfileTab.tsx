import React, { useState } from 'react';
import { User, Sparkles, Mail, LayoutGrid, CheckCircle } from 'lucide-react';
import { SettingsAppearance } from './SettingsAppearance';

interface ProfileTabProps {
  userProfile: {
    name: string;
    email: string;
    bio: string;
    avatar: string;
  };
  onUpdateProfile: (updated: any) => void;
  onLogout?: () => void;
}

export function ProfileTab({ userProfile, onUpdateProfile, onLogout }: ProfileTabProps) {
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileEmail, setProfileEmail] = useState(userProfile.email);
  const [profileBio, setProfileBio] = useState(userProfile.bio);
  const [profileAvatar, setProfileAvatar] = useState(userProfile.avatar);

  const [toastMessage, setToastMessage] = useState(false);

  const emojisList = ['👩‍💻', '👨‍💻', '🎨', '🍸', '🍷', '🎸', '🎷', '🕶️', '🌟', '🔥', '✨', '🌻', '🌸', '🍕', '🥂'];

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      bio: profileBio.trim(),
      avatar: profileAvatar,
    });
    setToastMessage(true);
    setTimeout(() => setToastMessage(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 animate-fade-in text-left">
      {/* LEFT PORTION: EDIT DIGITAL PROFILE CREDENTIALS (5/12 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-indigo-950/20 shadow-sm text-left space-y-5">
          <div className="border-b border-slate-100 dark:border-white/5 pb-3">
            <h3 className="font-extrabold text-sm dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-violet-500 shrink-0" />
              Verified Identity Ledger
            </h3>
            <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
              Your public persona attributes coordinates. These prefill discover forms and ticket checks automatically.
            </p>
          </div>

          {toastMessage && (
            <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 rounded-xl text-xs font-bold text-center">
              🎉 Digital Identity parameters saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmitProfile} className="space-y-4">
            {/* Avatar Picker Emojis */}
            <div className="space-y-2">
              <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Select Profile Avatar Symbology</label>
              <div className="flex flex-wrap gap-2">
                {emojisList.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setProfileAvatar(em)}
                    className={`w-9 h-9 rounded-xl text-base flex items-center justify-center border cursor-pointer select-none transition-all active:scale-90 ${
                      profileAvatar === em
                        ? 'border-violet-500 bg-violet-500/15 text-violet-600 scale-105 ring-2 ring-violet-500/20 font-black'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile fields */}
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Display Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="field !h-10 text-xs"
                placeholder="Name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Primary Verification Email</label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="field !h-10 text-xs"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Bio Backstory Summary</label>
              <textarea
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                rows={4}
                className="field !h-auto text-xs py-2.5 resize-none leading-relaxed"
                placeholder="Tell guests about yourself..."
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs select-none active:scale-95 transition-all shadow-md shadow-violet-500/10 cursor-pointer"
            >
              Save Identity Settings
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full h-10 mt-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-500 dark:text-red-400 font-bold font-mono text-[11px] select-none active:scale-95 transition-all cursor-pointer border border-red-500/20"
              >
                Log Out from Terminal Portal
              </button>
            )}
          </form>
        </div>
      </div>

      {/* RIGHT PORTION: APP PREFERENCES AND SYSTEM APPEARANCE (7/12 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-indigo-950/20 shadow-sm text-left">
          <div className="border-b border-slate-100 dark:border-white/5 pb-3">
            <h3 className="font-sans font-bold text-sm dark:text-white flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-indigo-400 shrink-0" />
              App Preferences
            </h3>
            <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
              Control physical accessibility parameters, system interface appearance theme, typography sizing, and sliding motion effects.
            </p>
          </div>

          {/* Embedded Theme settings perfectly in file */}
          <div className="pt-2">
            <SettingsAppearance />
          </div>
        </div>
      </div>
    </div>
  );
}
