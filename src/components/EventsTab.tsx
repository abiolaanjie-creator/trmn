import React, { useState, useMemo } from 'react';
import { Ticket, Calendar, MapPin, Plus, Eye, ChevronRight, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { EventDetails, Attendee } from '../types';
import { formatPassDate } from '../utils/passHelpers';

interface EventsTabProps {
  createdEvents: EventDetails[];
  registeredEvents: { event: EventDetails; attendee: Attendee }[];
  onSelectEvent: (id: string) => void;
  onCreateEvent: () => void;
  onViewPass: (item: { event: EventDetails; attendee: Attendee }) => void;
  attendees?: Attendee[];
}

// Deterministic artwork illustrations from Unsplash for events to match the screenshots exactly
function getEventBanner(event: EventDetails): string {
  if (event.bannerUrl && event.bannerUrl.trim().length > 0) {
    return event.bannerUrl;
  }
  
  const nameLower = event.name.toLowerCase();
  
  if (nameLower.includes('jazz') || nameLower.includes('cabernet')) {
    // Elegant warm wine / cabaret setup
    return 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=350&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('blast') || nameLower.includes('joni')) {
    // Tech blast-off rocket/artwork look
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=350&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('getters') || nameLower.includes('invite')) {
    // Beautiful abstract mesh invitation look
    return 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=350&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('ai') || nameLower.includes('agent') || nameLower.includes('masterclass')) {
    // Rich abstract digital/AI pattern
    return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=350&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('solstice') || nameLower.includes('sunset')) {
    // Warm retro-sunset gradients
    return 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=350&auto=format&fit=crop&q=80';
  }

  // Backup beautiful abstract pastel 3D geometries
  const hash = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const backups = [
    'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=350&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=350&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=350&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=350&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=350&auto=format&fit=crop&q=80',
  ];
  return backups[hash % backups.length];
}

// Human grouping day label (e.g., "Yesterday Sunday", "Today Sunday", "May 23 Saturday")
function getGroupDateLabel(dateTimeStr: string): { labelStr: string; subStr: string } {
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) {
    return { labelStr: dateTimeStr, subStr: '' };
  }
  const today = new Date();
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffTime = targetDate.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekday = weekdays[date.getDay()];

  if (diffDays === 0) {
    return { labelStr: 'Today', subStr: weekday };
  } else if (diffDays === -1) {
    return { labelStr: 'Yesterday', subStr: weekday };
  } else if (diffDays === 1) {
    return { labelStr: 'Tomorrow', subStr: weekday };
  } else {
    const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = date.getDate();
    return { labelStr: `${monthShort} ${dayNum}`, subStr: weekday };
  }
}

// Simpler time formatter (e.g. "8:00 PM", "11:30 PM")
function getEventTimeLabel(dateTimeStr: string): string {
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return '';
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function EventsTab({
  createdEvents,
  registeredEvents,
  onSelectEvent,
  onCreateEvent,
  onViewPass,
  attendees = []
}: EventsTabProps) {
  const [period, setPeriod] = useState<'upcoming' | 'past'>('upcoming');

  // Harmonized single unified list representing all user events
  const unifiedEvents = useMemo(() => {
    const map = new Map<string, {
      event: EventDetails;
      isOrganizer: boolean;
      registeredAttendee?: Attendee;
      dateTime: string;
    }>();

    // 1. Add created events first
    createdEvents.forEach(evt => {
      map.set(evt.id, {
        event: evt,
        isOrganizer: true,
        dateTime: evt.dateTime,
      });
    });

    // 2. Add registered events.
    registeredEvents.forEach(reg => {
      if (map.has(reg.event.id)) {
        // If already created, keep organizer privileges but link their pass ticket
        const existing = map.get(reg.event.id)!;
        existing.registeredAttendee = reg.attendee;
      } else {
        map.set(reg.event.id, {
          event: reg.event,
          isOrganizer: false,
          registeredAttendee: reg.attendee,
          dateTime: reg.event.dateTime,
        });
      }
    });

    return Array.from(map.values());
  }, [createdEvents, registeredEvents]);

  // Split into Upcoming and Past
  const activeEventsList = useMemo(() => {
    const now = new Date();
    // Today boundary
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const upcoming = unifiedEvents.filter(item => {
      const date = new Date(item.dateTime);
      if (isNaN(date.getTime())) return true;
      const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return itemDate >= todayStart;
    });

    const past = unifiedEvents.filter(item => {
      const date = new Date(item.dateTime);
      if (isNaN(date.getTime())) return false;
      const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return itemDate < todayStart;
    });

    // Sort chronologically for upcoming, reverse-chronologically for past
    upcoming.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    past.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

    return period === 'upcoming' ? upcoming : past;
  }, [unifiedEvents, period]);

  // Group events by day
  const groupedEvents = useMemo(() => {
    const groups: {
      groupKey: string;
      labelStr: string;
      subStr: string;
      sortTime: number;
      items: typeof activeEventsList;
    }[] = [];

    activeEventsList.forEach(item => {
      const date = new Date(item.dateTime);
      const gk = isNaN(date.getTime())
        ? 'Undated'
        : `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      const existing = groups.find(g => g.groupKey === gk);
      if (existing) {
        existing.items.push(item);
      } else {
        const { labelStr, subStr } = getGroupDateLabel(item.dateTime);
        groups.push({
          groupKey: gk,
          labelStr,
          subStr,
          sortTime: isNaN(date.getTime()) ? 0 : new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
          items: [item]
        });
      }
    });

    // Respect the sorting order of the parent items
    if (period === 'upcoming') {
      groups.sort((a, b) => a.sortTime - b.sortTime);
    } else {
      groups.sort((a, b) => b.sortTime - a.sortTime);
    }

    return groups;
  }, [activeEventsList, period]);

  // Define if a specific date/event is LIVE right now
  const isEventLive = (dateTimeStr: string) => {
    const now = new Date();
    const eventDate = new Date(dateTimeStr);
    if (isNaN(eventDate.getTime())) return false;
    // Same day is considered live/today
    return (
      eventDate.getFullYear() === now.getFullYear() &&
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getDate() === now.getDate()
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-left px-1">
      {/* EVENTS LANDING SWITCH HEADER */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white tracking-tight">
          Events
        </h2>
        
        {/* Toggle Pill Button Container */}
        <div className="flex p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg shadow-inner select-none">
          <button
            onClick={() => setPeriod('upcoming')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
              period === 'upcoming'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setPeriod('past')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
              period === 'past'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {groupedEvents.length > 0 ? (
        <div className="space-y-8">
          {groupedEvents.map((group, groupIdx) => (
            <div key={group.groupKey} className="relative pl-6 sm:pl-8">
              {/* Vertical dotted/solid timeline connector line run on the far left */}
              <div 
                className="absolute left-2.5 top-2.5 bottom-0 w-0.5 bg-slate-200/60 dark:bg-slate-800/60" 
                style={{ display: groupIdx === groupedEvents.length - 1 ? 'none' : 'block' }}
              />

              {/* Day header with left aligned bullet dot */}
              <div className="flex items-center gap-2.5 relative -left-[19px] sm:-left-[27px] mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 border border-white dark:border-slate-950 z-10" />
                <div className="text-sm tracking-tight leading-none">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {group.labelStr}
                  </span>
                  {group.subStr && (
                    <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">
                      {group.subStr}
                    </span>
                  )}
                </div>
              </div>

              {/* List of cards under this day */}
              <div className="space-y-4">
                {group.items.map((item) => {
                  const evt = item.event;
                  
                  // Extract guest count for this event if it was created
                  const guests = attendees.filter(
                    a => (a as any).eventId === evt.id || (evt.id === 'evt-obsidian-jazz' && !(a as any).eventId)
                  );
                  const guestCount = guests.length;

                  // Assess live status
                  const isLiveNow = isEventLive(evt.dateTime) && period === 'upcoming';

                  return (
                    <div
                      key={evt.id}
                      onClick={() => {
                        if (item.isOrganizer) {
                          onSelectEvent(evt.id);
                        } else if (item.registeredAttendee) {
                          onViewPass({ event: evt, attendee: item.registeredAttendee! });
                        }
                      }}
                      className="group relative bg-white dark:bg-[#121124] border border-slate-100 dark:border-white/5 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:border-slate-200/50 dark:hover:border-white/10 transition-all duration-300 flex flex-row justify-between items-center gap-3 sm:gap-6 cursor-pointer hover:translate-y-[-1px]"
                    >
                      {/* Left Detail Content */}
                      <div className="flex-1 space-y-1.5 text-left min-w-0">
                        {/* Time Badges */}
                        <div className="flex items-center gap-2 text-xs">
                          {isLiveNow ? (
                            <div className="flex items-center gap-1.5 font-bold text-[#E2543B]">
                              <span className="w-2 h-2 rounded-full bg-[#E2543B] animate-pulse" />
                              <span>LIVE</span>
                            </div>
                          ) : null}
                          <span className="text-slate-400 dark:text-slate-500 font-semibold">
                            {getEventTimeLabel(evt.dateTime)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold font-sans text-slate-900 dark:text-white leading-snug mt-0.5 line-clamp-2">
                          {evt.name}
                        </h3>

                        {/* Parameters (Location & Guests) */}
                        <div className="space-y-1 text-xs">
                          {/* Location Block */}
                          {!evt.venue || evt.venue.toLowerCase().includes('missing') || evt.venue.toLowerCase() === 'tbd' ? (
                            <div className="flex items-center gap-1.5 text-[#D97706] font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Location Missing</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                              <span className="line-clamp-1">{evt.venue}</span>
                            </div>
                          )}

                          {/* Guests Block */}
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-medium">
                            <Users className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                            <span>
                              {guestCount > 0
                                ? `${guestCount} guest${guestCount > 1 ? 's' : ''}`
                                : 'No guests'}
                            </span>
                          </div>
                        </div>

                        {/* Controls Bottom Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-2.5">
                          {item.isOrganizer ? (
                            <>
                              <button
                                onClick={() => onSelectEvent(evt.id)}
                                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none hover:scale-[1.01]"
                              >
                                {period === 'past' ? 'Manage Event →' : 'Manage →'}
                              </button>
                            </>
                          ) : (
                            item.registeredAttendee && (
                              <button
                                onClick={() => onViewPass({ event: evt, attendee: item.registeredAttendee! })}
                                className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Pass 🎟️
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Right Elegant Artwork Thumbnail */}
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl flex-shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm select-none relative self-center">
                        <img
                          src={getEventBanner(evt)}
                          alt={evt.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Stage State */
        <div className="py-16 px-4 text-center bg-white dark:bg-[#121124] rounded-3xl border border-dashed border-slate-200 dark:border-white/5 space-y-4 shadow-sm select-none">
          <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h4 className="font-bold text-base text-slate-700 dark:text-slate-200">
              No {period} events found
            </h4>
            <p className="text-xs text-slate-450 dark:text-slate-500 max-w-sm mt-1 mx-auto leading-relaxed">
              {period === 'upcoming'
                ? 'Create a customized live verification page, or explore presets inside the Discover tab!'
                : 'Any event page you publish or register for eventually saves historical tickets in your passbook.'}
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onCreateEvent}
              className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-black rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer select-none active:scale-95 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
