import React, { useState, useMemo } from 'react';
import { Calendar, Ticket, MapPin, Sparkles, CheckCircle, Share2, Eye, Mail, Lock } from 'lucide-react';
import { EventDetails, Attendee } from '../types';
import { formatPassDate } from '../utils/passHelpers';

interface CalendarTabProps {
  createdEvents: EventDetails[];
  registeredEvents: { event: EventDetails; attendee: Attendee }[];
  userName: string;
  calendarCustom: {
    title: string;
    styleTheme: string;
    coverPattern: string;
    showPastEvents: boolean;
    showEmailSubscribe: boolean;
  };
  subscribers: string[];
  onUpdateCalendarCustom: (updated: any) => void;
  onAddSubscriber: (email: string) => void;
  onViewPass?: (item: { event: EventDetails; attendee: Attendee }) => void;
}

export function CalendarTab({
  createdEvents,
  registeredEvents,
  userName,
  calendarCustom,
  subscribers,
  onUpdateCalendarCustom,
  onAddSubscriber,
  onViewPass,
}: CalendarTabProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  // Group and sort all upcoming milestone listings chronologically
  const unifiedChronologicalAgendas = useMemo(() => {
    const list: {
      id: string;
      source: 'host' | 'registered';
      name: string;
      dateTime: string;
      venue: string;
      brandColor: string;
      rawModel: EventDetails;
      rawPass?: Attendee;
    }[] = [];

    // Map hosted events
    createdEvents.forEach((evt) => {
      list.push({
        id: `h-${evt.id}`,
        source: 'host',
        name: evt.name,
        dateTime: evt.dateTime,
        venue: evt.venue,
        brandColor: evt.brandColor,
        rawModel: evt,
      });
    });

    // Map registered events
    registeredEvents.forEach((item) => {
      list.push({
        id: `r-${item.event.id}-${item.attendee.id}`,
        source: 'registered',
        name: item.event.name,
        dateTime: item.event.dateTime,
        venue: item.event.venue,
        brandColor: item.event.brandColor,
        rawModel: item.event,
        rawPass: item.attendee,
      });
    });

    // Clean sort
    return list.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [createdEvents, registeredEvents]);

  // Handle share click (construct public calendar template format)
  const handleCopyShareLink = () => {
    const origin = window.location.origin;
    const shareUrl = `${origin}?calendarMode=true&user=${encodeURIComponent(userName)}&title=${encodeURIComponent(
      calendarCustom.title
    )}&vibe=${calendarCustom.styleTheme}`;

    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const themeSwatches = [
    { key: 'standard', name: 'Slate Gray', hex: '#64748B' },
    { key: 'midnight', name: 'Midnight Violet', hex: '#8B5CF6' },
    { key: 'neon', name: 'Emerald Cyber', hex: '#10B981' },
    { key: 'warm', name: 'Amber Sunset', hex: '#F59E0B' },
    { key: 'forest', name: 'Forest Green', hex: '#10B981' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 animate-fade-in text-left">
      {/* LEFT PORTION: INTEGRATED AGENDA LIST TIMELINE (7/12 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-black tracking-tight dark:text-white flex items-center gap-2">
            <Calendar className="w-5.5 h-5.5 text-violet-500 shrink-0" />
            Social Calendar Timeline
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            A combined chronological ledger of events you are hosting and registered tickets.
          </p>
        </div>

        {unifiedChronologicalAgendas.length > 0 ? (
          <div className="space-y-4 border-l-2 border-slate-200/50 dark:border-indigo-950/20 pl-5 ml-2.5">
            {unifiedChronologicalAgendas.map((item) => {
              const isHost = item.source === 'host';
              
              // Calculate countdown human readable
              const daysLeft = Math.ceil(
                (new Date(item.dateTime).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={item.id} className="relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/40 dark:border-indigo-950/15 shadow-sm space-y-3">
                  {/* Bullet visual pointer indicator */}
                  <div
                    className="absolute -left-7 top-6 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-950 shadow-sm"
                    style={{ backgroundColor: item.brandColor }}
                  />

                  <div className="flex justify-between items-start gap-4">
                    {/* Category ribbon label */}
                    <span className="text-[9px] font-mono tracking-widest font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {isHost ? '⚡ Host Creator Studio' : '🎟️ Registered Guest'}
                    </span>

                    {daysLeft > 0 ? (
                      <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 font-mono">
                        In {daysLeft} Day{daysLeft > 1 ? 's' : ''}
                      </span>
                    ) : daysLeft === 0 ? (
                      <span className="text-[10px] font-bold text-emerald-500 animate-pulse font-mono uppercase">
                        Happening Today
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm dark:text-white leading-snug">{item.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-505 dark:text-slate-400 font-medium pt-1.5 border-t border-slate-100 dark:border-white/5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {formatPassDate(item.dateTime)}
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[200px]" title={item.venue}>
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {item.venue}
                      </span>
                    </div>
                  </div>

                  {!isHost && item.rawPass && onViewPass && (
                    <div className="pt-1 select-none">
                      <button
                        onClick={() => onViewPass({ event: item.rawModel, attendee: item.rawPass! })}
                        className="py-1.5 px-3.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 cursor-pointer select-none border border-transparent hover:border-indigo-500/10"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Verified Pass</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/15 rounded-3xl border border-dashed border-slate-200 dark:border-indigo-950/30 space-y-2 select-none">
            <Calendar className="w-8 h-8 text-slate-300 dark:text-indigo-950 mx-auto" />
            <h4 className="font-bold text-sm dark:text-slate-350">Timeline agenda empty</h4>
            <p className="text-xs text-slate-400">Spawn an event template or register under Discover tab matches.</p>
          </div>
        )}
      </div>

      {/* RIGHT PORTION: CALENDAR CONFIGURATION PANEL & GUEST CENTRE (5/12 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* CUSTOMIZER CARD */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-indigo-950/20 shadow-sm text-left space-y-5">
          <div className="border-b border-slate-100 dark:border-white/5 pb-3">
            <h3 className="font-bold text-sm dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
              Calendar Settings Drawer
            </h3>
            <p className="text-[10.5px] text-slate-400">Stylize your user agenda dashboard and custom portfolio pages.</p>
          </div>

          <div className="space-y-4">
            {/* Header asset Title rename inputs */}
            <div className="space-y-1">
              <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Public Calendar Title</label>
              <input
                type="text"
                value={calendarCustom.title}
                onChange={(e) => onUpdateCalendarCustom({ ...calendarCustom, title: e.target.value })}
                className="field !h-9 text-xs"
                placeholder="My Social Season Calendar"
              />
            </div>

            {/* Cover Styles Presets Theme Selection */}
            <div className="space-y-2">
              <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Vibe Theme Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {themeSwatches.map((swa) => (
                  <button
                    key={swa.key}
                    onClick={() => onUpdateCalendarCustom({ ...calendarCustom, styleTheme: swa.key })}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left cursor-pointer select-none transition-all flex items-center justify-between ${
                      calendarCustom.styleTheme === swa.key
                        ? 'border-violet-500 bg-violet-500/10 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{swa.name}</span>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: swa.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle show options */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Show Subscriber Signup box</span>
                <input
                  type="checkbox"
                  checked={calendarCustom.showEmailSubscribe}
                  onChange={(e) =>
                    onUpdateCalendarCustom({ ...calendarCustom, showEmailSubscribe: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* SHARE DIRECT PLATFORM BUTTON */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={handleCopyShareLink}
              className="w-full text-center py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-violet-500/10 active:scale-95 transition-all select-none"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              {copiedLink ? 'Calendar link Copied!' : 'Copy Public Calendar Link'}
            </button>
          </div>
        </div>

        {/* SUBSCRIBERS LOG PANEL */}
        {calendarCustom.showEmailSubscribe && (
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-indigo-950/20 shadow-sm text-left space-y-4">
            <div className="border-b border-slate-100 dark:border-white/5 pb-2">
              <h3 className="font-sans font-bold text-xs tracking-tight dark:text-white flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
                <Mail className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                Audience Subscriber Log ({subscribers.length})
              </h3>
            </div>

            {subSuccess ? (
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/15 text-xs text-center font-bold">
                🎉 Added subscriber successfully! Let's verify details.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!subEmail.trim()) return;
                  onAddSubscriber(subEmail.trim());
                  setSubEmail('');
                  setSubSuccess(true);
                  setTimeout(() => setSubSuccess(false), 3000);
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  className="flex-1 field !h-9 text-xs"
                />
                <button
                  type="submit"
                  className="px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs cursor-pointer select-none"
                >
                  Add
                </button>
              </form>
            )}

            {subscribers.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {subscribers.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150/50 dark:border-white/5 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between"
                  >
                    <span className="truncate">{sub}</span>
                    <span className="text-[8.5px] uppercase font-bold text-emerald-500">Live feed</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No subscribers saved yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
