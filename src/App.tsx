/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, useAppTheme } from './components/ThemeHandler';
import { SettingsAppearance } from './components/SettingsAppearance';
import { ConfettiShower } from './components/ConfettiShower';
import { PassCardPreview } from './components/PassCardPreview';
import { QRScannerComp } from './components/QRScannerComp';
import { BulkUploadComp } from './components/BulkUploadComp';
import { EventsTab } from './components/EventsTab';
import { DiscoverTab } from './components/DiscoverTab';
import { CalendarTab } from './components/CalendarTab';
import { ProfileTab } from './components/ProfileTab';
import { PublicCalendarView } from './components/PublicCalendarView';
import { PublicEventView } from './components/PublicEventView';
import { getThemeStyles } from './utils/themeStyles';
import { OnboardingLogin } from './components/OnboardingLogin';
import { EventOverview } from './components/EventOverview';
import { EventImageUploader } from './components/EventImageUploader';
import { TrmnLogo } from './components/TrmnLogo';
import { EventDetails, Attendee, PassTemplate, BackgroundPattern, PassAnimation } from './types';
import { signAttendeePass, formatPassDate, getContrastColor } from './utils/passHelpers';
import { renderPassToCanvas } from './utils/canvasExporter';
import { InputField, SelectField } from './components/PremiumInput';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import {
  Ticket,
  Calendar,
  MapPin,
  Sparkles,
  Palette,
  Users,
  Plus,
  QrCode,
  Download,
  Share2,
  Trash2,
  Check,
  Search,
  UserPlus,
  Upload,
  UserCheck,
  Info,
  Smartphone,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Lock,
  Moon,
  Sun,
  User,
  LayoutGrid,
  CheckCircle,
  HelpCircle,
  Bell
} from 'lucide-react';

const DEFAULT_EVENT: EventDetails = {
  id: 'evt-obsidian-jazz',
  name: 'Midnight Jazz & Cabernet',
  dateTime: '2026-06-14T19:00',
  venue: 'The Obsidian Cellar, Suite 10',
  organizerName: 'Trmn pass',
  brandColor: '#6366F1',
  template: 'NEON',
  pattern: 'diagonal',
  animation: 'shimmer',
  emojis: ['🍷', '🎶', '✨'],
  badgeText: 'VIP',
  secretKey: 'trmn-secret-token-key-jazz-2026',
};

const SEED_EVENTS: EventDetails[] = [
  {
    id: 'evt-joni',
    name: 'Joni',
    dateTime: '2026-05-24T23:30', // Same day as today
    venue: 'Location Missing',     // Triggers location warning
    organizerName: 'Trmn pass',
    brandColor: '#8B5CF6',
    template: 'NEON',
    pattern: 'diagonal',
    animation: 'shimmer',
    emojis: ['🎸', '✨'],
    badgeText: 'VIP',
    secretKey: 'joni-secret-key-256',
  },
  {
    id: 'evt-fgjytj',
    name: 'fgjytj',
    dateTime: '2026-05-24T20:00', // Today 8:00 PM
    venue: 'University of Ibadan',
    organizerName: 'Yemi Adebayo',
    brandColor: '#3B82F6',
    template: 'AURORA',
    pattern: 'dots',
    animation: 'float',
    emojis: ['💻', '📐'],
    badgeText: 'GENERAL',
    secretKey: 'fgjytj-secret-key-300',
  },
  {
    id: 'evt-xhgfxhtd',
    name: 'xhgfxhtd',
    dateTime: '2026-05-24T20:00', // Today 8:00 PM
    venue: 'Location Missing',
    organizerName: 'Self',
    brandColor: '#EC4899',
    template: 'BLOOM',
    pattern: 'diagonal',
    animation: 'pulse',
    emojis: ['🌸', '🔥'],
    badgeText: 'GENERAL',
    secretKey: 'xhgfxhtd-secret-key-300',
  },
  {
    id: 'evt-go-getters',
    name: 'Go Getters',
    dateTime: '2026-05-23T23:00', // Saturday May 23 11:00 PM (Yesterday relative to May 24)
    venue: 'University of Ibadan',
    organizerName: 'Self',
    brandColor: '#F59E0B',
    template: 'NEON',
    pattern: 'diagonal',
    animation: 'shimmer',
    emojis: ['🎯', '✨'],
    badgeText: 'GENERAL',
    secretKey: 'getters-secret-key',
  },
  {
    id: 'evt-ai-masterclass',
    name: 'AI Agents Masterclass with Temi Kolawole',
    dateTime: '2026-05-05T16:00', // May 5 4:00 PM
    venue: 'Boran Innovation Hub',
    organizerName: 'Temi Kolawole',
    brandColor: '#10B981',
    template: 'AURORA',
    pattern: 'diagonal',
    animation: 'shimmer',
    emojis: ['🤖', '💡'],
    badgeText: 'VIP',
    secretKey: 'ai-masterclass-secret',
  },
  DEFAULT_EVENT,
];

const DEFAULT_ATTENDEES: Attendee[] = [
  {
    id: 'att-yemi',
    name: 'Yemi Adebayo',
    type: 'VIP',
    email: 'yemi@example.com',
    status: 'registered',
    passId: 'EVT-2026-1402',
    hmacSignature: '8e43cb397b2046fa',
  },
  {
    id: 'att-kwame',
    name: 'Kwame Boateng',
    type: 'STAFF',
    email: 'kwame@example.com',
    status: 'registered',
    passId: 'EVT-2026-7789',
    hmacSignature: 'a29b4df183a69490',
  },
  {
    id: 'att-amara',
    name: 'Amara Okafor',
    type: 'GENERAL',
    email: 'amara@example.com',
    status: 'checked-in',
    checkedInAt: '2026-05-24T17:15:00Z',
    passId: 'EVT-2026-9051',
    hmacSignature: '1b4ddca592f61a10',
  },
];

const DISCOVER_PRESET_EVENTS: EventDetails[] = [
  {
    id: 'evt-sunset-solstice',
    name: 'Solstice Sunset Rooftop Session',
    dateTime: '2026-06-25T18:00',
    venue: 'The Sky Garden, Level 44',
    organizerName: 'Aura Soundscapes',
    brandColor: '#F97316',
    template: 'AURORA',
    pattern: 'diagonal',
    animation: 'shimmer',
    emojis: ['🌇', '🎶', '✨'],
    badgeText: 'VIP',
    secretKey: 'sunset-solstice-token-secret-2026',
    ticketType: 'paid',
    ticketPrice: 35,
    category: 'Music & Nightlife',
    shortDescription: 'Catch the magic of midsummer night under orange and amber sky lights.',
    hostTitle: 'Aura Soundscapes Group',
    about: 'An immersive deep house exploration in Nigeria’s highest sky deck. Features therapeutic acoustic setups, complementary cocktails, and customized verification passes.',
    agenda: [
      { id: '1', time: '06:00 PM', activity: 'Acoustic Sound Bath Intro' },
      { id: '2', time: '07:15 PM', activity: 'Sunset DJ session with Aura Crew' },
      { id: '3', time: '09:00 PM', activity: 'Midsummer stargazing list' },
    ],
    tags: ['Rooftop', 'Deep House', 'Sunset', 'Solstice']
  },
  {
    id: 'evt-ai-summit',
    name: 'Decentralized AI Summit 2026',
    dateTime: '2026-07-02T09:00',
    venue: 'Soma Tech Foundry, District 4',
    organizerName: 'AI Pioneers Guild',
    brandColor: '#8B5CF6',
    template: 'NEON',
    pattern: 'grid',
    animation: 'pulse',
    emojis: ['💡', '🧠', '🌐'],
    badgeText: 'SPEAKER',
    secretKey: 'ai-summit-custom-signature-key-2026',
    category: 'Technology & Devs',
    ticketType: 'paid',
    ticketPrice: 150,
    shortDescription: 'Unlocking localized LLM inference speeds, offline edge verification, and sovereign security networks.',
    hostTitle: 'guildmaster_ai',
    about: 'Join 500+ tech leaders researching localized neural models, secure cryptography systems, and sandboxed developer operations with direct industrial hardware demonstrations.',
    agenda: [
      { id: '1', time: '09:00 AM', activity: 'Welcome Keynote: The Sovereign Local Brain' },
      { id: '2', time: '11:00 AM', activity: 'Workshop: Offline Verification & Cryptography' },
      { id: '3', time: '02:00 PM', activity: 'Panel Discussion on Localized Inference' },
    ],
    tags: ['Artificial Intelligence', 'Edge Computing', 'Cryptography']
  },
  {
    id: 'evt-web-aesthetics',
    name: 'Neon Web Pioneers Symposium',
    dateTime: '2026-07-15T14:00',
    venue: 'Metropolitan Glass Hall, Center Suite',
    organizerName: 'Aesthetics Lab',
    brandColor: '#0EA5E9',
    template: 'NEON',
    pattern: 'waves',
    animation: 'float',
    emojis: ['🎨', '🌐', '🚀'],
    badgeText: 'VIP',
    secretKey: 'web-aesthetics-key-signature-token-2026',
    category: 'Web Design & Code',
    ticketType: 'free',
    ticketPrice: 0,
    shortDescription: 'Explore the modern frontier of CSS grid layouts, motion designs, and tailwind typography systems.',
    hostTitle: 'Aesthetics Lab Curator',
    about: 'A curated gathering for creators who treat front-end development as fine art. Walk through typography pairings, fluid layouts, and lightweight high-fidelity performance metrics.',
    agenda: [
      { id: '1', time: '02:00 PM', activity: 'Art of Typography and Negative Space' },
      { id: '2', time: '03:30 PM', activity: 'Harnessing CSS Motion & Animations safely' },
      { id: '3', time: '05:00 PM', activity: 'Fireside: Beyond the Default Tailwind preset' },
    ],
    tags: ['Web Design', 'UI/UX', 'Tailwind CSS']
  },
  {
    id: 'evt-cosmic-sound',
    name: 'Cosmic Sound Bath Therapy',
    dateTime: '2026-08-01T20:00',
    venue: 'The Sanctuary, Dome A',
    organizerName: 'Zen Archives',
    brandColor: '#10B981',
    template: 'BLOOM',
    pattern: 'dots',
    animation: 'shimmer',
    emojis: ['🪐', '🧪', '🔔'],
    badgeText: 'VIP',
    secretKey: 'cosmic-soundbath-vibe-secret-token-2026',
    category: 'Health & Wellness',
    ticketType: 'paid',
    ticketPrice: 40,
    shortDescription: 'Recalibrate your neural pathways using 432Hz ambient waves, sonic frequencies, and full-spectrum lights.',
    hostTitle: 'Zen Healing Master',
    about: 'A deep-relaxation experience using gongs, planetary tubes, and analog synthesizers. Designed for stress release and cognitive mindfulness in a safe, fully insulated audio dome.',
    agenda: [
      { id: '1', time: '08:00 PM', activity: 'Deep Breathing and Relaxation Intro' },
      { id: '2', time: '08:30 PM', activity: 'Pure 432Hz Gong immersion' },
      { id: '3', time: '09:40 PM', activity: 'Mindfulness reflection' },
    ],
    tags: ['Wellness', 'Sound Bath', 'Mindfulness']
  }
];

export default function App() {
  return (
    <ThemeProvider>
      <TrmnAppContent />
    </ThemeProvider>
  );
}

const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  let r = 0, g = 0, b = 0;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  const toHexStr = (n: number) => {
    const hexVal = Math.round((n + m) * 255).toString(16);
    return hexVal.length === 1 ? '0' + hexVal : hexVal;
  };
  return `#${toHexStr(r)}${toHexStr(g)}${toHexStr(b)}`.toUpperCase();
};

function TrmnAppContent() {
  const { settings, updateSettings } = useAppTheme();
  const urlParams = new URL(window.location.href).searchParams;

  // Local persisted storage
  const [event, setEvent] = useState<EventDetails>(() => {
    const saved = localStorage.getItem('trmn_event_details');
    return saved ? JSON.parse(saved) : DEFAULT_EVENT;
  });

  const [attendees, setAttendees] = useState<Attendee[]>(() => {
    const saved = localStorage.getItem('trmn_attendees');
    return saved ? JSON.parse(saved) : DEFAULT_ATTENDEES;
  });

  // Save states modifications on trigger
  useEffect(() => {
    localStorage.setItem('trmn_event_details', JSON.stringify(event));
  }, [event]);

  useEffect(() => {
    localStorage.setItem('trmn_attendees', JSON.stringify(attendees));
  }, [attendees]);

  // ── NEW APP NAVIGATION METRICS ──
  // Navigation tabs: 'events' | 'discover' | 'calendar' | 'profile'
  const [navTab, setNavTab] = useState<'events' | 'discover' | 'calendar' | 'profile'>(() => {
    const params = new URL(window.location.href).searchParams;
    if (params.get('calendarMode') === 'true') return 'calendar';
    return (localStorage.getItem('trmn_nav_tab') as any) || 'events';
  });

  const [themesActiveSubTab, setThemesActiveSubTab] = useState<'event' | 'pass'>('pass');

  useEffect(() => {
    localStorage.setItem('trmn_nav_tab', navTab);
  }, [navTab]);

  // Created Events Master Collection
  const [createdEvents, setCreatedEvents] = useState<EventDetails[]>(() => {
    const saved = localStorage.getItem('trmn_created_events');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Upgrade single old default schema automatically
      if (parsed.length <= 1) {
        return SEED_EVENTS;
      }
      return parsed;
    }
    return SEED_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem('trmn_created_events', JSON.stringify(createdEvents));
  }, [createdEvents]);

  // Active editing event identifier. If null, we render high level tab layouts.
  const [activeEditingEventId, setActiveEditingEventId] = useState<string | null>(null);

  // Sync event state on changes
  useEffect(() => {
    if (activeEditingEventId) {
      const found = createdEvents.find(e => e.id === activeEditingEventId);
      if (found) {
        if (found.id !== event.id) {
          setEvent(found);
        }
      }
    }
  }, [activeEditingEventId]);

  // Sync modifications of selected event back into the collection
  useEffect(() => {
    setCreatedEvents(prev => prev.map(e => e.id === event.id ? event : e));
  }, [event]);

  const updateActiveEvent = (updated: EventDetails) => {
    setEvent(updated);
    setCreatedEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  // Upcoming registered events lists
  const [registeredEvents, setRegisteredEvents] = useState<{ event: EventDetails; attendee: Attendee }[]>(() => {
    const saved = localStorage.getItem('trmn_registered_events');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('trmn_registered_events', JSON.stringify(registeredEvents));
  }, [registeredEvents]);

  // User profile structure state
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('trmn_user_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: 'Abiola Anjie',
      email: 'abiolaanjie@gmail.com',
      bio: 'Curator of fine spaces, digital artifacts, and live experiences. Love hosting tech-meets-art meetups.',
      avatar: '👩‍💻'
    };
  });

  useEffect(() => {
    localStorage.setItem('trmn_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Session gate state for onboarding and login
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('trmn_authenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('trmn_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  // Calendar customizable preferences
  const [calendarCustom, setCalendarCustom] = useState(() => {
    const saved = localStorage.getItem('trmn_calendar_custom');
    if (saved) return JSON.parse(saved);
    return {
      title: "Abiola Anjie's Curated Social Schedule",
      styleTheme: 'standard', // standard, midnight, neon, forest, warm
      coverPattern: 'dots', // dots, grid, waves, diagonal, solid
      showPastEvents: true,
      showEmailSubscribe: true
    };
  });

  useEffect(() => {
    localStorage.setItem('trmn_calendar_custom', JSON.stringify(calendarCustom));
  }, [calendarCustom]);

  // Calendar subscribers
  const [subscribers, setSubscribers] = useState<string[]>(() => {
    const saved = localStorage.getItem('trmn_subscribers');
    return saved ? JSON.parse(saved) : ['curator.friend@gmail.com', 'lisa.h@soma.tech'];
  });

  useEffect(() => {
    localStorage.setItem('trmn_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  // Guest Register helper popup overlays
  const [selectedPassModal, setSelectedPassModal] = useState<{ event: EventDetails; attendee: Attendee } | null>(null);
  const [selectedDiscoverEvent, setSelectedDiscoverEvent] = useState<typeof DISCOVER_PRESET_EVENTS[0] | null>(null);
  const [customRegisterBadge, setCustomRegisterBadge] = useState('GENERAL');
  const [customRegisterSuccess, setCustomRegisterSuccess] = useState(false);

  // UI controller flags
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [showAdvancedColors, setShowAdvancedColors] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'creator' | 'guests' | 'registration' | 'blasts' | 'insights' | 'more'>('overview');

  // Registration setup state
  const [ticketTiers, setTicketTiers] = useState([
    { id: '1', name: 'General Admission', price: 'Free', limit: 120, registeredCount: 45 },
    { id: '2', name: 'VIP All-Access Pass', price: 'Free', limit: 30, registeredCount: 12 },
    { id: '3', name: 'Guest Speaker Token', price: 'Free', limit: 10, registeredCount: 2 },
    { id: '4', name: 'Staff Operator Access', price: 'Free', limit: 8, registeredCount: 4 },
  ]);
  const [requireHostApproval, setRequireHostApproval] = useState(false);
  const [registrationFormFields, setRegistrationFormFields] = useState([
    { id: 'f-name', label: 'Full Name', required: true, custom: false },
    { id: 'f-email', label: 'Email Address', required: true, custom: false },
    { id: 'f-diet', label: 'Dietary Restrictions (Optional)', required: false, custom: true },
    { id: 'f-tshirt', label: 'T-Shirt Size Selection', required: false, custom: true },
  ]);

  // Outreach blaster states
  const [blastSubject, setBlastSubject] = useState('Important Update regarding the event!');
  const [blastContent, setBlastContent] = useState('Hello beautiful people! We are incredibly excited to host you. Please ensure you have downloaded your personalized event pass SVG/PNG credentials for offline door scanning.');
  const [blastRecipientBadge, setBlastRecipientBadge] = useState('All');
  const [hasSentBlastSimulated, setHasSentBlastSimulated] = useState(false);
  const [selectedAttendeeId, setSelectedAttendeeId] = useState<string>(
    attendees[0]?.id || 'att-yemi'
  );
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Modal displays
  const [showScanner, setShowScanner] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Individual Form entries
  const [customAttendeeName, setCustomAttendeeName] = useState('');
  const [customAttendeeType, setCustomAttendeeType] = useState('GENERAL');
  const [customAttendeeEmail, setCustomAttendeeEmail] = useState('');

  // ── PWA install / instruction prompts ──
  const [isIOS, setIsIOS] = useState(false);
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);

  const handleBrandColorChange = (brandHex: string) => {
    try {
      const { h, s, l } = hexToHsl(brandHex);
      
      // Background: subtle tint canvas (lightness = 98%, saturation clamped below 12%)
      const bgS = Math.min(s, 12);
      const bgL = 98;
      const optimalBg = hslToHex(h, bgS, bgL);

      // Title text: high contrast display version of the hue (lightness = 12%, highly saturated)
      const titleS = Math.max(s, 75);
      const titleL = 12;
      const optimalTitle = hslToHex(h, titleS, titleL);

      // Content text: body level contrast (lightness = 30%, medium saturated)
      const contentS = Math.max(s, 50);
      const contentL = 30;
      const optimalContent = hslToHex(h, contentS, contentL);

      setEvent((prev) => ({
        ...prev,
        brandColor: brandHex,
        brandBgColor: optimalBg,
        brandTitleColor: optimalTitle,
        brandContentColor: optimalContent
      }));
    } catch (err) {
      console.warn('HSL calculation failed, using raw color:', err);
      setEvent((prev) => ({
        ...prev,
        brandColor: brandHex
      }));
    }
  };

  useEffect(() => {
    // Register PWA service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch((e) => {
        console.warn('PWA service worker deployment ignored in sandboxed testing:', e);
      });
    }

    // Check iOS Safari to show share instruction fallback
    const ua = window.navigator.userAgent;
    const isAppleMobile = /iPhone|iPad|iPod/.test(ua);
    setIsIOS(isAppleMobile);

    // Grab install prompt for standard browsers
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
    });
  }, []);

  // 12 Hex colors matching preset swatches
  const PRESET_HEXS = [
    '#6366F1', '#F97316', '#8B5CF6', '#F43F5E',
    '#0EA5E9', '#F59E0B', '#14B8A6', '#84CC16',
    '#10B981', '#78716C', '#475569', '#1E1B4B'
  ];

  const triggerPWAInstall = () => {
    if (pwaInstallPrompt) {
      pwaInstallPrompt.prompt();
      pwaInstallPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User installed Trmn to home screen');
        }
        setPwaInstallPrompt(null);
      });
    }
  };

  // Generate secure verifiable hash and add guest manually
  const handleAddNewAttendeeSubmit = () => {
    if (!customAttendeeName.trim()) return;

    const guestId = 'att-' + Math.random().toString(36).substring(2, 11);
    const passCode = Math.floor(1000 + Math.random() * 9000);
    const passId = `EVT-2026-${passCode}`;
    const hmac = signAttendeePass(event.id, guestId, event.secretKey);

    const newGuest: Attendee = {
      id: guestId,
      name: customAttendeeName.trim(),
      type: customAttendeeType.toUpperCase(),
      email: customAttendeeEmail.trim(),
      status: 'registered',
      passId,
      hmacSignature: hmac,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      eventId: event.id
    };

    setAttendees((prev) => [newGuest, ...prev]);
    setSelectedAttendeeId(guestId);
    
    // Reset inputs
    setCustomAttendeeName('');
    setCustomAttendeeEmail('');
    
    // Confetti celebration
    setConfettiTrigger((t) => t + 1);
  };

  // Delete attendee record
  const handleDeleteAttendee = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the event?`)) {
      setAttendees((prev) => prev.filter((a) => a.id !== id));
      if (selectedAttendeeId === id) {
        setSelectedAttendeeId(attendees.find((a) => a.id !== id)?.id || '');
      }
    }
  };

  // Kwame's Check-In handler (triggers green result successfully)
  const handleCheckInGuestFromScanner = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((a) => {
        if (a.id === attendeeId) {
          return {
            ...a,
            status: 'checked-in',
            checkedInAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
  };

  // Handle logo/banner picture file reads
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setEvent((prev) => ({ ...prev, logoUrl: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setEvent((prev) => ({ ...prev, bannerUrl: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Individual ticket exports (using high fidelity canvas generator)
  const downloadSinglePNG = async (att: Attendee) => {
    try {
      const canvas = await renderPassToCanvas(event, att);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${att.name.replace(/\s+/g, '_')}_pass.png`;
      link.href = url;
      link.click();
    } catch (e) {
      alert('Error rendering pass PNG download.');
      console.error(e);
    }
  };

  const downloadSinglePDF = async (att: Attendee) => {
    try {
      const canvas = await renderPassToCanvas(event, att);
      const url = canvas.toDataURL('image/png');

      const isSquare = event.template === 'CANVAS';
      const wWidth = 700;
      const wHeight = isSquare ? 500 : 400;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [wWidth, wHeight],
      });

      pdf.addImage(url, 'PNG', 0, 0, wWidth, wHeight);
      pdf.save(`${att.name.replace(/\s+/g, '_')}_ticket.pdf`);
    } catch (e) {
      alert('Error rendering printing PDF.');
      console.error(e);
    }
  };

  // ZIP bulk downloads
  const downloadAllZIP = async () => {
    if (attendees.length === 0) return;
    try {
      const zip = new JSZip();
      for (const att of attendees) {
        const canvas = await renderPassToCanvas(event, att);
        const url = canvas.toDataURL('image/png');
        const base64Data = url.replace(/^data:image\/png;base64,/, '');
        zip.file(`${att.name.replace(/\s+/g, '_')}_pass.png`, base64Data, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const dlLink = document.createElement('a');
      dlLink.href = URL.createObjectURL(blob);
      dlLink.download = `${event.name.replace(/\s+/g, '_')}_all_passes.zip`;
      dlLink.click();
    } catch (e) {
      console.error(e);
      alert('Failed to package batch tickets ZIP.');
    }
  };

  // Integrated multi-page PDF export of all passes
  const downloadAllPDFCombined = async () => {
    if (attendees.length === 0) return;
    try {
      const isSquare = event.template === 'CANVAS';
      const wWidth = 700;
      const wHeight = isSquare ? 500 : 400;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [wWidth, wHeight],
      });

      for (let i = 0; i < attendees.length; i++) {
        const att = attendees[i];
        if (i > 0) {
          pdf.addPage([wWidth, wHeight], 'landscape');
        }
        const canvas = await renderPassToCanvas(event, att);
        const url = canvas.toDataURL('image/png');
        pdf.addImage(url, 'PNG', 0, 0, wWidth, wHeight);
      }

      pdf.save(`${event.name.replace(/\s+/g, '_')}_combined_passes.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate combined print PDF.');
    }
  };

  // Copy customizable direct WhatsApp pass view link to clipboard
  const getWhatsAppURL = (att: Attendee) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    
    // Encodes complete attributes so the pass works flawlessly as static attendee link
    const params = new URLSearchParams({
      viewerMode: 'true',
      eventName: event.name,
      eventDate: event.dateTime,
      eventVenue: event.venue,
      eventOrg: event.organizerName,
      logoUrl: event.logoUrl || '',
      bannerUrl: event.bannerUrl || '',
      brandHex: event.brandColor,
      template: event.template,
      pattern: event.pattern,
      animation: event.animation,
      badgeText: event.badgeText,
      emojis: event.emojis.join(','),
      
      guestId: att.id,
      guestName: att.name,
      guestType: att.type,
      guestEmail: att.email || '',
      guestPassId: att.passId,
      guestSignature: att.hmacSignature,
      eventSecret: event.secretKey, // passed to enable attendee's viewer preview integrity
      eventId: event.id
    });

    return `${protocol}//${host}?${params.toString()}`;
  };

  const copyShareLinkToClipboard = (att: Attendee, index: number) => {
    const link = getWhatsAppURL(att);
    navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Search filtered registry list definition
  const filteredAttendees = useMemo(() => {
    return attendees.filter((att) => {
      const q = attendeeSearchQuery.toLowerCase();
      return (
        att.name.toLowerCase().includes(q) ||
        att.email.toLowerCase().includes(q) ||
        att.type.toLowerCase().includes(q) ||
        att.passId.toLowerCase().includes(q)
      );
    });
  }, [attendees, attendeeSearchQuery]);

  // Selected attendee for pass state preview
  const activePreviewAttendee = useMemo(() => {
    return attendees.find((a) => a.id === selectedAttendeeId) || attendees[0] || {
      id: 'demo-guest',
      name: 'Yemi Adebayo',
      type: 'VIP',
      email: 'yemi@example.com',
      status: 'registered',
      passId: 'EVT-2026-DEMO',
      hmacSignature: 'demo-sig'
    };
  }, [attendees, selectedAttendeeId]);



  // ──────────────────────────────────────────
  // ── ROUTE CHECKER: ATTENDEE VIEWER MODE ──
  // ──────────────────────────────────────────
  const isAttendeeViewer = urlParams.get('viewerMode') === 'true';

  if (isAttendeeViewer) {
    // Populate structures on-the-fly from secure signature parameters
    const viewerEvent: EventDetails = {
      id: urlParams.get('eventId') || 'temp-id',
      name: urlParams.get('eventName') || 'Midnight Corporate Workshop',
      dateTime: urlParams.get('eventDate') || '2026-06-14T19:00',
      venue: urlParams.get('eventVenue') || 'Metropolitan Glass Hall',
      organizerName: urlParams.get('eventOrg') || 'Event Org',
      brandColor: urlParams.get('brandHex') || '#6366F1',
      template: (urlParams.get('template') as PassTemplate) || 'AURORA',
      pattern: (urlParams.get('pattern') as BackgroundPattern) || 'none',
      animation: (urlParams.get('animation') as PassAnimation) || 'shimmer',
      emojis: urlParams.get('emojis') ? urlParams.get('emojis')!.split(',') : ['🎉'],
      badgeText: urlParams.get('badgeText') || 'GENERAL',
      secretKey: urlParams.get('eventSecret') || 'guestSecret',
    };

    const viewerAttendee: Attendee = {
      id: urlParams.get('guestId') || 'temp-arg',
      name: urlParams.get('guestName') || 'Guest Name',
      type: urlParams.get('guestType') || 'GENERAL',
      email: urlParams.get('guestEmail') || '',
      status: 'registered',
      passId: urlParams.get('guestPassId') || 'EVT-XXXX',
      hmacSignature: urlParams.get('guestSignature') || '',
    };

    return (
      <div className="min-h-screen bg-[#0D0C1A] text-white flex flex-col items-center justify-between p-4 sm:p-6 overflow-x-hidden pt-12 sm:pt-16 select-text">
        <div className="w-full max-w-lg space-y-6 text-center">
          
          {/* Elegant header branding */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-indigo-300 font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Verified Event Ticket Pass
            </div>
            <h2 className="text-xl font-bold font-sans tracking-wide">
              Your pass for {viewerEvent.name}
            </h2>
          </div>

          {/* Ticket preview card itself */}
          <div className="flex justify-center py-2 animate-fade-in relative z-20">
            <PassCardPreview event={viewerEvent} attendee={viewerAttendee} />
          </div>

          {/* Action options sheets */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 text-left space-y-4">
            <div className="flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1 leading-relaxed">
                <h4 className="font-bold text-white text-sm">Add to Home Screen (PWA)</h4>
                <p className="text-slate-400">
                  Save this pass directly onto your phone like a native app. Tap your browser's share icon{' '}
                  <strong className="text-white">{"Share → Add to Home Screen"}</strong>. It loads instantly even without any cell reception.
                </p>
                {pwaInstallPrompt && (
                  <button
                    onClick={triggerPWAInstall}
                    className="mt-2 text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Instantly Safe-Install Now <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Offline notification card */}
            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/10 text-[10px] text-slate-400 font-mono tracking-wide flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              This pass runs client-side under SHA-X cryptography. Keep screen brightness high at the gate!
            </div>

            {/* Print and PNG exports */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <button
                onClick={async () => {
                  try {
                    const canvas = await renderPassToCanvas(viewerEvent, viewerAttendee);
                    const url = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = `${viewerAttendee.name.replace(/\s+/g, '_')}_pass.png`;
                    link.href = url;
                    link.click();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="btn-primary h-[44px] text-xs font-semibold bg-white text-[#0D0C1A] hover:bg-slate-100 flex items-center gap-1.5 w-auto"
              >
                <Download className="w-4 h-4" />
                PNG Download
              </button>
              <button
                onClick={async () => {
                  try {
                    const canvas = await renderPassToCanvas(viewerEvent, viewerAttendee);
                    const url = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({
                      orientation: 'landscape',
                      unit: 'px',
                      format: [700, viewerEvent.template === 'CANVAS' ? 500 : 400],
                    });
                    pdf.addImage(url, 'PNG', 0, 0, 700, viewerEvent.template === 'CANVAS' ? 500 : 400);
                    pdf.save(`${viewerAttendee.name.replace(/\s+/g, '_')}_pass.pdf`);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="btn-secondary h-[44px] text-xs font-semibold hover:bg-slate-800 text-white border-white/10 flex items-center gap-1.5 w-auto"
              >
                <Ticket className="w-4 h-4" />
                Print (PDF)
              </button>
            </div>
          </div>
        </div>

        {/* Minimal watermark signature */}
        <div className="py-6 flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase text-slate-600">
          <Ticket className="w-3.5 h-3.5" />
          Powered by Trmn Passes • Offline Secure
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────
  // ── HANDLERS FOR NEW PLATFORM SHELL ──
  // ──────────────────────────────────────────

  // Generate verified dynamic ticket registered pass
  const handleRegisterPass = (evt: EventDetails, badgeLevel: string, visitorName: string, visitorEmail: string) => {
    const guestId = 'pub-' + Math.random().toString(36).substring(2, 9);
    const passCode = Math.floor(1000 + Math.random() * 9000);
    const signature = signAttendeePass(evt.id, guestId, evt.secretKey);
    const guestPassEntry: Attendee = {
      id: guestId,
      name: visitorName,
      type: badgeLevel.toUpperCase(),
      email: visitorEmail,
      status: 'registered',
      passId: `EVT-2026-${passCode}`,
      hmacSignature: signature,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      eventId: evt.id
    };

    setRegisteredEvents(prev => [{ event: evt, attendee: guestPassEntry }, ...prev]);
    // Also append to standard attendees list so scanner parses it
    setAttendees(prev => [guestPassEntry, ...prev]);
    setConfettiTrigger(t => t + 1);
  };

  // Spawn customizable fresh event templates
  const handleCreateCustomEvent = () => {
    const id = `evt-${Math.random().toString(36).substring(2, 9)}`;
    const presets = [
      { name: 'Afrobeats Symphony Live Arena', organizer: 'Lagos Acoustics', color: '#F97316', emojis: ['🥁', '🎶', '🔥'] },
      { name: 'Crypto Sovereignty Builders Meet', organizer: 'Aesthetics Lab', color: '#8B5CF6', emojis: ['💻', '✨', '🌐'] },
      { name: 'Soma Artisan Wine & Art Suite', organizer: 'The Glass Cellar', color: '#10B981', emojis: ['🍷', '🎨', '🍞'] },
      { name: 'Web Core Performance Symposium', organizer: 'Vite Pioneers Guild', color: '#0EA5E9', emojis: ['🚀', '📈', '✨'] }
    ];
    const chosen = presets[Math.floor(Math.random() * presets.length)];
    const newEvt: EventDetails = {
      id,
      name: chosen.name,
      dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16), // 14 days in the future
      venue: 'Soma Penthouse Pavilion, Flat 12A',
      organizerName: chosen.organizer,
      brandColor: chosen.color,
      template: 'AURORA',
      pattern: 'waves',
      animation: 'shimmer',
      emojis: chosen.emojis,
      badgeText: 'VIP',
      secretKey: `secret-${Math.random().toString(36).substring(2, 9)}`,
    };

    setCreatedEvents(prev => [...prev, newEvt]);
    setActiveEditingEventId(id);
    setEvent(newEvt);
    setConfettiTrigger(t => t + 1);
  };

  // Filter attendees matching specific active event
  const activeEventAttendees = useMemo(() => {
    return filteredAttendees.filter((att) => {
      const attEventId = (att as any).eventId;
      if (attEventId) return attEventId === event.id;
      // Default pre-loaded attendees are assigned to Obsidian Jazz
      return event.id === 'evt-obsidian-jazz';
    });
  }, [filteredAttendees, event.id]);

  // ──────────────────────────────────────────
  // ── ROUTE CHECKER: PUBLIC CALENDAR VIEW ──
  // ──────────────────────────────────────────
  const isCalendarPublic = urlParams.get('calendarMode') === 'true';

  // ──────────────────────────────────────────
  // ── ROUTE CHECKER: PUBLIC EVENT BOOKING PAGE ──
  // ──────────────────────────────────────────
  const publicEventId = urlParams.get('publicEventId');
  const parsedPublicEvent = useMemo(() => {
    if (!publicEventId) return null;
    return createdEvents.find(e => e.id === publicEventId) || DISCOVER_PRESET_EVENTS.find(e => e.id === publicEventId);
  }, [publicEventId, createdEvents]);

  if (parsedPublicEvent) {
    return (
      <PublicEventView
        event={parsedPublicEvent}
        userProfile={userProfile}
        onRegisterPass={handleRegisterPass}
        onBackToDirectory={() => {
          const cleanUrl = window.location.protocol + "//" + window.location.host;
          window.location.href = cleanUrl;
        }}
      />
    );
  }

  const publicUser = urlParams.get('user') || 'Abiola Anjie';
  const publicTitle = urlParams.get('title') || `${publicUser}'s Live Portfolio`;
  const publicTheme = urlParams.get('vibe') || 'standard';

  if (isCalendarPublic) {
    return (
      <PublicCalendarView
        presets={DISCOVER_PRESET_EVENTS}
        publicUser={publicUser}
        publicTitle={publicTitle}
        publicTheme={publicTheme}
        userProfile={userProfile}
        onRegisterPass={handleRegisterPass}
      />
    );
  }

  // ONBOARDING & LOGIN RENDER GATE
  if (!isAuthenticated) {
    return (
      <OnboardingLogin
        onLoginSuccess={(email, name) => {
          setUserProfile((prev) => ({
            ...prev,
            email: email,
            name: name,
          }));
          setIsAuthenticated(true);
        }}
        defaultEmail={userProfile.email}
        defaultName={userProfile.name}
      />
    );
  }

  // ──────────────────────────────────────────
  // ── MAIN LAYOUT ROUTER RENDER ──
  // ──────────────────────────────────────────

  // VIEW A: EVENT WORKING ENVIRONMENT (CREATOR & GATE REGISTRY)
  if (activeEditingEventId !== null) {
    const workspaceTheme = activeTab === 'creator' ? getThemeStyles(event.eventThemeVibe || event.publicTheme) : getThemeStyles('default');

    return (
      <div 
        className={`min-h-screen pb-12 select-text transition-all duration-300 ${workspaceTheme.fontFamily} ${workspaceTheme.pageBg}`}
        style={workspaceTheme.customStyles}
      >
        
        {/* EDIT PORTAL HEADER */}
        {activeTab !== 'creator' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 select-none font-sans text-left border-b border-slate-200/50 dark:border-slate-800/80 mb-6 bg-transparent">
            
            {/* BREADCRUMB ROW */}
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-semibold text-xs mb-3">
              <button 
                onClick={() => setActiveEditingEventId(null)} 
                className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors font-bold flex items-center gap-0.5"
              >
                ← Back to Events
              </button>
              <ChevronRight className="w-3 h-3 opacity-60" />
              <span className="truncate max-w-[200px] text-slate-400 font-normal">Personal Manager desk</span>
            </div>

            {/* HERO TITLE SECTION WITH RIGHT ALIGNED PREVIEW */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
              <div>
                <h1 className="text-3xl font-black font-sans leading-tight tracking-tight text-slate-900 dark:text-white">
                  {event.name || 'Untitled Event'}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium select-none mt-1.5">
                  {event.venue || 'No location set'} · {new Date(event.dateTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <a 
                  href={`${window.location.protocol}//${window.location.host}?publicEventId=${event.id}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="px-4 py-1.5 h-9 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-95 transition-all shadow-sm"
                  title="Open public registration microsite page"
                >
                  Event Page
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveTab('creator')}
                  className="px-4 py-1.5 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-95 transition-all shadow-md shadow-indigo-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Edit Event
                </button>
                
                <button
                  onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer block"
                >
                  {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUB-NAVIGATION TABS (LUMA STYLE) */}
            <div className="flex flex-wrap items-center space-x-1 sm:space-x-5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab('guests')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'guests'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Guests ({activeEventAttendees.length})
              </button>

              <button
                onClick={() => setActiveTab('registration')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'registration'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Registration
              </button>

              <button
                onClick={() => setActiveTab('blasts')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'blasts'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Blasts
              </button>
            </div>

          </div>
        )}

        {/* EDIT PORTAL HEADER WHEN IN CREATOR STUDIO */}
        {activeTab === 'creator' && (
          <header className="sticky top-0 bg-white dark:bg-[#0E0C1C] border-b border-slate-100 dark:border-white/5 py-4 px-4 sm:px-6 z-40 flex flex-col md:flex-row items-center gap-4 justify-between transition-colors select-none shadow-[0_1px_10px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="font-sans font-medium text-xs text-slate-505 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                ← Back to Event Manage Desk
              </button>

              <div className="border-l border-slate-100 dark:border-white/10 h-6 mx-1 hidden md:block"></div>

              <div className="text-left font-sans">
                <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">
                  Editing Event
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-1 leading-none">
                  <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[150px]">{event.name}</span>
                  {event.venue && (
                    <>
                      <span className="text-slate-300 dark:text-slate-705 font-light">|</span>
                      <span className="truncate max-w-[180px] font-medium text-slate-500 dark:text-slate-400">{event.venue}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-650 dark:hover:bg-indigo-550 text-white text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-600/10 flex items-center gap-1.5 shrink-0 hover:scale-[1.01] active:scale-98 select-none"
              >
                <Check className="w-3.5 h-3.5 shrink-0 text-indigo-200" />
                Done &amp; Save
              </button>
            </div>
          </header>
        )}

        {/* WORKSPACE CONTENT BLOCKS */}
        {activeTab === 'overview' ? (
          <EventOverview
            event={event}
            attendees={activeEventAttendees}
            userProfile={{ name: userProfile.name, email: userProfile.email }}
            onEditEvent={() => setActiveTab('creator')}
            onCheckInGuests={() => setActiveTab('registry')}
            onBack={() => setActiveEditingEventId(null)}
            onRegisterPass={(evt, info) => handleRegisterPass(evt, info.type, info.name, info.email)}
            onUpdateEvent={updateActiveEvent}
          />
        ) : activeTab === 'creator' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: VISUAL DESIGN WORKSPACE SLIDERS */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Visual Settings block */}
                <div className={`p-6 ${workspaceTheme.cardBg} ${workspaceTheme.cardBorder} text-left`}>
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3 mb-4">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      Event setup
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <InputField
                      label="Event Title / Name *"
                      placeholder="e.g., Midnight Jazz & Cabernet"
                      value={event.name}
                      onChange={(e) => setEvent({ ...event, name: e.target.value })}
                      icon={<Ticket className="w-3.5 h-3.5" />}
                    />

                    <InputField
                      label="Organizer / Host"
                      placeholder="e.g., Trmn pass"
                      value={event.organizerName}
                      onChange={(e) => setEvent({ 
                        ...event, 
                        organizerName: e.target.value,
                        secretKey: event.secretKey || `secret-${Math.random().toString(36).substring(2, 9)}`
                      })}
                      icon={<User className="w-3.5 h-3.5" />}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Date &amp; Timing"
                        type="datetime-local"
                        value={event.dateTime}
                        onChange={(e) => setEvent({ ...event, dateTime: e.target.value })}
                        icon={<Calendar className="w-3.5 h-3.5" />}
                      />

                      <InputField
                        label="Location"
                        placeholder="e.g., Soma Penthouse Pavilion"
                        value={event.venue}
                        onChange={(e) => setEvent({ ...event, venue: e.target.value })}
                        icon={<MapPin className="w-3.5 h-3.5" />}
                      />
                    </div>

                    <div className="border-t border-slate-200/50 dark:border-white/5 pt-5 mt-2">
                      <EventImageUploader
                        logoUrl={event.logoUrl}
                        bannerUrl={event.bannerUrl}
                        onChange={(updates) => {
                          setEvent((prev) => {
                            const result = { ...prev };
                            if ('logoUrl' in updates) {
                              result.logoUrl = updates.logoUrl ?? undefined;
                            }
                            if ('bannerUrl' in updates) {
                              result.bannerUrl = updates.bannerUrl ?? undefined;
                            }
                            return result;
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Themes & Customization Section */}
                <div className={`border p-1 ${workspaceTheme.cardBg} ${workspaceTheme.cardBorder} text-left overflow-hidden`}>
                  
                  {/* Card Header & Tab Switchers */}
                  <div className="p-6 pb-4 border-b border-slate-100 dark:border-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-violet-500 animate-pulse" />
                        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                          Themes & Customization
                        </h3>
                      </div>

                      {/* Pill tabs selector */}
                      <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200/30 dark:border-white/5 shadow-inner self-start">
                        <button
                          type="button"
                          onClick={() => setThemesActiveSubTab('event')}
                          className={`px-3 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${
                            themesActiveSubTab === 'event'
                              ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          1. Event Page
                        </button>
                        <button
                          type="button"
                          onClick={() => setThemesActiveSubTab('pass')}
                          className={`px-3 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${
                            themesActiveSubTab === 'pass'
                              ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          2. Pass Card
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-4 space-y-5">
                    {/* CONDITIONAL CONTENT */}
                    {themesActiveSubTab === 'event' ? (
                      <div className="space-y-4 animate-fade-in text-left">
                        {/* Event Page Theme Vibe dropdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <SelectField
                              label="Landing Vibe Theme"
                              icon={<Palette className="w-3.5 h-3.5" />}
                              value={event.eventThemeVibe || event.publicTheme || 'default'}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setEvent({ ...event, eventThemeVibe: val, publicTheme: val });
                              }}
                            >
                              <option value="default">Default / Fallback State</option>
                              <option value="standard">Standard Minimalist</option>
                              <option value="warm">Rustic Amber</option>
                              <option value="forest">Moss Whisper</option>
                              <option value="geometric_grid">Geometric Grid</option>
                              <option value="solstice_shift">Solstice Shift</option>
                            </SelectField>
                            <span className="text-[10px] mt-1.5 text-slate-500 dark:text-slate-450 font-medium leading-normal block bg-slate-100/50 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-205/10">
                              <strong>Theme Design Vibe:</strong> {getThemeStyles(event.eventThemeVibe || event.publicTheme || 'default').description}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex gap-2.5 items-end">
                              <div className="w-1/2">
                                <SelectField
                                  label="Access Pricing Tier"
                                  value={event.ticketType || 'free'}
                                  onChange={(e: any) => setEvent({ ...event, ticketType: e.target.value as any, ticketPrice: e.target.value === 'free' ? 0 : 15 })}
                                >
                                  <option value="free">Free Admission</option>
                                  <option value="paid">Paid Ticket</option>
                                </SelectField>
                              </div>
                              {event.ticketType === 'paid' && (
                                <div className="flex-grow">
                                  <InputField
                                    label="Price ($)"
                                    type="number"
                                    min={1}
                                    placeholder="Ticket price"
                                    value={event.ticketPrice || ''}
                                    onChange={(e) => setEvent({ ...event, ticketPrice: parseFloat(e.target.value) || 0 })}
                                    icon={<span className="text-xs font-extrabold font-mono text-violet-400">$</span>}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="space-y-4 animate-fade-in text-left">
                        {/* Core Pass card specs */}
                        <div className="space-y-4">
                          {/* Layout design option */}
                          <div className="space-y-1">
                            <SelectField
                              label="Theme Template"
                              icon={<Palette className="w-3.5 h-3.5" />}
                              value={event.template}
                              onChange={(e) => {
                                const nextTpl = e.target.value as PassTemplate;
                                let defAccent = '#6366F1';
                                let defBg = '#FFFFFF';
                                if (nextTpl === 'CANVAS') {
                                  defAccent = '#A75D35';
                                  defBg = '#FAF6F0';
                                } else if (nextTpl === 'OBSIDIAN') {
                                  defAccent = '#E2E8F0';
                                  defBg = '#05050A';
                                } else if (nextTpl === 'AURORA') {
                                  defAccent = '#38BDF8';
                                  defBg = '#0C0A21';
                                } else if (nextTpl === 'NEON') {
                                  defAccent = '#EC4899';
                                  defBg = '#05050A';
                                } else if (nextTpl === 'BLOOM') {
                                  defAccent = '#2E6F40';
                                  defBg = '#EDF5EB';
                                } else if (nextTpl === 'ROMANCE') {
                                  defAccent = '#C5A059';
                                  defBg = '#FFF9F2';
                                } else if (nextTpl === 'GLASS') {
                                  defAccent = '#38BDF8';
                                  defBg = 'rgba(255, 255, 255, 0.14)';
                                } else if (nextTpl === 'LOVE_IN_THE_AIR') {
                                  defAccent = '#F43F5E';
                                  defBg = '#5C0612';
                                } else if (nextTpl === 'GARDEN_BERRIES') {
                                  defAccent = '#7C3AED';
                                  defBg = '#FAF5FF';
                                } else if (nextTpl === 'TECH_MOTION') {
                                  defAccent = '#22D3EE';
                                  defBg = '#060814';
                                } else if (nextTpl === 'CREATIVE_FEST') {
                                  defAccent = '#F43F5E';
                                  defBg = '#FCF8FF';
                                }
                                setEvent({
                                  ...event,
                                  template: nextTpl,
                                  brandColor: defAccent,
                                  brandBgColor: defBg
                                });
                              }}
                            >
                              <option value="CANVAS">Classic Canvas</option>
                              <option value="OBSIDIAN">Premium Slate</option>
                              <option value="AURORA">Neon Aurora Glow</option>
                              <option value="NEON">Vibrant Cyber Neon</option>
                              <option value="BLOOM">Healing Organic Bloom</option>
                              <option value="ROMANCE">Eternal Romance</option>
                              <option value="GLASS">Liquid Glassmorphism</option>
                              <option value="LOVE_IN_THE_AIR">Love in the air</option>
                              <option value="GARDEN_BERRIES">Garden berries</option>
                              <option value="TECH_MOTION">Tech motion</option>
                              <option value="CREATIVE_FEST">Creative fest</option>
                            </SelectField>
                          </div>
                        </div>

                        {/* Badge class selection dropdown & Pass Color Swatches */}
                        <div className="space-y-4 pt-1">
                          {/* Badge class selection dropdown with options requested                          {/* Split Color Customization: Brand Color and Accordion */}
                          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5 font-sans">
                            {/* Brand color picker row */}
                            <div className="space-y-1">
                              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-350 tracking-tight block">
                                Brand Color Picker
                              </span>
                              <span className="text-[12px] text-slate-400 dark:text-slate-500 font-normal leading-normal block">
                                Select dynamic primary branding. System automatically computes matching high-contrast layouts.
                              </span>
                              <div className="flex flex-wrap gap-2.5 pt-2">
                                {[
                                  '#6366F1', // Indigo
                                  '#EC4899', // Pink
                                  '#10B981', // Emerald
                                  '#F59E0B', // Amber
                                  '#EF4444', // Red
                                  '#0EA5E9', // Sky
                                  '#8B5CF6', // Purple
                                  '#111111', // Matte Black
                                  '#D95D39', // Terracotta Rust
                                  '#5F7A61', // Sage Green
                                  '#D4AF37', // Champagne Gold
                                  '#7C3AED'  // Deep Violet
                                ].map((col) => {
                                  const isActive = event.brandColor === col;
                                  return (
                                    <button
                                      key={`brand-prest-${col}`}
                                      type="button"
                                      onClick={() => handleBrandColorChange(col)}
                                      className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-105 border border-slate-200/50 dark:border-white/10"
                                      style={{
                                        backgroundColor: col,
                                        color: col, // currentColor
                                        outline: isActive ? '2px solid currentColor' : 'none',
                                        outlineOffset: isActive ? '2px' : '0px',
                                      }}
                                      title={col}
                                    />
                                  );
                                })}

                                {/* Native color picker (+) tile */}
                                <label 
                                  className="w-7 h-7 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-colors bg-transparent text-slate-400 hover:text-violet-500 hover:border-violet-500 relative"
                                  style={{
                                    outline: !['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#0EA5E9', '#8B5CF6', '#111111', '#D95D39', '#5F7A61', '#D4AF37', '#7C3AED'].includes(event.brandColor) ? '2px solid currentColor' : 'none',
                                    outlineOffset: '2px',
                                    color: event.brandColor
                                  }}
                                  title="Custom Color"
                                >
                                  <span className="text-base font-bold leading-none select-none">+</span>
                                  <input
                                    type="color"
                                    value={event.brandColor}
                                    onChange={(e) => handleBrandColorChange(e.target.value)}
                                    className="sr-only"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Accordion Element: Labeled "Advanced Layout Customization" / Closed by default */}
                            <div className="pt-2">
                              <button
                                type="button"
                                onClick={() => setShowAdvancedColors(!showAdvancedColors)}
                                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-indigo-950/20 hover:dark:border-indigo-950/40 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Palette className="w-3.5 h-3.5 text-violet-500" />
                                  Advanced Layout Customization
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showAdvancedColors ? 'rotate-180' : ''}`} />
                              </button>

                              {showAdvancedColors && (
                                <div className="mt-4 p-4 rounded-2xl border border-slate-100 dark:border-white/5 space-y-4 bg-slate-50/30 dark:bg-slate-950/20 animate-fade-in text-left">
                                  
                                  {/* Pass Background Color row */}
                                  <div className="space-y-1">
                                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-350 tracking-tight block">
                                      Pass Background Color
                                    </span>
                                    <span className="text-[12px] text-slate-400 dark:text-slate-505 font-normal leading-normal block">
                                      Custom override background canvas of your ticket pass.
                                    </span>
                                    <div className="flex flex-wrap gap-2 pt-1.5">
                                      {[
                                        '#FFFFFF', // Pure White
                                        '#FAF8F5', // Matte sketchbook off-white
                                        '#F5EFE4', // Warm Sand Beige
                                        '#1E2022', // Sleek Charcoal
                                        '#0B081E', // Cosmos Blue-Black
                                        '#000000', // Stark Black
                                        '#D95D39', // Terracotta Rust
                                        '#5F7A61', // Sage Green
                                        '#D4AF37', // Champagne Gold
                                        '#6366F1', // Vibrant Royal Indigo
                                        '#EC4899', // Hot Cyber Pink
                                        '#10B981', // Energetic Emerald Green
                                        '#D946EF'  // Bright Vaporwave Purple
                                      ].map((col) => {
                                        const isActive = event.brandBgColor === col;
                                        return (
                                          <button
                                            key={`bg-prest-${col}`}
                                            type="button"
                                            onClick={() => setEvent({ ...event, brandBgColor: col })}
                                            className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-105 border border-slate-200/50 dark:border-white/10"
                                            style={{
                                              backgroundColor: col,
                                              color: col, // currentColor
                                              outline: isActive ? '2px solid currentColor' : 'none',
                                              outlineOffset: isActive ? '2px' : '0px',
                                            }}
                                            title={col}
                                          />
                                        );
                                      })}
                                      {/* Native BG color picker (+) tile */}
                                      <label 
                                        className="w-6 h-6 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-colors bg-transparent text-slate-400 hover:text-violet-500 hover:border-violet-500 relative"
                                        style={{
                                          outline: !['#FFFFFF', '#FAF8F5', '#F5EFE4', '#1E2022', '#0B081E', '#000000', '#D95D39', '#5F7A61', '#D4AF37', '#6366F1', '#EC4899', '#10B981', '#D946EF'].includes(event.brandBgColor || '') ? '2px solid currentColor' : 'none',
                                          outlineOffset: '2px',
                                          color: event.brandBgColor || '#FFFFFF'
                                        }}
                                        title="Custom BG Color"
                                      >
                                        <span className="text-xs font-bold leading-none select-none">+</span>
                                        <input
                                          type="color"
                                          value={event.brandBgColor || '#FFFFFF'}
                                          onChange={(e) => setEvent({ ...event, brandBgColor: e.target.value })}
                                          className="sr-only"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  {/* Title Text Color row */}
                                  <div className="space-y-1">
                                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-350 tracking-tight block">
                                      Title Text Color
                                    </span>
                                    <span className="text-[12px] text-slate-400 dark:text-slate-505 font-normal leading-normal block">
                                      Custom color used for prominent typography and headers.
                                    </span>
                                    <div className="flex flex-wrap gap-2 pt-1.5 font-sans">
                                      <button
                                        type="button"
                                        onClick={() => setEvent({ ...event, brandTitleColor: undefined })}
                                        className={`px-3.5 h-6.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                                          !event.brandTitleColor 
                                            ? 'bg-violet-600 text-white border-violet-600 dark:border-violet-600 font-sans' 
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-500 hover:scale-105 font-sans'
                                        }`}
                                        style={!event.brandTitleColor ? { outline: '2px solid currentColor', outlineOffset: '2px', color: '#7C3AED' } : undefined}
                                        title="Reset title text color"
                                      >
                                        Default Contrast
                                      </button>
                                      {[
                                        '#0F172A', // Slate Dark Charcoal
                                        '#FFFFFF', // Pure White
                                        '#6366F1', // Vivid Royal Indigo
                                        '#EC4899', // Cyber Pink Glow
                                        '#10B981', // Dynamic Neon Mint
                                        '#38BDF8', // Tech Digital Blue
                                        '#F59E0B'  // Bright Amber Gold
                                      ].map((col) => {
                                        const isActive = event.brandTitleColor === col;
                                        return (
                                          <button
                                            key={`title-txt-${col}`}
                                            type="button"
                                            onClick={() => setEvent({ ...event, brandTitleColor: col })}
                                            className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-105 border border-slate-200/50 dark:border-white/10"
                                            style={{
                                              backgroundColor: col,
                                              color: col, // currentColor
                                              outline: isActive ? '2px solid currentColor' : 'none',
                                              outlineOffset: isActive ? '2px' : '0px',
                                            }}
                                            title={col}
                                          />
                                        );
                                      })}
                                      {/* Native Title color picker (+) tile */}
                                      <label 
                                        className="w-6 h-6 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-colors bg-transparent text-slate-400 hover:text-violet-500 hover:border-violet-500 relative"
                                        style={{
                                          outline: event.brandTitleColor && !['#0F172A', '#FFFFFF', '#6366F1', '#EC4899', '#10B981', '#38BDF8', '#F59E0B'].includes(event.brandTitleColor) ? '2px solid currentColor' : 'none',
                                          outlineOffset: '2px',
                                          color: event.brandTitleColor || '#000000'
                                        }}
                                        title="Custom Title Color"
                                      >
                                        <span className="text-xs font-bold leading-none select-none">+</span>
                                        <input
                                          type="color"
                                          value={event.brandTitleColor || '#000000'}
                                          onChange={(e) => setEvent({ ...event, brandTitleColor: e.target.value })}
                                          className="sr-only"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  {/* Content Text Color row */}
                                  <div className="space-y-1">
                                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-350 tracking-tight block">
                                      Content Text Color
                                    </span>
                                    <span className="text-[12px] text-slate-400 dark:text-slate-505 font-normal leading-normal block">
                                      Custom color used for peripheral description fields and meta-details.
                                    </span>
                                    <div className="flex flex-wrap gap-2 pt-1.5 font-sans">
                                      <button
                                        type="button"
                                        onClick={() => setEvent({ ...event, brandContentColor: undefined })}
                                        className={`px-3.5 h-6.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                                          !event.brandContentColor 
                                            ? 'bg-violet-600 text-white border-violet-600 dark:border-violet-600 font-sans' 
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-500 hover:scale-105 font-sans'
                                        }`}
                                        style={!event.brandContentColor ? { outline: '2px solid currentColor', outlineOffset: '2px', color: '#7C3AED' } : undefined}
                                        title="Reset content text color"
                                      >
                                        Default Contrast
                                      </button>
                                      {[
                                        '#0F172A', // Slate Dark Charcoal
                                        '#FFFFFF', // Pure White
                                        '#6366F1', // Vivid Royal Indigo
                                        '#EC4899', // Cyber Pink Glow
                                        '#10B981', // Dynamic Neon Mint
                                        '#38BDF8', // Tech Digital Blue
                                        '#F59E0B'  // Bright Amber Gold
                                      ].map((col) => {
                                        const isActive = event.brandContentColor === col;
                                        return (
                                          <button
                                            key={`content-txt-${col}`}
                                            type="button"
                                            onClick={() => setEvent({ ...event, brandContentColor: col })}
                                            className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-105 border border-slate-200/50 dark:border-white/10"
                                            style={{
                                              backgroundColor: col,
                                              color: col, // currentColor
                                              outline: isActive ? '2px solid currentColor' : 'none',
                                              outlineOffset: isActive ? '2px' : '0px',
                                            }}
                                            title={col}
                                          />
                                        );
                                      })}
                                      {/* Native Content color picker (+) tile */}
                                      <label 
                                        className="w-6 h-6 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-colors bg-transparent text-slate-400 hover:text-violet-500 hover:border-violet-500 relative"
                                        style={{
                                          outline: event.brandContentColor && !['#0F172A', '#FFFFFF', '#6366F1', '#EC4899', '#10B981', '#38BDF8', '#F59E0B'].includes(event.brandContentColor) ? '2px solid currentColor' : 'none',
                                          outlineOffset: '2px',
                                          color: event.brandContentColor || '#000000'
                                        }}
                                        title="Custom Content Color"
                                      >
                                        <span className="text-xs font-bold leading-none select-none">+</span>
                                        <input
                                          type="color"
                                          value={event.brandContentColor || '#000000'}
                                          onChange={(e) => setEvent({ ...event, brandContentColor: e.target.value })}
                                          className="sr-only"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Quick Add Guest Form Panel */}
                <div className="card p-6 bg-white dark:bg-[#110F2B] border border-slate-200/40 dark:border-slate-800/50 shadow-sm text-left">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3 mb-4">
                    <UserPlus className="w-4 h-4 text-violet-400" />
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      Individual Ticket Verification Generator
                    </h3>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddNewAttendeeSubmit();
                    }}
                    className="space-y-3 font-sans"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left items-end">
                      <InputField
                        label="Name *"
                        type="text"
                        required
                        className="!h-9 !text-xs"
                        placeholder="Yemi Adebayo"
                        value={customAttendeeName}
                        onChange={(e) => setCustomAttendeeName(e.target.value)}
                        icon={<Sparkles className="w-3.5 h-3.5" />}
                      />
                      
                      <SelectField
                        label="Badge Class"
                        className="!h-9 !text-xs"
                        value={customAttendeeType}
                        onChange={(e: any) => setCustomAttendeeType(e.target.value)}
                        icon={<Sparkles className="w-3.5 h-3.5" />}
                      >
                        <option value="GENERAL">General</option>
                        <option value="VIP">VIP</option>
                        <option value="STAFF">Staff</option>
                        <option value="SPEAKER">Speaker</option>
                      </SelectField>

                      <InputField
                        label="Email"
                        type="email"
                        className="!h-9 !text-xs"
                        placeholder="yemi@example.com"
                        value={customAttendeeEmail}
                        onChange={(e) => setCustomAttendeeEmail(e.target.value)}
                        icon={<Sparkles className="w-3.5 h-3.5" />}
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="btn-primary !h-8 px-4 text-[10.5px] w-auto bg-violet-600 hover:bg-violet-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Attendee &amp; Print Pass
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* RIGHT COLUMN: PREVIEW PANEL */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 select-none text-left">
                <div className="card p-5 bg-white dark:bg-[#110F2B] border border-slate-100 dark:border-slate-800/60 shadow-sm text-left space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-3">
                    <h3 className="font-sans font-bold text-xs tracking-tight dark:text-white flex items-center gap-1.5 font-sans">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      Live Pass Verification Preview
                    </h3>
                    
                    {activeEventAttendees.length > 0 && (
                      <select
                        className="field !h-7 !py-0 !px-1.5 !w-28 !text-[10px] !rounded bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-white/5 shrink-0 cursor-pointer text-slate-700 dark:text-white"
                        value={selectedAttendeeId}
                        onChange={(e) => setSelectedAttendeeId(e.target.value)}
                      >
                        {activeEventAttendees.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.type})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="flex justify-center py-2 animate-fade-in relative z-10">
                    <PassCardPreview event={event} attendee={activePreviewAttendee} />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-1 text-[10.5px]">
                    <span className="text-slate-400 font-mono text-left">Verifies online &amp; offline.</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => downloadSinglePNG(activePreviewAttendee as Attendee)}
                        className="p-1 px-2.5 rounded bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/20 dark:hover:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-bold border border-transparent hover:border-violet-400/20 active:scale-95 cursor-pointer text-xs"
                      >
                        PNG
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadSinglePDF(activePreviewAttendee as Attendee)}
                        className="p-1 px-2.5 rounded bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/20 dark:hover:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-bold border border-transparent hover:border-violet-400/20 active:scale-95 cursor-pointer text-xs"
                      >
                        Print PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : activeTab === 'registration' ? (
          /* REGISTRATION TAB: TIERS & FIELD CONFIGURATION */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column - Tiers & Approval */}
              <div className="lg:col-span-7 space-y-6">
                <div className="card p-6 bg-white dark:bg-[#110F2B] border border-slate-100/80 dark:border-slate-800/60 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between border-b border-slate-150 dark:border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none">
                        Registration Ticket Tiers
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {ticketTiers.map((tier) => (
                      <div key={tier.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/80 rounded-xl">
                        <div className="text-left">
                          <h4 className="font-bold text-slate-800 dark:text-white text-xs">{tier.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Price: {tier.price} · Limit: {tier.limit} spots</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono">
                            {tier.registeredCount} / {tier.limit} Claimed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="indigo-form pt-4 border-t border-slate-150 dark:border-white/5 mt-4 space-y-3">
                    <span className="text-[11px] font-medium text-slate-400 block">Create custom registration tiers if required for VIP entries or team coordinators.</span>
                    <button
                      onClick={() => {
                        const name = prompt("Enter custom ticket tier name (e.g. Backstage Staff Pass):");
                        if (!name) return;
                        const limitStr = prompt("Enter maximum inventory limit (e.g. 50):", "50");
                        const limit = parseInt(limitStr || "50") || 50;
                        setTicketTiers(prev => [
                          ...prev,
                          { id: String(prev.length + 1), name, price: "Free", limit, registeredCount: 0 }
                        ]);
                      }}
                      className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Ticket Tier
                    </button>
                  </div>
                </div>

                <div className="card p-6 bg-white dark:bg-[#110F2B] border border-slate-100/80 dark:border-slate-800/60 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between border-b border-slate-150 dark:border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-amber-500" />
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none">
                        Access Credentials Protocol
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                    <div className="text-left space-y-0.5">
                      <h4 className="font-bold text-slate-800 dark:text-white text-xs">Require Host Approval</h4>
                      <p className="text-[10px] text-slate-500 leading-normal max-w-[340px]">
                        Guests register to join a waitlist. Tickets and wallet passes are only generated & emailed once host signs off.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={requireHostApproval} 
                        onChange={() => setRequireHostApproval(!requireHostApproval)}
                        className="sr-only peer" 
                      />
                      <div className="w-8 h-5 bg-slate-250 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-805 dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Custom Registration Fields */}
              <div className="lg:col-span-5 space-y-6">
                <div className="card p-6 bg-white dark:bg-[#110F2B] border border-slate-100/80 dark:border-slate-800/60 shadow-sm rounded-2xl text-left">
                  <div className="flex items-center justify-between border-b border-slate-150 dark:border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-5 h-5 text-violet-500" />
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none">
                        Guest Onboarding Fields
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Form Questions Setup</span>
                  <div className="space-y-2.5">
                    {registrationFormFields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-250/20 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 bg-opacity-40">
                        <div className="flex items-center gap-2">
                          <Check className={`w-3.5 h-3.5 ${field.required ? 'text-indigo-500 font-extrabold' : 'text-slate-400'}`} />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{field.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {field.required && (
                            <span className="text-[8.5px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 border dark:border-white/10 text-slate-500 dark:text-slate-400 rounded">
                              Required
                            </span>
                          )}
                          {field.custom && (
                            <button
                              onClick={() => {
                                setRegistrationFormFields(prev => prev.filter(f => f.id !== field.id));
                              }}
                              className="text-[10px] text-rose-500 hover:underline px-1.5 font-bold cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="indigo-form pt-4 border-t border-slate-150 dark:border-white/5 mt-4 space-y-3">
                    <button
                      onClick={() => {
                        const label = prompt("Enter custom question text (e.g. Dietary details):");
                        if (!label) return;
                        setRegistrationFormFields(prev => [
                          ...prev,
                          { id: 'f-' + Date.now(), label, required: false, custom: true }
                        ]);
                      }}
                      className="w-full justify-center px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Custom Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'blasts' ? (
          /* BLASTS TAB: OUTREACH AND EMAIL BLAST BOARD */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Live outreach console - 7 columns */}
              <div className="lg:col-span-7 space-y-6">
                <div className="card p-6 bg-white dark:bg-[#110F2B] border border-slate-100/80 dark:border-slate-800/60 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between border-b border-slate-150 dark:border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none">
                        Outreach Message Blaster
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                        Target Recipients Badge Class
                      </label>
                      <SelectField
                        value={blastRecipientBadge}
                        onChange={(e) => setBlastRecipientBadge(e.target.value)}
                      >
                        <option value="All">All Registered Attendees</option>
                        <option value="General">General Admission Only</option>
                        <option value="VIP">VIP Ticket Holders Only</option>
                        <option value="Speaker">Speakers Only</option>
                        <option value="Staff">Staff Operators Only</option>
                      </SelectField>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                        Broadcast Email Subject Line
                      </label>
                      <InputField
                        type="text"
                        value={blastSubject}
                        onChange={(e) => setBlastSubject(e.target.value)}
                        placeholder="Subject Line"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                        Email Message Body
                      </label>
                      <textarea
                        className="w-full min-h-[140px] px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-sans focus:outline-none focus:ring-1 focus:ring-indigo-600 select-text resize-none"
                        value={blastContent}
                        onChange={(e) => setBlastContent(e.target.value)}
                        placeholder="Hello, write some instructions to broadcast..."
                      />
                    </div>

                    {hasSentBlastSimulated && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold animate-fade-in text-left">
                        🚀 Blast successfully queued to {blastRecipientBadge === 'All' ? activeEventAttendees.length : activeEventAttendees.filter(a => a.type.toLowerCase() === blastRecipientBadge.toLowerCase()).length} recipients! Connection pass updates and reminders will hit their mailboxes within 2 minutes.
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-150 dark:border-white/5 flex gap-3">
                      <button
                        onClick={() => {
                          setHasSentBlastSimulated(true);
                          setConfettiTrigger(t => t + 1);
                          setTimeout(() => setHasSentBlastSimulated(false), 8000);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-slate-950 text-white dark:hover:bg-slate-900 font-bold text-xs shadow-md shadow-indigo-600/10 cursor-pointer select-none transition-all border border-transparent dark:border-slate-800"
                      >
                        Send Simulated Announcement
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery analytics side card - 5 columns */}
              <div className="lg:col-span-5 space-y-6">
                <div className="card p-6 bg-white dark:bg-[#110F2B] border border-slate-100/80 dark:border-slate-800/60 shadow-sm rounded-2xl text-left">
                  <div className="flex items-center justify-between border-b border-slate-150 dark:border-white/5 pb-4 mb-4">
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none">
                      Historic Sent Campaigns
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-white/5 space-y-3">
                    <div className="pt-2 text-left">
                      <span className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase block font-bold">● Sent Complete</span>
                      <h4 className="text-xs font-bold font-sans text-slate-800 dark:text-white mt-1">Doors Open Timings & Check-in QR Guidelines</h4>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">Sent using Ledger Engine to 63 guests · Delivery rate 100%</p>
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">May 25, 2026</span>
                    </div>

                    <div className="pt-3 text-left">
                      <span className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase block font-bold">● Sent Complete</span>
                      <h4 className="text-xs font-bold font-sans text-slate-800 dark:text-white mt-1">Sovereign Wallet Key Allocation & Verification Welcome</h4>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">Sent to all registrants · Delivery rate 100%</p>
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">May 19, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* REGISTRY WORKSPACE MODE: GUEST DIRECTORY LIST */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 animate-fade-in text-left">
            <div className="card p-6 bg-white dark:bg-[#110F2B] border border-slate-100 dark:border-slate-800/60 shadow-sm text-left">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-100 dark:border-white/5 pb-5 mb-5">
                <div className="text-left leading-none space-y-1">
                  <h3 className="text-sm font-extrabold font-sans dark:text-white flex items-center gap-1.5 uppercase tracking-widest text-[#64748B]">
                    <Users className="w-5 h-5 text-violet-400 shrink-0" />
                    Guest Verification Registry ({activeEventAttendees.length})
                  </h3>
                  <p className="text-xs text-slate-400">Scan QR codes at door gates or upload mass CSV rosters.</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowBulkUpload(true)}
                    className="btn-secondary !h-9 text-xs px-3.5 bg-violet-50 hover:bg-violet-105 dark:bg-violet-950/10 dark:hover:bg-violet-950/20 border-violet-100/50 dark:border-violet-900/30 flex items-center gap-1.5 text-violet-600 dark:text-violet-400 w-full sm:w-auto font-bold cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4 shrink-0 animate-bounce" />
                    Bulk CSV Import
                  </button>

                  <button
                    onClick={downloadAllZIP}
                    className="btn-secondary !h-9 text-xs px-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:text-slate-900 font-bold border rounded flex items-center gap-1 cursor-pointer select-none"
                    disabled={activeEventAttendees.length === 0}
                    title="Download ZIP of all pass PNG images"
                  >
                    ZIP Passes
                  </button>

                  <button
                    onClick={downloadAllPDFCombined}
                    className="btn-secondary !h-9 text-xs px-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:text-slate-900 font-bold border rounded flex items-center gap-1 cursor-pointer select-none"
                    disabled={activeEventAttendees.length === 0}
                    title="Print combined pass panels PDF"
                  >
                    Print All Combine
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <InputField
                  type="text"
                  placeholder="Search attendee by name, contact email, token signature class..."
                  value={attendeeSearchQuery}
                  onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                  icon={<Search className="w-3.5 h-3.5" />}
                />

                {activeEventAttendees.length > 0 ? (
                  <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-xl overflow-hidden overflow-x-auto text-left">
                    <table className="w-full text-left font-sans text-xs border-collapse">
                      <thead className="bg-[#F7F6F3] dark:bg-[#1B1A33] text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                        <tr>
                          <th className="px-5 py-3 font-bold">Attendee Guest Contact</th>
                          <th className="px-5 py-3 font-bold">Badge Class Tag</th>
                          <th className="px-5 py-3 font-bold">Pass ID</th>
                          <th className="px-5 py-3 font-bold">Status Checks</th>
                          <th className="px-5 py-3 font-bold text-right">Verification Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                        {activeEventAttendees.map((att, idx) => (
                          <tr
                            key={att.id}
                            className={`transition-colors text-slate-700 dark:text-slate-300 ${
                              selectedAttendeeId === att.id
                                ? 'bg-violet-50/10 dark:bg-violet-500/5'
                                : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
                            }`}
                          >
                            <td className="px-5 py-3 text-left">
                              <button
                                type="button"
                                onClick={() => setSelectedAttendeeId(att.id)}
                                className="font-bold hover:underline cursor-pointer text-left block text-slate-800 dark:text-white"
                              >
                                {att.name}
                              </button>
                              {att.email && <span className="text-[10px] text-slate-400 font-mono font-medium block">{att.email}</span>}
                            </td>

                            <td className="px-5 py-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold tracking-wider bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-white/5 uppercase">
                                {att.type}
                              </span>
                            </td>

                            <td className="px-5 py-3 font-mono text-[9.5px] font-medium tracking-widest text-slate-400">
                              {att.passId}
                            </td>

                            <td className="px-5 py-3 text-left">
                              {att.status === 'checked-in' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8.5px] font-extrabold tracking-wider uppercase font-mono">
                                  VERIFIED OK
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAttendees((prev) =>
                                      prev.map((a) =>
                                        a.id === att.id
                                          ? { ...a, status: 'checked-in', checkedInAt: new Date().toISOString() }
                                          : a
                                      )
                                    );
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-405 text-[8.5px] font-bold tracking-widest uppercase cursor-pointer border border-slate-200/50 dark:border-white/5"
                                >
                                  Mark verify
                                </button>
                              )}
                            </td>

                            <td className="px-5 py-3 text-right space-x-1.5">
                              <button
                                onClick={() => copyShareLinkToClipboard(att, idx)}
                                className="p-1 px-2.5 rounded bg-[#F7F6F3] hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-[9.5px] text-slate-600 dark:text-slate-300 font-bold cursor-pointer inline-flex items-center gap-1"
                              >
                                {copiedIndex === idx ? 'Copied' : 'Invite link'}
                              </button>

                              <button
                                onClick={() => downloadSinglePNG(att)}
                                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 cursor-pointer inline-block"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteAttendee(att.id, att.name)}
                                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-rose-500 cursor-pointer inline-block"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-10 text-center bg-[#F7F6F3] dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2 select-none">
                    <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-sm text-slate-500">No verification registry matches</h4>
                    <p className="text-xs text-slate-400">Clear search input parameters or manually mark guest check-in.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL INJECTORS SCANNERS */}
        {showScanner && (
          <QRScannerComp
            event={event}
            attendeeList={attendees}
            onCheckIn={handleCheckInGuestFromScanner}
            onClose={() => setShowScanner(false)}
          />
        )}

        {showBulkUpload && (
          <BulkUploadComp
            event={event}
            onImportComplete={(imported) => {
              // Add custom event identifier context to imported attendees!
              const mappedImported = imported.map(a => ({
                ...a,
                eventId: event.id
              }));
              setAttendees((prev) => [...mappedImported, ...prev]);
              setShowBulkUpload(false);
              setConfettiTrigger((t) => t + 1);
            }}
            onClose={() => setShowBulkUpload(false)}
          />
        )}

        <ConfettiShower trigger={confettiTrigger} styleType="classic" brandColor={event.brandColor} />
      </div>
    );
  }

  // VIEW B: PLATFORM CENTRAL SHELL HUB (activeEditingEventId === null)
  return (
    <div className="min-h-screen pb-20 select-text bg-gradient-to-b from-[#F2EDF7] via-[#FAF9FB] to-white dark:from-[#16122C] dark:via-[#0F0D21] dark:to-[#09081A] transition-colors duration-200">
      
      {/* HIGH LEVEL PLATFORM HEADER */}
      <header className="sticky top-0 bg-white/80 dark:bg-[#09081A]/85 backdrop-blur-md border-b border-slate-200/30 dark:border-white/5 py-3.5 px-3 sm:px-6 z-40 flex items-center justify-between transition-colors select-none">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          {/* Main logo mark on the far left */}
          <div className="flex items-center cursor-pointer select-none shrink-0" onClick={() => setNavTab('events')}>
            <TrmnLogo className="h-6" themeMode="adaptive" />
          </div>

          {/* Clean, text-based navigation links exactly matching screenshot */}
          <nav className="flex items-center gap-3.5 sm:gap-6 font-semibold text-sm min-w-0">
            <button
              onClick={() => setNavTab('events')}
              className={`transition-colors duration-150 relative py-1 cursor-pointer select-none leading-none ${
                navTab === 'events'
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-450 dark:text-slate-500 hover:text-slate-750 dark:hover:text-slate-350'
              }`}
            >
              Events
            </button>

            <button
              onClick={() => setNavTab('calendar')}
              className={`transition-colors duration-155 relative py-1 cursor-pointer select-none leading-none ${
                navTab === 'calendar'
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-450 dark:text-slate-500 hover:text-slate-750 dark:hover:text-slate-350'
              }`}
            >
              Calendars
            </button>

            <button
              onClick={() => setNavTab('discover')}
              className={`transition-colors duration-155 relative py-1 cursor-pointer select-none leading-none hidden min-[480px]:inline-block ${
                navTab === 'discover'
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-450 dark:text-slate-500 hover:text-slate-750 dark:hover:text-slate-350'
              }`}
            >
              Discover
            </button>
          </nav>
        </div>

        {/* Profile details, theme shortcut and core triggers matching Luma right side */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 select-none">
          {/* Create Event Button - Smart Responsive Button */}
          <button
            onClick={handleCreateCustomEvent}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:text-white dark:hover:bg-violet-900 font-bold text-xs sm:text-sm cursor-pointer select-none transition-all duration-150 shrink-0 border border-violet-100/30 dark:border-white/5 active:scale-95"
            title="Create Event"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Create Event</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setNavTab('discover')}
            className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer select-none hover:bg-slate-150/40 dark:hover:bg-slate-900/60 active:scale-95 ${
              navTab === 'discover' ? 'text-violet-500 bg-violet-50 dark:bg-violet-950/40' : 'text-slate-500 dark:text-slate-400 hover:text-slate-650'
            }`}
            title="Search and Discover"
          >
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>

          {/* Notification Bell */}
          <div className="relative flex items-center">
            <button
              onClick={() => alert('All caught up! No new notifications.')}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 transition-all relative cursor-pointer select-none hover:bg-slate-150/40 dark:hover:bg-slate-900/60 rounded-full active:scale-95"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full border border-white dark:border-slate-950 animate-pulse" />
            </button>
          </div>

          {/* Simple theme switcher */}
          <button
            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className="hidden min-[360px]:flex p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-650 dark:text-slate-550 dark:hover:text-slate-350 hover:bg-slate-150/40 dark:hover:bg-slate-900/60 transition-all cursor-pointer active:scale-95"
            aria-label="Toggle theme mode"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Profile identity avatar */}
          <button
            onClick={() => setNavTab('profile')}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm shadow-sm border cursor-pointer select-none hover:scale-105 active:scale-95 transition-all ${
              navTab === 'profile'
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
            }`}
            title="My Account Profile"
          >
            {userProfile.avatar || '👩‍💻'}
          </button>
        </div>
      </header>

      {/* CORE HIGH LEVEL TAB INTERFACES CONTENT RENDER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 text-center bg-transparent">
        
        {navTab === 'events' && (
          <EventsTab
            createdEvents={createdEvents}
            registeredEvents={registeredEvents}
            onSelectEvent={(id) => {
              setActiveEditingEventId(id);
              setActiveTab('overview');
            }}
            onCreateEvent={handleCreateCustomEvent}
            onViewPass={setSelectedPassModal}
          />
        )}

        {navTab === 'discover' && (
          <DiscoverTab
            presets={DISCOVER_PRESET_EVENTS}
            userProfile={userProfile}
            onRegisterPass={handleRegisterPass}
          />
        )}

        {navTab === 'calendar' && (
          <CalendarTab
            createdEvents={createdEvents}
            registeredEvents={registeredEvents}
            userName={userProfile.name}
            calendarCustom={calendarCustom}
            subscribers={subscribers}
            onUpdateCalendarCustom={setCalendarCustom}
            onAddSubscriber={(email) => setSubscribers(prev => [...prev, email])}
            onViewPass={setSelectedPassModal}
          />
        )}

        {navTab === 'profile' && (
          <ProfileTab
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            onLogout={() => {
              setIsAuthenticated(false);
              setNavTab('events');
            }}
          />
        )}

      </main>

      {/* VERIFIED TICKET DETAILED PREVIEW MODAL ATTACHED GLOBALLY */}
      {selectedPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/55 select-text animate-fade-in text-center">
          <div className="bg-[#0B0A16] max-w-lg w-full rounded-2xl p-6 border border-white/5 text-center space-y-6 shadow-2xl relative">
            <div className="space-y-1">
              <span className="text-[10px] tracking-widest font-mono font-bold uppercase text-emerald-400">Offline Securely Verified</span>
              <h3 className="text-base font-black text-white">{selectedPassModal.event.name} Ticket Pass</h3>
            </div>

            <div className="flex justify-center select-none">
              <PassCardPreview event={selectedPassModal.event} attendee={selectedPassModal.attendee} />
            </div>

            <div className="bg-slate-900/40 p-4 border border-white/5 rounded-2xl text-left space-y-2 text-[11px] text-slate-300">
              <p className="font-mono text-center border-b border-white/5 pb-2 uppercase tracking-wide text-indigo-300">
                Code: {selectedPassModal.attendee.passId} • Signature Match
              </p>
              <p className="leading-relaxed text-slate-400 text-center">
                Keep phone screen bright. Verifiable by gate scanner check anywhere, even inside subway tunnels or mountains without cell service.
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
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer select-none leading-none border border-transparent"
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
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer select-none leading-none border border-transparent"
              >
                Print PDF
              </button>
              <button
                type="button"
                onClick={() => setSelectedPassModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-[#1A1A2F] text-white cursor-pointer select-none leading-none"
              >
                Dismiss Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti celebration showers */}
      <ConfettiShower
        trigger={confettiTrigger}
        styleType="classic"
        brandColor={event.brandColor || '#6366F1'}
      />

    </div>
  );
}
