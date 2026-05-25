import React, { useState, useMemo } from 'react';
import { Search, Sparkles, MapPin, Calendar, Ticket, ChevronRight, User, Mail, ShieldAlert } from 'lucide-react';
import { EventDetails } from '../types';
import { formatPassDate } from '../utils/passHelpers';

interface DiscoverTabProps {
  presets: EventDetails[];
  userProfile: { name: string; email: string };
  onRegisterPass: (event: EventDetails, badgeClass: string, visitorName: string, visitorEmail: string) => void;
}

export function DiscoverTab({ presets, userProfile, onRegisterPass }: DiscoverTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [expandedEvent, setExpandedEvent] = useState<EventDetails | null>(null);

  // Form registration states
  const [badgeClass, setBadgeClass] = useState('GENERAL');
  const [guestName, setGuestName] = useState(userProfile.name);
  const [guestEmail, setGuestEmail] = useState(userProfile.email);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const categories = ['ALL', 'Music & Nightlife', 'Technology & Devs', 'Web Design & Code', 'Health & Wellness'];

  // Sync profile details on expand changes
  const handleOpenExpandEvent = (evt: EventDetails) => {
    setExpandedEvent(evt);
    setGuestName(userProfile.name);
    setGuestEmail(userProfile.email);
    setBadgeClass('GENERAL');
    setRegisterSuccess(false);
  };

  const filteredPresets = useMemo(() => {
    return presets.filter((evt) => {
      const matchSearch =
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        evt.venue?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = activeCategory === 'ALL' || evt.category === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [presets, searchQuery, activeCategory]);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* BANNER GREETING */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900/40 via-violet-950/20 to-slate-900/40 border border-indigo-950/20 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-extrabold uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/15">
            Verified Partner Portal
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">Find Experiences Around You</h2>
          <p className="text-xs text-slate-400 max-w-lg">
            Offline-verifiable passes mean you save tickets to your physical app ledger securely. Absolutely zero commissions or ticketing fees.
          </p>
        </div>
      </div>

      {/* FILTER SEARCH TOOLBAR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search rooftop, workshops, soundbath or developers conference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="field !h-11 !pl-10 text-xs text-slate-800 dark:text-white"
            />
          </div>
          <div className="flex overflow-x-auto gap-1.5 pb-1 sm:pb-0 scrollbar-none shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`h-11 px-4 text-[11px] font-extrabold rounded-xl shrink-0 cursor-pointer transition-all select-none col-span-1 leading-none ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-650 text-white shadow-sm font-black'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-indigo-950/20 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'ALL ARCHIVES' : cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MATCHES ARCHIVES LIST GRID */}
      {filteredPresets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-2">
          {filteredPresets.map((evt) => (
            <div
              key={evt.id}
              className="rounded-3xl border border-slate-200/50 dark:border-indigo-950/15 bg-white dark:bg-slate-900/60 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200 flex flex-col justify-between overflow-hidden relative"
            >
              <div
                className="absolute left-0 right-0 top-0 h-1.5 w-full"
                style={{ backgroundColor: evt.brandColor }}
              />

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9.5px] font-mono font-black uppercase text-slate-400 tracking-widest leading-none">
                    {evt.category || 'Directory'}
                  </span>
                  <span
                    className="text-xs font-bold leading-none font-mono"
                    style={{ color: evt.brandColor }}
                  >
                    {evt.ticketPrice && evt.ticketPrice > 0 ? `$${evt.ticketPrice}` : 'FREE ADMISSION'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold dark:text-white group-hover:text-violet-500 transition-colors">
                    {evt.name}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
                    {evt.shortDescription || 'A curated luxury masterclass listing hosted locally via verified credentials.'}
                  </p>
                </div>

                {/* Brief calendar venue badge */}
                <div className="space-y-1.5 text-[10.5px] font-medium text-slate-500 pt-3 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatPassDate(evt.dateTime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                </div>

                {evt.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {evt.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-semibold opacity-75 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-505 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-white/5 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenExpandEvent(evt)}
                  className="w-full py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/20 dark:hover:bg-violet-950/40 text-violet-600 dark:text-violet-4 rich-button text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer border border-transparent hover:border-violet-500/10"
                >
                  <Ticket className="w-4 h-4 shrink-0 text-violet-500" />
                  View Details & Register
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-slate-50 dark:bg-slate-900/10 rounded-3xl border border-dashed border-slate-200 dark:border-indigo-950/40 space-y-2 select-none">
          <Sparkles className="w-8 h-8 text-slate-330 animate-pulse mx-auto" />
          <h4 className="font-bold text-sm dark:text-slate-300">No scheduled meets match</h4>
          <p className="text-xs text-slate-400">Clear search bar or change category pills to list items.</p>
        </div>
      )}

      {/* EVENT EXTRA DETAILS POPUP */}
      {expandedEvent && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setExpandedEvent(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/45 animate-fade-in select-text"
        >
          <div className="bg-white dark:bg-[#110F2B] max-w-lg w-full rounded-3xl p-6 border border-slate-200 dark:border-indigo-950/20 text-left space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setExpandedEvent(null)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-base cursor-pointer"
            >
              ×
            </button>

            <span className="text-[9px] font-mono tracking-widest font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-violet-150/10 text-violet-500 border border-violet-500/10">
              {expandedEvent.category || 'Special Feature'}
            </span>

            <div className="space-y-1.5 pr-6">
              <h3 className="text-lg font-black dark:text-white leading-snug">{expandedEvent.name}</h3>
              <p className="text-[11px] font-bold text-indigo-500 font-mono tracking-wider">
                HOSTED BY {expandedEvent.hostTitle?.toUpperCase() || expandedEvent.organizerName.toUpperCase()}
              </p>
            </div>

            {/* Backstory */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Backstory & Experience</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {expandedEvent.about || 'This exclusive experience combines advanced front-end parameters, verified QR identifiers, and cryptographic entry checks.'}
              </p>
            </div>

            {/* Agenda elements if present */}
            {expandedEvent.agenda && expandedEvent.agenda.length > 0 && (
              <div className="space-y-2 pt-1">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Experience Agenda Timeline</h4>
                <div className="divide-y divide-slate-100 dark:divide-white/5 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
                  {expandedEvent.agenda.map((mil, idx) => (
                    <div key={idx} className="p-3 text-[11px] flex gap-3 text-left">
                      <span className="font-mono text-violet-500 font-bold shrink-0">{mil.time}</span>
                      <span className="text-slate-500 dark:text-slate-300 font-medium">{mil.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAST REGISTRATION CONTROL BOX */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150/40 dark:border-white/5 space-y-4">
              <h4 className="text-xs font-extrabold tracking-tight uppercase flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <Ticket className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                Obtain Secure Verify Pass
              </h4>

              {registerSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xs space-y-2 border border-emerald-500/20 text-center animate-scale-up">
                  <p>🎉 Ticket Generated Successfully!</p>
                  <p className="text-[10px] font-normal text-slate-400 leading-relaxed">
                    We synthesized custom credentials, signed with HSM code, and added the ticket pass to your <strong>Events</strong> tab passbook! Check it out anytime.
                  </p>
                  <button
                    onClick={() => {
                      setExpandedEvent(null);
                    }}
                    className="mt-2 text-[10px] text-emerald-400 hover:underline cursor-pointer block mx-auto uppercase font-bold tracking-wider"
                  >
                    Close window
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!guestName.trim()) return;
                    onRegisterPass(expandedEvent, badgeClass, guestName.trim(), guestEmail.trim());
                    setRegisterSuccess(true);
                  }}
                  className="space-y-3 font-sans"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="field !h-9 text-xs scrollbar-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Your Contact Email</label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="field !h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 block">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Class Tier Rank</label>
                    <select
                      className="field !h-9 text-xs cursor-pointer"
                      value={badgeClass}
                      onChange={(e) => setBadgeClass(e.target.value)}
                    >
                      <option value="GENERAL">General Admission</option>
                      <option value="VIP">Premium VIP Tier</option>
                      {expandedEvent.badgeText && expandedEvent.badgeText !== 'VIP' && (
                        <option value={expandedEvent.badgeText}>{expandedEvent.badgeText}</option>
                      )}
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-10 rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs shadow-md shadow-violet-500/10 cursor-pointer"
                    >
                      Confirm Registration & Generate HMAC Ticket
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
