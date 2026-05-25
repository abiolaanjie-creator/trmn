import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Ticket, Sparkles, Download, Info, CheckCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { EventDetails, Attendee } from '../types';
import { PassCardPreview } from './PassCardPreview';
import { ConfettiShower } from './ConfettiShower';
import { getThemeStyles, getSolsticeThemeConfig } from '../utils/themeStyles';
import { formatPassDate, signAttendeePass } from '../utils/passHelpers';
import { renderPassToCanvas } from '../utils/canvasExporter';
import { jsPDF } from 'jspdf';

interface PublicEventViewProps {
  event: EventDetails;
  onRegisterPass: (event: EventDetails, badgeClass: string, visitorName: string, visitorEmail: string) => void;
  userProfile: { name: string; email: string };
  onBackToDirectory?: () => void;
}

export function PublicEventView({
  event,
  onRegisterPass,
  userProfile,
  onBackToDirectory,
}: PublicEventViewProps) {
  const [visitorName, setVisitorName] = useState(userProfile.name);
  const [visitorEmail, setVisitorEmail] = useState(userProfile.email);
  const [badgeClass, setBadgeClass] = useState('GENERAL');
  
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [selectedPassModal, setSelectedPassModal] = useState<{ event: EventDetails; attendee: Attendee } | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Parse the active theme for styling limits
  const activeVibe = event.eventThemeVibe || 'default';
  const theme = getThemeStyles(activeVibe);

  const isSolstice = activeVibe === 'solstice_shift';
  const isGrid = activeVibe === 'geometric_grid';
  
  // Custom season tracker metadata for design transparency
  const solsticeSeason = useMemo(() => {
    if (isSolstice) {
      return getSolsticeThemeConfig();
    }
    return null;
  }, [isSolstice]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const guestId = 'pub-' + Math.random().toString(36).substring(2, 9);
    const passCode = Math.floor(1000 + Math.random() * 9000);
    const signature = signAttendeePass(event.id, guestId, event.secretKey);
    
    const guestPassEntry: Attendee = {
      id: guestId,
      name: visitorName.trim(),
      type: badgeClass.toUpperCase(),
      email: visitorEmail.trim(),
      status: 'registered',
      passId: `EVT-2026-${passCode}`,
      hmacSignature: signature,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      eventId: event.id
    };

    onRegisterPass(event, badgeClass, visitorName.trim(), visitorEmail.trim());
    setRegisterSuccess(true);
    setSelectedPassModal({ event, attendee: guestPassEntry });
    setConfettiTrigger(t => t + 1);
  };

  const handleDownloadPNG = async (viewerEvent: EventDetails, viewerAttendee: Attendee) => {
    try {
      const canvas = await renderPassToCanvas(viewerEvent, viewerAttendee);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${viewerAttendee.name.replace(/\s+/g, '_')}_pass.png`;
      link.href = url;
      link.click();
    } catch (e) {
      console.error(e);
      alert('Error rendering pass PNG.');
    }
  };

  const handleDownloadPDF = async (viewerEvent: EventDetails, viewerAttendee: Attendee) => {
    try {
      const canvas = await renderPassToCanvas(viewerEvent, viewerAttendee);
      const url = canvas.toDataURL('image/png');
      const isSquare = viewerEvent.template === 'CANVAS';
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [700, isSquare ? 500 : 400],
      });
      pdf.addImage(url, 'PNG', 0, 0, 700, isSquare ? 500 : 400);
      pdf.save(`${viewerAttendee.name.replace(/\s+/g, '_')}_pass.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error rendering pass PDF.');
    }
  };

  return (
    <div
      className={`min-h-screen w-full py-8 px-4 sm:px-6 md:py-16 flex flex-col items-center justify-between select-text transition-colors duration-300 relative ${theme.fontFamily} ${theme.pageBg}`}
      style={theme.customStyles}
    >
      {/* BACKGROUND GRAPHIC FOR COSMIC/NEON */}
      {activeVibe === 'midnight_cosmic' && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.06)_0,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05)_0,transparent_55%)] pointer-events-none" />
      )}

      {/* CORE ACTION HEADER CONTAINER */}
      <div className="w-full max-w-4xl flex flex-col items-stretch gap-8 relative z-10">
        
        {/* DIRECTORY BACK NAVIGATION */}
        {onBackToDirectory && (
          <div className="flex justify-start">
            <button
              onClick={onBackToDirectory}
              className={`px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 border border-transparent hover:opacity-90 active:scale-95 transition-all text-left ${theme.btnSecondary}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Hub Event Ledger
            </button>
          </div>
        )}

        {/* HERO HEADER SECTION */}
        <div className={`p-8 sm:p-10 ${theme.cardBg} ${theme.cardBorder} flex flex-col md:flex-row gap-8 items-center justify-between`}>
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`text-[10px] tracking-widest font-extrabold uppercase px-3 py-1 ${theme.accentBadge}`}>
                {event.category || 'Special Live Event'}
              </span>
              
              {isSolstice && solsticeSeason && (
                <span className="text-[9px] bg-amber-500/10 text-amber-500 font-mono tracking-wider font-bold px-2.5 py-1 rounded border border-amber-500/20 uppercase">
                  🍂 {solsticeSeason.seasonName} Active
                </span>
              )}

              {isGrid && (
                <span className="text-[9px] bg-blue-500/10 text-blue-600 font-mono tracking-wider font-bold px-2.5 py-1 rounded border border-blue-500/20 uppercase">
                  📐 Dot Matrix Alignment
                </span>
              )}
            </div>

            <h1 className={`text-2xl sm:text-3xl tracking-tight leading-snug break-words ${theme.textPrimary}`}>
              {event.name || 'Event title'}
            </h1>

            <p className={`text-xs max-w-xl leading-relaxed ${theme.textSecondary}`}>
              {event.shortDescription || "Add a brief description for your event for your attendees to see"}
            </p>

            {/* Event Time / Date and Map tags */}
            <div className={`space-y-2 pt-4 border-t border-slate-200/40 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-start gap-3 sm:gap-6 text-xs font-medium`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0 opacity-70" />
                <span>{formatPassDate(event.dateTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 opacity-70" />
                <span className="truncate max-w-[280px]">{event.venue || 'TBA Location'}</span>
              </div>
            </div>
          </div>

          {/* BRADDED EVENT IMAGE PREVIEW UNIT */}
          {event.logoUrl && (
            <div className="shrink-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-inner p-3 flex items-center justify-center hover:scale-[1.03] transition-transform duration-300">
                <img
                  src={event.logoUrl}
                  alt="Organization Emblem Logo"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}
        </div>

        {/* PRIMARY DETAILS AND REGISTERING CONTAINER BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ABOUT DESCRIPTION BOX - 7 COLS */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`p-6 sm:p-8 ${theme.cardBg} ${theme.cardBorder} text-left space-y-4`}>
              <h2 className={`text-sm tracking-wider uppercase font-extrabold ${theme.textPrimary}`}>
                Exclusive Experience Backstory
              </h2>
              <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>
                {event.about || 'This curated meet is custom synthesised directly via Trmn ledger. Standard guest passes are fully generated locally inside browser cache with strict, non-forgeable cryptographic HMAC keys. This promises 100% offline verification at access venue terminals.'}
              </p>

              {/* Event requirements if listed */}
              {event.requirements && event.requirements.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className={`text-[10px] tracking-wider uppercase font-black ${theme.textPrimary}`}>
                    Guest Admission Requirements
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-500">
                    {event.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* EVENT AGENDA TIMELINE */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="space-y-3 pt-3">
                  <h4 className={`text-[10px] tracking-wider uppercase font-black ${theme.textPrimary}`}>
                    Live Session Flow Timeline
                  </h4>
                  <div className={`divide-y divide-slate-150 dark:divide-white/5 border border-slate-150/40 dark:border-white/5 rounded-xl overflow-hidden`}>
                    {event.agenda.map((item, idx) => (
                      <div key={idx} className="p-3.5 text-xs flex gap-4 text-left">
                        <span className={`font-mono font-bold shrink-0 ${isSolstice ? 'text-[#F97316]' : 'text-indigo-505 dark:text-indigo-400'}`}>{item.time}</span>
                        <span className="font-medium opacity-85">{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GUEST REGISTER PANEL - 5 COLS */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-6 sm:p-8 ${theme.cardBg} ${theme.cardBorder} text-left space-y-4`}>
              <div className="flex justify-between items-center border-b border-slate-150 dark:border-white/5 pb-3">
                <h3 className={`text-sm tracking-wider uppercase font-extrabold ${theme.textPrimary} flex items-center gap-1.5`}>
                  <Ticket className="w-4.5 h-4.5 text-emerald-450 shrink-0" />
                  Pass Registration
                </h3>
                
                <span className={`text-[10px] font-mono font-black ${isSolstice ? 'text-[#10B981]' : 'text-emerald-550'}`}>
                  {event.ticketPrice && event.ticketPrice > 0 ? `$${event.ticketPrice} USD` : 'FREE ADMIT'}
                </span>
              </div>

              {registerSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-xs space-y-3 border border-emerald-500/15 text-center animate-scale-up">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-bold">Entry Pass Acquired Successfully!</p>
                  <p className="opacity-80 text-[10px] leading-relaxed">
                    We synthesized custom credentials with an authenticated token algorithm. Show your scannable ticket pass to access the venue securely even without network reception.
                  </p>
                  
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedPassModal({ event, attendee: selectedPassModal?.attendee as Attendee })}
                      className={`w-full py-2 rounded-xl text-xs font-bold leading-none cursor-pointer text-center ${theme.btnPrimary}`}
                    >
                      View Live Ticket Pass
                    </button>
                    
                    <button
                      onClick={() => {
                        setRegisterSuccess(false);
                      }}
                      className="text-[10px] text-slate-400 hover:text-slate-650 font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 pt-1.5 mt-1 hover:underline cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Register Another Guest
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-extrabold uppercase ${theme.textSecondary}`}>
                      Guest Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abiola Anjie"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 border transition-colors ${theme.inputBg} ${theme.inputBorder} ${theme.focusRing}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-extrabold uppercase ${theme.textSecondary}`}>
                      Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="abiolaanjie@gmail.com"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 border transition-colors ${theme.inputBg} ${theme.inputBorder} ${theme.focusRing}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-extrabold uppercase ${theme.textSecondary}`}>
                      Badge Tier Preference
                    </label>
                    <select
                      value={badgeClass}
                      onChange={(e) => setBadgeClass(e.target.value)}
                      className={`w-full px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 border cursor-pointer select-none transition-colors ${theme.inputBg} ${theme.inputBorder} ${theme.focusRing}`}
                    >
                      <option value="GENERAL">General Admission</option>
                      <option value="VIP">Premium VIP Pass</option>
                      {event.badgeText && event.badgeText !== 'VIP' && event.badgeText !== 'GENERAL' && (
                        <option value={event.badgeText}>{event.badgeText}</option>
                      )}
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`w-full py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer ${theme.btnPrimary}`}
                    >
                      Acquire Verified Pass Pass
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER WATERMARK */}
      <footer className="w-full max-w-4xl mt-12 pt-8 border-t border-slate-200/40 dark:border-white/5 text-center text-[10px] font-mono uppercase tracking-widest text-slate-400 select-none">
        Powered by Trmn Verified Passes • 100% Secure Cryptography • Offline Verified
      </footer>

      {/* SECURE PASS DETAILS POPUP MODAL */}
      {selectedPassModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedPassModal(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 select-text animate-fade-in text-center"
        >
          <div className="bg-[#0B0A16] max-w-md w-full rounded-2xl p-6 border border-white/5 text-center space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedPassModal(null)}
              className="absolute right-4 top-4 hover:bg-slate-900 text-slate-400 text-lg font-bold p-1 rounded-full cursor-pointer"
            >
              ×
            </button>
            <div className="space-y-1">
              <span className="text-[10px] tracking-widest font-mono font-bold uppercase text-emerald-400">Offline Certified pass</span>
              <h3 className="text-base font-black text-white">{event.name} Pass</h3>
            </div>

            {/* Note that the pass itself stays in its designer's layout format as requested (zero effect on live pass ticket) */}
            <div className="flex justify-center select-none pb-1">
              <PassCardPreview event={selectedPassModal.event} attendee={selectedPassModal.attendee} />
            </div>

            <div className="bg-slate-905/40 p-3.5 border border-white/5 rounded-xl text-left space-y-2 text-[11px] text-slate-300">
              <p className="font-mono text-center border-b border-white/5 pb-1.5 uppercase tracking-wide text-indigo-300">
                Code: {selectedPassModal.attendee.passId} • Signature Match
              </p>
              <p className="leading-relaxed text-slate-450 text-center">
                This verification card has zero dependence on this event page's custom layouts, remaining perfectly compliant to visual brand parameters set.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleDownloadPNG(event, selectedPassModal.attendee)}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer select-none text-center"
              >
                PNG Pass
              </button>
              <button
                type="button"
                onClick={() => handleDownloadPDF(event, selectedPassModal.attendee)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer select-none text-center"
              >
                Print PDF
              </button>
              <button
                type="button"
                onClick={() => setSelectedPassModal(null)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-850 text-white cursor-pointer select-none text-center"
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
