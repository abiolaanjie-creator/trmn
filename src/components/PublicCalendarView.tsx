import React, { useState } from 'react';
import { Calendar, Ticket, MapPin, Sparkles } from 'lucide-react';
import { EventDetails, Attendee } from '../types';
import { PassCardPreview } from './PassCardPreview';
import { ConfettiShower } from './ConfettiShower';
import { formatPassDate, signAttendeePass } from '../utils/passHelpers';
import { renderPassToCanvas } from '../utils/canvasExporter';
import { jsPDF } from 'jspdf';

interface PublicCalendarViewProps {
  presets: EventDetails[];
  publicUser: string;
  publicTitle: string;
  publicTheme: string;
  userProfile: { name: string; email: string };
  onRegisterPass: (event: EventDetails, badgeClass: string, visitorName: string, visitorEmail: string) => void;
}

export function PublicCalendarView({
  presets,
  publicUser,
  publicTitle,
  publicTheme,
  userProfile,
  onRegisterPass,
}: PublicCalendarViewProps) {
  const [publicSubscribeEmail, setPublicSubscribeEmail] = useState('');
  const [publicSubscribedSuccess, setPublicSubscribedSuccess] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Modal registration/pass states
  const [selectedDiscoverEvent, setSelectedDiscoverEvent] = useState<EventDetails | null>(null);
  const [selectedPassModal, setSelectedPassModal] = useState<{ event: EventDetails; attendee: Attendee } | null>(null);
  const [customRegisterBadge, setCustomRegisterBadge] = useState('GENERAL');

  // Multi theme matching options
  const themeStyles: Record<string, { bg: string; text: string; headerBg: string; pill: string; btn: string; border: string }> = {
    standard: {
      bg: 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100',
      text: 'text-slate-900 dark:text-white',
      headerBg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
      pill: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      border: 'border-slate-200 dark:border-slate-805'
    },
    midnight: {
      bg: 'bg-[#00000a] text-purple-100',
      text: 'text-white',
      headerBg: 'bg-[#120024] border-purple-900',
      pill: 'bg-purple-950/50 text-purple-300 border border-purple-800/30',
      btn: 'bg-purple-600 hover:bg-purple-700 text-white',
      border: 'border-purple-950'
    },
    neon: {
      bg: 'bg-zinc-950 text-zinc-100',
      text: 'text-white font-mono',
      headerBg: 'bg-zinc-900 border-zinc-800',
      pill: 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30',
      btn: 'bg-[#10B981] hover:bg-[#059669] text-black font-extrabold',
      border: 'border-zinc-900'
    },
    warm: {
      bg: 'bg-[#FAF6F0] dark:bg-[#1C1712] text-amber-900 dark:text-amber-100',
      text: 'text-amber-950 dark:text-amber-50',
      headerBg: 'bg-white dark:bg-[#281F19] border-amber-200 dark:border-amber-950',
      pill: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
      border: 'border-amber-200 dark:border-amber-950'
    },
    forest: {
      bg: 'bg-[#F4F9F6] dark:bg-[#0C1510] text-emerald-900 dark:text-emerald-100',
      text: 'text-emerald-950 dark:text-emerald-50',
      headerBg: 'bg-white dark:bg-[#13241C] border-emerald-100 dark:border-emerald-900',
      pill: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      border: 'border-emerald-200 dark:border-emerald-900'
    }
  };

  const currentVibe = themeStyles[publicTheme] || themeStyles.standard;

  return (
    <div className={`min-h-screen pb-20 select-text ${currentVibe.bg}`}>
      {/* PUBLIC CALENDAR HEADER */}
      <header className={`sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md ${currentVibe.headerBg}`}>
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${currentVibe.pill}`}>
            <Calendar className="w-5 h-5 shrink-0" />
          </div>
          <div className="text-left leading-none">
            <h1 className="text-sm font-extrabold tracking-tight">{publicUser}'s Portal</h1>
            <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">Trmn Verified Directory Partner</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#10B981] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span> Live Profile
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-10 space-y-12">
        {/* Cover Intro */}
        <div className={`p-8 rounded-3xl border text-center space-y-4 shadow-sm bg-white dark:bg-slate-905/45 ${currentVibe.border}`}>
          <span className={`text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full ${currentVibe.pill}`}>
            Welcome Visitor
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{publicTitle}</h2>
          <p className="text-sm opacity-75 max-w-lg mx-auto">
            Welcome to my verified event calendar directory. Browse my schedule, secure digital ticket passes, and subscribe for notification updates.
          </p>
          
          {/* Subscriber feeds */}
          <div className="max-w-md mx-auto pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Join notifications newsletter</h4>
            {publicSubscribedSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold tracking-tight animate-fade-in">
                🎉 Subscribed Successfully! You will be notified on any schedule changes.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!publicSubscribeEmail.trim()) return;
                  setPublicSubscribeEmail('');
                  setPublicSubscribedSuccess(true);
                  setConfettiTrigger(t => t + 1);
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={publicSubscribeEmail}
                  onChange={(e) => setPublicSubscribeEmail(e.target.value)}
                  className="flex-1 input h-10 px-3.5 text-xs rounded-xl border border-slate-205 dark:border-white/10 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className={`h-10 px-4 text-xs font-bold rounded-xl ${currentVibe.btn} cursor-pointer`}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* SCHEDULE LIST */}
        <div className="space-y-6 text-left">
          <h3 className="text-lg font-extrabold tracking-tight uppercase flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-500 shrink-0" /> Open Scheduled Events ({presets.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {presets.map((evt) => (
              <div
                key={evt.id} 
                className={`rounded-2xl border bg-white dark:bg-slate-900/60 overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200 ${currentVibe.border}`}
              >
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-400">
                    <span>{evt.category || 'Event'}</span>
                    <span className="text-emerald-500">{evt.ticketPrice && evt.ticketPrice > 0 ? `$${evt.ticketPrice}` : 'FREE'}</span>
                  </div>

                  <h3 className="text-base font-bold dark:text-white tracking-tight line-clamp-1">{evt.name}</h3>
                  <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">{evt.shortDescription}</p>

                  <div className="space-y-1.5 text-[11px] font-medium opacity-80 pt-2 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatPassDate(evt.dateTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-white/5 flex gap-2">
                  <button
                    onClick={() => setSelectedDiscoverEvent(evt)}
                    className="flex-1 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 text-[11px] border border-transparent hover:border-indigo-500/10 cursor-pointer text-center"
                  >
                    Acquire Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER WATERMARK */}
      <div className="py-12 border-t border-slate-100 dark:border-white/5 text-center text-[10px] opacity-50 font-mono uppercase tracking-widest text-slate-400">
        Secured Offline Cryptographic Hub • Trmn App v1.0
      </div>

      {/* REGISTER FORM IF CALLED */}
      {selectedDiscoverEvent && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedDiscoverEvent(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-fade-in select-text"
        >
          <div className="bg-white dark:bg-[#110F2B] max-w-md w-full rounded-2xl p-6 border border-slate-200 dark:border-indigo-950/20 text-left space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedDiscoverEvent(null)}
              className="absolute right-4 top-4 hover:bg-slate-150 text-slate-400 text-lg font-bold p-1 rounded-full"
            >
              ×
            </button>
            <h3 className="text-base font-extrabold tracking-tight inline-flex items-center gap-1.5 dark:text-white">
              <Ticket className="w-4.5 h-4.5 text-emerald-400" /> Acquire Digital Pass
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reserving entry pass for <strong className="text-slate-900 dark:text-white">{selectedDiscoverEvent.name}</strong>.
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase">Your Name</span>
                <input
                  type="text"
                  required
                  defaultValue={userProfile.name}
                  className="field !h-9 text-xs"
                  id="public-register-name-val"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase">Your Email</span>
                <input
                  type="email"
                  required
                  defaultValue={userProfile.email}
                  className="field !h-9 text-xs"
                  id="public-register-email-val"
                />
              </div>
              <div className="space-y-1 block">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase">Preference Class Tier</span>
                <select
                  className="field !h-9 text-xs cursor-pointer"
                  value={customRegisterBadge}
                  onChange={(e) => setCustomRegisterBadge(e.target.value)}
                >
                  <option value="GENERAL">General Admission</option>
                  <option value="VIP">Premium VIP Pass</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDiscoverEvent(null)}
                className="px-4 py-1.5 rounded-lg font-bold text-[11px] hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const nameVal = (document.getElementById('public-register-name-val') as HTMLInputElement)?.value || userProfile.name;
                  const emailVal = (document.getElementById('public-register-email-val') as HTMLInputElement)?.value || userProfile.email;
                  
                  const guestId = 'pub-' + Math.random().toString(36).substring(2, 9);
                  const passCode = Math.floor(1000 + Math.random() * 9000);
                  const signature = signAttendeePass(selectedDiscoverEvent.id, guestId, selectedDiscoverEvent.secretKey);
                  
                  const guestPassEntry: Attendee = {
                    id: guestId,
                    name: nameVal,
                    type: customRegisterBadge,
                    email: emailVal,
                    status: 'registered',
                    passId: `EVT-2026-${passCode}`,
                    hmacSignature: signature
                  };

                  onRegisterPass(selectedDiscoverEvent, customRegisterBadge, nameVal, emailVal);
                  setSelectedDiscoverEvent(null);
                  setSelectedPassModal({ event: selectedDiscoverEvent, attendee: guestPassEntry });
                  setConfettiTrigger(t => t + 1);
                }}
                className={`px-4 py-1.5 rounded-lg font-bold text-[11px] ${currentVibe.btn} cursor-pointer shadow-md`}
              >
                Obtain Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURE PASS DETAILS POPUP MODAL */}
      {selectedPassModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedPassModal(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/55 select-text animate-fade-in"
        >
          <div className="bg-[#0B0A16] max-w-lg w-full rounded-3xl p-6 border border-white/5 text-center space-y-6 shadow-2xl relative">
            <div className="space-y-1">
              <span className="text-[10px] tracking-widest font-mono font-bold uppercase text-emerald-400">Offline Authenticated</span>
              <h3 className="text-lg font-black text-white">{selectedPassModal.event.name} Ticket</h3>
            </div>

            <div className="flex justify-center select-none">
              <PassCardPreview event={selectedPassModal.event} attendee={selectedPassModal.attendee} />
            </div>

            <div className="bg-slate-900/40 p-4 border border-white/5 rounded-2xl text-left space-y-2 text-[11px] text-slate-355">
              <p className="font-mono text-xs text-center border-b border-white/5 pb-2 uppercase tracking-wide text-indigo-300">
                Code: {selectedPassModal.attendee.passId} • Signature Match
              </p>
              <p className="leading-relaxed text-slate-400 text-center">
                Verify gates securely. Click PNG / PDF below to save ticket.
              </p>
            </div>

            <div className="flex justify-end gap-2 text-[11px] font-bold">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const canvas = await renderPassToCanvas(selectedPassModal.event, selectedPassModal.attendee);
                    const url = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${selectedPassModal.attendee.name.replace(/\s+/g, '_')}_pass.png`;
                    link.click();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white cursor-pointer"
              >
                PNG Pass
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const canvas = await renderPassToCanvas(selectedPassModal.event, selectedPassModal.attendee);
                    const url = canvas.toDataURL('image/png');
                    const isSquare = selectedPassModal.event.template === 'CANVAS';
                    const pdf = new jsPDF({
                      orientation: 'landscape',
                      unit: 'px',
                      format: [700, isSquare ? 500 : 400],
                    });
                    pdf.addImage(url, 'PNG', 0, 0, 700, isSquare ? 500 : 400);
                    pdf.save(`${selectedPassModal.attendee.name.replace(/\s+/g, '_')}_pass.pdf`);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              >
                Print PDF
              </button>
              <button
                type="button"
                onClick={() => setSelectedPassModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
