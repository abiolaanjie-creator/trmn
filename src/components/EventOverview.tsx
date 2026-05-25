import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Share2, 
  Mail, 
  MessageSquare, 
  Plus, 
  Copy, 
  ExternalLink, 
  Edit, 
  ChevronRight, 
  CheckCircle, 
  Users, 
  Globe, 
  Sparkles, 
  User, 
  Lock,
  ArrowRight,
  Eye,
  Settings,
  MoreHorizontal,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  QrCode,
  Palette,
  X,
  Download,
  ChevronLeft,
  Send
} from 'lucide-react';
import { EventDetails, Attendee } from '../types';
import { PassCardPreview } from './PassCardPreview';

interface EventOverviewProps {
  event: EventDetails;
  attendees: Attendee[];
  userProfile: { name: string; email: string };
  onEditEvent: () => void;
  onCheckInGuests: () => void;
  onBack: () => void;
  onRegisterPass: (evt: EventDetails, info: { name: string; email: string; type: string }) => void;
  onAddHost?: () => void;
  onUpdateEvent?: (updated: EventDetails) => void;
}

const BANNER_THEMES = [
  {
    id: 'cosmic-violet',
    name: 'Cosmic Violet',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cabernet-wine',
    name: 'Cabernet Wine',
    url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'love-romance',
    name: 'Eternal Love',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'wedding-elegance',
    name: 'Wedding Elegance',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'creative-minds',
    name: 'Creative Studio',
    url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'minimal-grid',
    name: 'Brutalist Grid',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'ai-masterclass',
    name: 'AI Masterclass',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'warm-sand',
    name: 'Sand Solstice',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'healing-bloom',
    name: 'Rose & Sage',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=150&auto=format&fit=crop&q=80'
  }
];

interface BannerSpecs {
  isDark: boolean;
  overlayClass: string;
  titleColor: string;
  dateColor: string;
  strongColor: string;
}

const getBannerSpecs = (url: string, event: EventDetails): BannerSpecs => {
  let isDark = false;
  
  if (
    url.includes('photo-1618005182384-a83a8bd57fbe') || // cosmic-violet
    url.includes('photo-1511192336575-5a79af67a629') || // cabernet-wine
    url.includes('photo-1620712943543-bcc4688e7485') || // ai-masterclass
    url.includes('photo-1517694712202-14dd9538aa97')    // tech-innovator
  ) {
    isDark = true;
  }
  
  if (event.brandBgColor) {
    const hex = event.brandBgColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      if (luminance < 0.5) isDark = true;
    }
  }

  if (['NEON', 'ROSE', 'MIDNIGHT'].includes(event.template)) {
    isDark = true;
  }

  if (isDark) {
    return {
      isDark: true,
      overlayClass: 'bg-black/50 backdrop-blur-[0.5px]',
      titleColor: 'text-white drop-shadow-md',
      dateColor: 'text-slate-200 drop-shadow-sm',
      strongColor: 'text-violet-300 font-extrabold'
    };
  } else {
    return {
      isDark: false,
      overlayClass: 'bg-white/60 backdrop-blur-[0.5px]',
      titleColor: 'text-slate-900',
      dateColor: 'text-slate-700',
      strongColor: 'text-slate-950 font-extrabold'
    };
  }
};

export const EventOverview: React.FC<EventOverviewProps> = ({
  event,
  attendees,
  userProfile,
  onEditEvent,
  onCheckInGuests,
  onBack,
  onRegisterPass,
  onAddHost,
  onUpdateEvent
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  
  // Custom Flow Modals (Invite Guests, Send Blast, Share Event)
  const [showInviteGuestsModal, setShowInviteGuestsModal] = useState(false);
  const [showSendBlastModal, setShowSendBlastModal] = useState(false);
  const [showShareEventModal, setShowShareEventModal] = useState(false);

  // States inside Invite Guests Modal
  const [inviteStep, setInviteStep] = useState<1 | 2>(1);
  const [pendingEmailInput, setPendingEmailInput] = useState('');
  const [invitedGuestsList, setInvitedGuestsList] = useState<{ email: string; name: string }[]>([
    { email: 'william.garcia@example.com', name: 'William Garcia' },
    { email: 'brian.wilson@example.com', name: 'Brian Wilson' },
    { email: 'ashley.thomas@example.com', name: 'Ashley Thomas' },
    { email: 'kevin.anderson@example.com', name: 'Kevin Anderson' },
    { email: 'rachel.thomas@example.com', name: 'Rachel Thomas' },
    { email: 'jason.jackson@example.com', name: 'Jason Jackson' },
    { email: 'stephanie.white@example.com', name: 'Stephanie White' }
  ]);
  const [customMessage, setCustomMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // States inside Send Blast Modal
  const [blastRecipient, setBlastRecipient] = useState('Going');
  const [blastSubject, setBlastSubject] = useState('');
  const [blastMessage, setBlastMessage] = useState('');
  const [blastPreviewMode, setBlastPreviewMode] = useState(false);
  const [blastFeedbackMessage, setBlastFeedbackMessage] = useState('');

  // Share Event Modal states
  const [shareCopied, setShareCopied] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'guests'>('overview');
  const [showQuickInviteModal, setShowQuickInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteType, setInviteType] = useState('GENERAL');

  // Interactive Live Countdown to the event
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      if (!event.dateTime) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      const targetTime = +new Date(event.dateTime);
      if (isNaN(targetTime)) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      const difference = targetTime - +new Date();
      let timeLeftObj = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeftObj = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        timeLeftObj = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return timeLeftObj;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [event.dateTime]);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, SVG, WebP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target?.result as string;
        if (onUpdateEvent) {
          onUpdateEvent({ ...event, bannerUrl: b64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getEventBannerUrl = (evt: EventDetails): string => {
    if (evt.bannerUrl && evt.bannerUrl.trim().length > 0) {
      return evt.bannerUrl;
    }
    const nameLower = evt.name.toLowerCase();
    if (nameLower.includes('jazz') || nameLower.includes('cabernet')) {
      return 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=350&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('blast') || nameLower.includes('joni')) {
      return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=350&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('getters') || nameLower.includes('invite')) {
      return 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=350&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('ai') || nameLower.includes('agent') || nameLower.includes('masterclass')) {
      return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=350&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('solstice') || nameLower.includes('sunset')) {
      return 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=350&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=350&auto=format&fit=crop&q=80';
  };

  // Generate public event link
  const publicUrl = `${window.location.protocol}//${window.location.host}?publicEventId=${event.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Stats calculation
  const totalInvited = attendees.length;
  const checkedInCount = attendees.filter(a => a.status === 'checked-in').length;
  const goingCount = totalInvited; // For a simple RSVP flow, all listed attendees accepted
  
  // Format Date beautifully
  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        return {
          weekday: 'Saturday',
          month: 'MAY',
          monthFull: 'May',
          day: 30,
          year: 2026,
          time: '7:00 PM GMT+1',
          fullString: dateStr
        };
      }
      
      const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
      const month = d.toLocaleDateString('en-US', { month: 'long' });
      const day = d.getDate();
      const year = d.getFullYear();
      
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      
      // Basic timezone guess
      const offset = -d.getTimezoneOffset();
      const tzChar = offset >= 0 ? '+' : '-';
      const tzHrs = Math.floor(Math.abs(offset) / 60);
      const tzString = `GMT${tzChar}${tzHrs}`;

      return {
        weekday,
        month: month.substring(0, 3).toUpperCase(),
        monthFull: month,
        day,
        year,
        time: `${hours}:${minutes} ${ampm} ${tzString}`,
        fullString: `${weekday}, ${month} ${day} · ${hours}:${minutes} ${ampm} ${tzString}`
      };
    } catch (e) {
      return {
        weekday: 'Saturday',
        month: 'MAY',
        monthFull: 'May',
        day: 30,
        year: 2026,
        time: '7:00 PM GMT+1',
        fullString: dateStr
      };
    }
  };

  const dateDetails = formatEventDate(event.dateTime);
  const bannerUrl = getEventBannerUrl(event);
  const bannerSpecs = getBannerSpecs(bannerUrl, event);

  const handleQuickInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    onRegisterPass(event, {
      name: inviteName,
      email: inviteEmail,
      type: inviteType
    });
    setInviteName('');
    setInviteEmail('');
    setInviteType('GENERAL');
    setShowQuickInviteModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 text-left select-text relative">
      
      {/* QUICK INVITE OVERLAY MODAL */}
      {showQuickInviteModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowQuickInviteModal(false); }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#110F30] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up"
          >
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-500" />
              Invite Guest Directly
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 font-medium">
              Create an instant secure pass ticket for a custom attendee instantly.
            </p>

            <form onSubmit={handleQuickInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yemi Adebayo"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-800 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yemi@soma.tech"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-800 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Pass Credentials Type
                </label>
                <select
                  value={inviteType}
                  onChange={(e) => setInviteType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-800 dark:text-white font-semibold"
                >
                  <option value="GENERAL">General Admission</option>
                  <option value="VIP">VIP All-Access</option>
                  <option value="SPEAKER">Guest Speaker</option>
                  <option value="STAFF">Staff Operator</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowQuickInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs font-bold leading-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-755 text-white text-xs font-bold leading-none cursor-pointer flex items-center gap-1 shadow-md shadow-violet-500/10"
                >
                  Confirm Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL-BLEED PREMIUM HERO BANNER DESIGNED EDITORIALLY */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 mb-20 relative overflow-visible py-20 md:py-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center select-none">
        
        {/* Full bleed backdrop wrapper that handles overflow and dynamic banner image */}
        <div className="absolute inset-0 overflow-hidden border-b border-slate-200/20 dark:border-indigo-950/10">
          <img 
            src={getEventBannerUrl(event)} 
            alt="Event banner backdrop" 
            className="w-full h-full object-cover filter brightness-[0.93] dark:brightness-[0.38] saturate-[1.05]" 
          />
          {/* Iridescent Organic Blur Wave Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply dark:mix-blend-screen overflow-hidden">
            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[80%] rounded-full bg-blue-300/30 dark:bg-indigo-950/10 blur-[130px]" />
            <div className="absolute top-[20%] right-[-10%] w-[50%] h-[70%] rounded-full bg-purple-300/30 dark:bg-purple-900/10 blur-[140px]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[70%] rounded-full bg-pink-300/30 dark:bg-rose-950/10 blur-[130px]" />
          </div>
          {/* Subtle dynamic overlay that adjusts to contrast standards */}
          <div className={`absolute inset-0 ${bannerSpecs.overlayClass}`} />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-5 px-4">
          <h1 className={`font-display text-4xl sm:text-5xl md:text-6xl font-black ${bannerSpecs.titleColor} leading-tight tracking-tight mt-2 select-text max-w-3xl mx-auto`}>
            {event.name || 'Event title'}
          </h1>

          <p className={`text-sm md:text-base ${bannerSpecs.dateColor} max-w-2xl mx-auto font-medium select-none leading-relaxed`}>
            {event.shortDescription || "Add a brief description for your event for your attendees to see"}
          </p>
        </div>

        {/* Floating Countdown Deck Overlaying the exact lower lip with sublte glassmorphism effect */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20 px-4">
          <div className="bg-white/75 dark:bg-[#16152B]/75 backdrop-blur-md border border-slate-200/40 dark:border-white/10 rounded-2xl p-4 md:p-6 max-w-2xl mx-auto flex justify-between items-center select-none shadow-lg">
            
            {/* Days Slot */}
            <div className="flex-1 text-center py-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#7C3AED] dark:text-[#A78BFA] font-sans leading-none tracking-tight">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mt-2.5">
                Days
              </span>
            </div>

            <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 shrink-0" />

            {/* Hours Slot */}
            <div className="flex-1 text-center py-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#7C3AED] dark:text-[#A78BFA] font-sans leading-none tracking-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mt-2.5">
                Hours
              </span>
            </div>

            <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 shrink-0" />

            {/* Minutes Slot */}
            <div className="flex-1 text-center py-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#7C3AED] dark:text-[#A78BFA] font-sans leading-none tracking-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mt-2.5">
                Minutes
              </span>
            </div>

            <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 shrink-0" />

            {/* Seconds Slot */}
            <div className="flex-1 text-center py-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#7C3AED] dark:text-[#A78BFA] font-sans leading-none tracking-tight">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mt-2.5">
                Seconds
              </span>
            </div>

          </div>
        </div>

      </div>
      {/* REFINED SLEEK INTERACTIVE ACTIONS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 select-none font-sans">
        <button 
          onClick={() => {
            setInviteStep(1);
            setShowInviteGuestsModal(true);
          }}
          className="flex items-center gap-3.5 p-3.5 bg-white dark:bg-[#16152B] border border-slate-200/50 dark:border-indigo-950/20 rounded-2xl shadow-none hover:bg-slate-50 dark:hover:bg-slate-800/55 hover:translate-y-[-1px] active:scale-[0.99] transition-all cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-none">Invite Guests</h4>
          </div>
        </button>

        <button 
          onClick={() => {
            setBlastFeedbackMessage('');
            setShowSendBlastModal(true);
          }}
          className="flex items-center gap-3.5 p-3.5 bg-white dark:bg-[#16152B] border border-slate-200/50 dark:border-indigo-950/20 rounded-2xl shadow-none hover:bg-slate-50 dark:hover:bg-slate-800/55 hover:translate-y-[-1px] active:scale-[0.99] transition-all cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-none">Send a Blast</h4>
          </div>
        </button>

        <button 
          onClick={() => setShowShareEventModal(true)}
          className="flex items-center gap-3.5 p-3.5 bg-white dark:bg-[#16152B] border border-slate-200/50 dark:border-indigo-950/20 rounded-2xl shadow-none hover:bg-slate-50 dark:hover:bg-slate-800/55 hover:translate-y-[-1px] active:scale-[0.99] transition-all cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-650 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-none">
              Share Event
            </h4>
          </div>
        </button>
      </div>

      {/* MAIN UNIFIED WIDGET CONTAINER CARD */}
      <div className="bg-white dark:bg-[#110F2B]/60 border border-slate-200/50 dark:border-indigo-950/20 rounded-3xl p-5 md:p-6 shadow-sm mb-6">
        
        {/* Hidden File Input for programmatically changing photo */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Compact, Left-Aligned details precisely and spacing beautifully */}
        <div className="text-left space-y-4 w-full">
          
          <div className="font-sans">
            <h3 className="text-lg font-black text-slate-800 dark:text-white leading-none mb-1">
              When &amp; Where
            </h3>
          </div>

          {/* DATE AND TIME TRAY BLOCK */}
          <div className="flex gap-4 items-center pb-3 border-b border-slate-100 dark:border-white/5">
            {/* Mini Calendar graphic block */}
            <div className="w-10 h-11 overflow-hidden rounded-lg border border-slate-150 dark:border-indigo-950 bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0 select-none pb-0.5">
              <div className="bg-rose-500 dark:bg-rose-600 text-white text-[8px] font-bold text-center leading-tight py-0.5 uppercase tracking-wide">
                {dateDetails.month || 'MAY'}
              </div>
              <div className="text-slate-800 dark:text-white text-xs font-black text-center leading-none">
                {dateDetails.day || '30'}
              </div>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {dateDetails.weekday}, {dateDetails.monthFull} {dateDetails.day}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                {dateDetails.time || '11:30 PM - 12:30 AM GMT+1'}
              </p>
            </div>
          </div>

          {/* LOCATION / ADDRESS TRIGGER */}
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/10 flex items-center justify-center shrink-0 text-slate-400">
              <MapPin className="w-4.5 h-4.5 text-indigo-500" />
            </div>

            <div className="space-y-0.5 flex-grow">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug flex items-center gap-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">
                {event.venue || 'No location set'}
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </h4>
              <p className="text-xs text-slate-405 dark:text-slate-450">
                {event.venue ? `${event.venue}, Univ of Ibadan, Ibadan` : 'Provide a physical or virtual location.'}
              </p>
            </div>
          </div>

          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 italic select-none leading-relaxed">
            The address is shown publicly on the event page.
          </p>

          {/* COMPACT CHECK IN BUTTON ALIGNED LEFT */}
          <div className="pt-1.5 select-none">
            <button
              onClick={onCheckInGuests}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs cursor-pointer select-none transition-all border border-slate-200/40 dark:border-slate-800/30 hover:scale-[1.002] active:scale-[0.99]"
            >
              <QrCode className="w-3.5 h-3.5 text-violet-500 mr-1.5 inline-block align-middle" />
              <span className="align-middle">Check In Guests</span>
            </button>
          </div>
        </div>

        {/* BOTTOM ACTION BAR AND TRI-CONTROLS FOR EDIT/THEME/PHOTO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 mt-5 border-t border-slate-100 dark:border-white/5 gap-4">
          
          {/* Bottom Left: Share Event & horizontal social buttons matching mockup */}
          <div className="flex items-center gap-3.5 text-slate-400 select-none">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Share Event
            </span>
            <div className="flex items-center space-x-2.5">
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`, '_blank')}
                className="p-1.5 rounded-full hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-indigo-900/40 cursor-pointer transition-colors border border-slate-200/50 dark:border-slate-800"
              >
                <Facebook className="w-3.5 h-3.5 fill-current stroke-0" />
              </button>
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(`Check out ${event.name}!`)}`, '_blank')}
                className="p-1.5 rounded-full hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-[#1E1B4B]/40 cursor-pointer transition-colors border border-slate-200/50 dark:border-slate-800"
              >
                <Twitter className="w-3.5 h-3.5 fill-current stroke-0" />
              </button>
              <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`, '_blank')}
                className="p-1.5 rounded-full hover:text-blue-700 hover:bg-slate-100 dark:hover:bg-[#1E1B4B]/40 cursor-pointer transition-colors border border-slate-200/50 dark:border-slate-800"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current stroke-0" />
              </button>
              <button 
                onClick={() => window.open(`mailto:?subject=${encodeURIComponent(event.name)}&body=${encodeURIComponent(`Hey, check out this event: ${publicUrl}`)}`)}
                className="p-1.5 rounded-full hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-[#1E1B4B]/40 cursor-pointer transition-colors border border-slate-200/50 dark:border-slate-800"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Right: Manage Controls */}
          <div className="flex items-center gap-2.5 select-none">
            <button
              onClick={onEditEvent}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-700 dark:text-slate-300 text-xs font-bold whitespace-nowrap cursor-pointer transition-all shadow-sm"
            >
              <Edit className="w-3 h-3 text-slate-400" />
              Edit
            </button>

            <button
              onClick={() => setShowThemeModal(true)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-700 dark:text-slate-300 text-xs font-bold whitespace-nowrap cursor-pointer transition-all shadow-sm"
            >
              <Palette className="w-3 h-3 text-violet-500" />
              Banner Theme
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-700 dark:text-slate-305 text-xs font-bold whitespace-nowrap cursor-pointer transition-all shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-violet-500" />
              Change Photo
            </button>
          </div>

        </div>

      </div>

      {/* OPERATIONAL MANAGEMENT BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: GUEST DIRECTORIES, LIST COMPOSITIONS, COMPANIONS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* INVITES STAT PANEL */}
          <div className="space-y-4">
            <div className="flex items-center justify-between select-none">
              <div className="text-left font-sans">
                <h3 className="text-base font-black text-slate-800 dark:text-white leading-snug">
                  Invites
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-505 mt-0.5">
                  Invite subscribers, contacts and past guests via email or SMS.
                </p>
              </div>

              <button
                onClick={() => {
                  setInviteStep(1);
                  setShowInviteGuestsModal(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-black text-slate-700 hover:text-black dark:text-slate-300 dark:hover:text-white flex items-center gap-1 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm transition-all text-sm leading-none"
              >
                <Plus className="w-4.5 h-4.5" />
                Invite Guests
              </button>
            </div>

            {/* DUAL INFO TILES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Metric Card */}
              <div className="md:col-span-4 p-5 rounded-3xl bg-white dark:bg-[#110F2B]/60 border border-slate-200/50 dark:border-indigo-950/20 text-left flex flex-col justify-between shadow-sm min-h-[140px] relative">
                <div>
                  <h4 className="text-[34px] leading-none font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                    {goingCount} <span className="text-xs font-medium text-slate-400 font-mono">/ {goingCount || 1}</span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 block select-none">
                    Invite Accepted
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3.5 mt-2 text-xs text-slate-405 font-semibold font-mono select-none">
                  <span>0 Declined</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer text-indigo-505" />
                </div>
              </div>

              {/* RECENTLY ACCEPTED BOARD LIST */}
              <div className="md:col-span-8 p-5 rounded-3xl bg-white dark:bg-[#110F2B]/60 border border-slate-200/50 dark:border-indigo-950/20 text-left shadow-sm flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] block mb-3.5 select-none leading-none">
                    Recently Accepted
                  </span>

                  {attendees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4 select-none">
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-indigo-950/20 flex items-center justify-center text-slate-400 mb-2">
                        <Mail className="w-4 h-4 opacity-50" />
                      </div>
                      <h5 className="text-[11px] font-bold text-slate-400">No Invites Accepted... Yet.</h5>
                      <p className="text-[10px] text-slate-400/80 mt-0.5 text-center leading-snug">
                        Once people accept your invites, you will find them here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
                      {attendees.slice(0, 3).map((att) => {
                        const guestInitial = att.name.substring(0, 2).toUpperCase() || 'GT';
                        const isCheckedIn = att.status === 'checked-in';
                        return (
                          <div key={att.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/55 dark:bg-slate-900/35 border border-slate-200/20 dark:border-white/5 hover:translate-x-[1px] transition-transform">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-50/70 dark:bg-indigo-950/40 text-[10.5px] font-black text-indigo-650 dark:text-indigo-400 flex items-center justify-center select-none shadow-inner border border-indigo-100/30">
                                {guestInitial}
                              </div>
                              <div className="leading-none text-left">
                                <h5 className="text-xs font-extrabold text-slate-800 dark:text-white leading-none">
                                  {att.name}
                                </h5>
                                <span className="text-[9.5px] text-slate-400 mt-1 block truncate max-w-[150px] font-mono select-all">
                                  {att.email}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 select-none">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold leading-normal uppercase shadow-sm border ${
                                att.type === 'VIP' 
                                  ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/20' 
                                  : att.type === 'SPEAKER'
                                  ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100/50'
                                  : att.type === 'STAFF'
                                  ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100/50'
                                  : 'bg-indigo-50/50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-100/20 dark:border-slate-800'
                              }`}>
                                {att.type}
                              </span>

                              {isCheckedIn ? (
                                <span className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" title="Pass registered and verified at gates">
                                  <CheckCircle className="w-3.5 h-3.5 fill-current text-emerald-500 stroke-2 bg-white rounded-full" />
                                </span>
                              ) : (
                                <span className="p-0.5 rounded-full bg-indigo-500/10 text-indigo-500/60" title="Invited · Pending validation">
                                  <Lock className="w-3.5 h-3.5 stroke-2" />
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* GUESTS STATISTICS PANEL SECTION */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-800 dark:text-white pb-1">
              Guests
            </h3>
            
            <div className="bg-white dark:bg-[#110F2B]/60 border border-slate-200/50 dark:border-indigo-950/20 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs select-none">
                <span className="font-extrabold text-slate-800 dark:text-white">{goingCount} Going</span>
                <span className="font-bold text-slate-400 font-mono">{checkedInCount} Checked In</span>
              </div>

              {/* Progress visual line */}
              <div className="relative h-2 w-full rounded-full bg-slate-100 dark:bg-indigo-950/30 overflow-hidden select-none border border-slate-200/10">
                <div 
                  className="absolute left-0 top-0 h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500 rounded-full"
                  style={{ width: `${goingCount > 0 ? (checkedInCount / goingCount) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center gap-1.5 select-none font-sans leading-none text-left">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span className="text-[10.5px] font-bold text-slate-400">
                  {goingCount} Invited total via offline portfolio registration link
                </span>
              </div>
            </div>
          </div>

          {/* HOSTS SECTION */}
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between select-none">
              <h3 className="text-base font-black text-slate-800 dark:text-white">
                Hosts
              </h3>
              <button 
                onClick={onAddHost || (() => alert('Host invitation flow. Email your co-host to authenticate.'))}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-[11px] font-black text-slate-700 hover:text-black dark:text-slate-300 dark:hover:text-white flex items-center gap-1 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Host
              </button>
            </div>

            <div className="bg-white dark:bg-[#110F2B]/60 border border-slate-200/50 dark:border-indigo-950/20 rounded-3xl p-4 shadow-sm text-left">
              <div className="flex items-center justify-between gap-4 p-1">
                <div className="flex items-center gap-3">
                  {/* Dynamic user initials */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-500/10 select-none">
                    {userProfile.name ? userProfile.name.substring(0, 2).toUpperCase() : 'OA'}
                  </div>

                  <div className="text-left leading-tight space-y-0.5">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                      {userProfile.name || 'Olawuyi Abiola'}
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8.5px] font-extrabold font-mono uppercase border border-emerald-500/10 select-none">
                        Creator
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono select-all">
                      {userProfile.email || 'abiolaanjie@gmail.com'}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={onEditEvent}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer select-none"
                  title="Modify host credential variables"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-white/5 pt-3.5 mt-3 text-xs text-slate-400 flex items-center gap-1.5 select-none">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Manage checking staff credentials from this pane. Contact staff for API keys.</span>
              </div>
            </div>
          </div>

          {/* VISIBILITY & DISCOVERY */}
          <div className="space-y-3 font-sans">
            <h3 className="text-base font-black text-slate-800 dark:text-white select-none">
              Visibility &amp; Discovery
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 -mt-1 select-none">
              Control how people can find your event.
            </p>

            <div className="bg-white dark:bg-[#110F2B]/60 border border-slate-200/50 dark:border-indigo-950/20 rounded-3xl p-5 shadow-sm text-left space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-indigo-950/20 flex items-center justify-center shrink-0 text-slate-400">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                </div>

                <div className="space-y-0.5 leading-tight text-left flex-grow">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block select-none leading-none mb-1">
                    Managing Calendar
                  </span>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white">
                    Your Personal Calendar
                  </h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 pt-1.5 select-none font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Public — This event is listed on your profile page.
                  </p>
                </div>
              </div>

              {/* DUAL TOGGLE CONTROL ROW BUTTONS */}
              <div className="flex items-center gap-3 pt-2 select-none">
                <button 
                  onClick={() => alert('Visibility dialog: Toggle listed status of your personal, studio and organizational profile grids.')}
                  className="flex-grow py-2 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-4.5 h-4.5 text-slate-400" />
                  Change Visibility
                </button>

                <button 
                  onClick={() => alert('Transfer calendar context: Migrate registration lists and analytics targets to connected hubs.')}
                  className="flex-grow py-2 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Share2 className="w-4.5 h-4.5 text-slate-400" />
                  Transfer Calendar
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: BRANDED PASS SPECIMEN & SYSTEM VERIFICATION PREVIEW */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-[#110F2B]/60 border border-slate-200/50 dark:border-indigo-950/20 rounded-[24px] p-6 shadow-sm space-y-4">
            
            <div className="border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="text-sm font-extrabold text-[#110F2B] dark:text-white uppercase tracking-wider leading-none">
                Ticket Pass
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                Verified high-resolution ticket layout generated with custom cryptographic HMAC key signatures.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-2 shrink-0 overflow-hidden">
              <PassCardPreview 
                event={event} 
                attendee={attendees[0] || {
                  id: 'preview-sample',
                  name: userProfile.name || 'Yemi Adebayo',
                  type: 'GENERAL',
                  email: userProfile.email || 'guest@soma.tech',
                  status: 'registered',
                  passId: `PASS-${event.id.toUpperCase().substring(4)}-01`,
                  hmacSignature: 'sample_sig'
                }} 
              />
            </div>

          </div>

        </div>
      </div>

      {showThemeModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowThemeModal(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in select-none"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#16152B] rounded-3xl p-6 max-w-lg w-full shadow-2xl relative text-left"
          >
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
              Select Banner Theme
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Select an ambient artistic backdrop preset, or clear to use the dynamic default theme or your custom photo.
            </p>

            <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {/* Reset to dynamic default option */}
              <button
                onClick={() => {
                  if (onUpdateEvent) {
                    onUpdateEvent({ ...event, bannerUrl: '' });
                  }
                  setShowThemeModal(false);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  !event.bannerUrl
                    ? 'border-violet-500 bg-violet-50/10 dark:bg-violet-950/20'
                    : 'border-slate-100 dark:border-white/5 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900/40'
                }`}
              >
                <div className="w-full h-16 rounded-lg bg-gradient-to-tr from-slate-200 to-indigo-150 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center shrink-0 mb-2 border border-slate-200/20">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Dynamic Gradient</span>
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-white">Default Ambient</span>
              </button>

              {BANNER_THEMES.map((theme) => {
                const isSelected = event.bannerUrl === theme.url;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      if (onUpdateEvent) {
                        onUpdateEvent({ ...event, bannerUrl: theme.url });
                      }
                      setShowThemeModal(false);
                    }}
                    className={`flex flex-col p-2.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50/10 dark:bg-violet-950/20'
                        : 'border-slate-100 dark:border-white/5 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="w-full h-16 rounded-lg overflow-hidden shrink-0 mb-2 relative border border-slate-200/20">
                      <img src={theme.thumbnail} alt={theme.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-150 block truncate">{theme.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-white/5 mt-6">
              <button
                onClick={() => setShowThemeModal(false)}
                className="px-4.5 py-2 rounded-xl bg-slate-150 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: Invite Guests Modal --- */}
      {showInviteGuestsModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowInviteGuestsModal(false); }}
          className="fixed inset-0 bg-slate-150/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in font-sans"
        >
          <div className="bg-white dark:bg-[#110F30] rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-[550px]" onClick={(e) => e.stopPropagation()}>
            
            {/* Left rail/sidebar layout matching Suggestions & Enter Emails */}
            <div className="w-full md:w-[240px] bg-slate-50/55 dark:bg-slate-950/30 border-b md:border-b-0 md:border-r border-slate-150 dark:border-white/5 p-4 flex flex-col justify-between shrink-0">
              <div className="space-y-4">
                <div className="px-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Invite Channels</span>
                </div>
                
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black text-violet-650 dark:text-violet-400 bg-violet-50/60 dark:bg-violet-950/15 text-left transition-colors border border-violet-100/30 dark:border-violet-900/10">
                    <span className="text-xs font-bold">@</span>
                    Enter Emails
                  </button>
                </div>
              </div>

              {/* Bottom sidebar info indicator */}
              <div className="bg-slate-100/50 dark:bg-slate-900/60 flex items-center justify-between p-2.5 rounded-xl border border-slate-150 dark:border-white/5 text-[10px] text-slate-400">
                <span>Total Invited:</span>
                <span className="font-mono font-bold dark:text-white">{invitedGuestsList.length}</span>
              </div>
            </div>

            {/* Right main area columns changing dynamically by tab/step */}
            <div className="flex-grow flex flex-col justify-between p-6">
              
              {/* Top Header of right area */}
              <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 dark:border-white/5 shrink-0">
                <h3 className="text-base font-black text-slate-800 dark:text-white">Invite Guests</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowInviteGuestsModal(false)}
                    className="p-1.5 rounded-full border border-slate-150 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-705 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Success Toast / Notification Inside Modal */}
              {successToast && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold leading-tight select-none flex items-center gap-2 animate-pulse mt-2 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                  <span>{successToast}</span>
                </div>
              )}

              {/* Main Content Area */}
              <div className="flex-grow overflow-y-auto py-4 select-text">
                {inviteStep === 1 ? (
                  // STEP 1 UI: ENTER EMAILS AND CSV IMPORT
                  <div className="space-y-5 text-left">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Add Emails</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Paste or enter emails here (e.g. guest@soma.tech)"
                          value={pendingEmailInput}
                          onChange={(e) => setPendingEmailInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (pendingEmailInput.trim() && pendingEmailInput.includes('@')) {
                                const email = pendingEmailInput.trim();
                                const username = email.split('@')[0];
                                const name = username.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                setInvitedGuestsList(prev => [...prev, { email, name }]);
                                setPendingEmailInput('');
                                setSuccessToast(`Added ${email} to invite list.`);
                                setTimeout(() => setSuccessToast(''), 3000);
                              }
                            }
                          }}
                          className="flex-grow px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-905 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/10 text-slate-800 dark:text-white"
                        />
                        <button
                          onClick={() => {
                            if (pendingEmailInput.trim() && pendingEmailInput.includes('@')) {
                              const email = pendingEmailInput.trim();
                              const username = email.split('@')[0];
                              const name = username.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                              setInvitedGuestsList(prev => [...prev, { email, name }]);
                              setPendingEmailInput('');
                              setSuccessToast(`Added ${email} to invite list.`);
                              setTimeout(() => setSuccessToast(''), 3000);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-violet-650 hover:bg-violet-700 text-white text-xs font-bold cursor-pointer transition-all shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Import CSV</label>
                      
                      {/* Interactive Drag & Drop Area */}
                      <div 
                        onClick={() => {
                          const fileInput = document.getElementById('modal-csv-uploader') as HTMLInputElement;
                          fileInput?.click();
                        }}
                        className="border-2 border-dashed border-slate-200 dark:border-indigo-950/40 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 p-10 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex flex-col items-center justify-center space-y-2 group"
                      >
                        <input 
                          type="file" 
                          id="modal-csv-uploader" 
                          accept=".csv" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const text = ev.target?.result as string;
                                const lines = text.split('\n');
                                const parsed = [];
                                for (let i = 1; i < lines.length; i++) {
                                  const row = lines[i].trim();
                                  if (row) {
                                    const cols = row.split(',');
                                    if (cols[0] && cols[0].includes('@')) {
                                      parsed.push({
                                        email: cols[0].trim(),
                                        name: cols[1] ? cols[1].trim() : cols[0].split('@')[0].replace(/[._-]/g, ' ')
                                      });
                                    }
                                  }
                                }
                                if (parsed.length > 0) {
                                  setInvitedGuestsList(parsed);
                                  setSuccessToast(`Successfully imported ${parsed.length} guests from CSV!`);
                                  setTimeout(() => setSuccessToast(''), 5000);
                                } else {
                                  setSuccessToast(`No emails found inside CSV rows. Populated template list instead.`);
                                  setTimeout(() => setSuccessToast(''), 4000);
                                }
                              };
                              reader.readAsText(file);
                            }
                          }}
                        />
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-905 border border-slate-150 dark:border-indigo-950 flex items-center justify-center text-slate-400 group-hover:scale-[1.03] transition-transform">
                          <span className="text-[10px] font-black">CSV</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">Import CSV File</h4>
                        <p className="text-[10px] text-slate-400">Drop file or click here to choose file from system folder.</p>
                      </div>

                      <button 
                        onClick={() => {
                          const content = "email,name,type\nwilliam.garcia@example.com,William Garcia,GENERAL\nbrian.wilson@example.com,Brian Wilson,VIP\nashley.thomas@example.com,Ashley Thomas,VIP\nkevin.anderson@example.com,Kevin Anderson,GENERAL\nrachel.thomas@example.com,Rachel Thomas,GENERAL\njason.jackson@example.com,Jason Jackson,GENERAL\nstephanie.white@example.com,Stephanie White,VIP\n";
                          const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.setAttribute("href", url);
                          link.setAttribute("download", "guest_invite_template.csv");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          setSuccessToast("Guest CSV Template downloaded. Load it back with emails updated!");
                          setTimeout(() => setSuccessToast(''), 4000);
                        }}
                        className="inline-flex items-center gap-1.5 text-[10.5px] font-black text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-violet-400 transition-colors cursor-pointer mt-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download CSV Template
                      </button>
                    </div>

                  </div>
                ) : (
                  // STEP 2 UI: RETRIEVING INVITE MESSAGE AND PREVIEW WITH COLUMNS
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-full items-stretch text-left">
                    {/* Left Column of step 2: scrollable people list */}
                    <div className="md:col-span-5 border-r border-slate-100 dark:border-white/5 pr-4 flex flex-col justify-start">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Inviting {invitedGuestsList.length} People</span>
                      <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                        {invitedGuestsList.map((itm, idx) => {
                          const initials = itm.name ? itm.name.substring(0, 2).toUpperCase() : 'GT';
                          return (
                            <div key={idx} className="flex items-center gap-2.5 p-1.5 rounded-lg bg-slate-50/60 dark:bg-slate-900/20 border border-slate-150/20 dark:border-white/5">
                              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-555 dark:text-slate-300 flex items-center justify-center select-none shrink-0">
                                {initials}
                              </div>
                              <div className="leading-tight overflow-hidden text-ellipsis flex-grow font-sans">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{itm.name}</h4>
                                <span className="text-[10px] text-slate-400 truncate block font-mono leading-none">{itm.email}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column of step 2: text compose */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="p-4 rounded-xl border border-slate-150 dark:border-indigo-950 bg-slate-50/50 dark:bg-indigo-950/10 space-y-3 font-sans">
                        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 shadow-sm leading-relaxed">
                          Hi, <strong>{userProfile.name}</strong> invites you to join <strong>{event.name || 'Event title'}</strong>.
                        </div>
                        <textarea
                          placeholder="Add a custom message here..."
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className="w-full h-20 p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/10 text-slate-800 dark:text-white resize-none"
                        />
                        <div className="p-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl text-[11px] text-indigo-505 dark:text-indigo-400 font-mono truncate select-all">
                          RSVP: {publicUrl}
                        </div>
                      </div>

                      {/* Info indicator box with plus icon */}
                      <div className="p-3.5 rounded-xl border border-slate-150 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-400 shrink-0 font-black">
                          +
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-snug font-sans">We will send them an invite link to register for the event.</p>
                      </div>

                      <div className="text-[10.5px] text-slate-400 leading-snug pt-1 font-sans">
                        You can bypass registration and payment by adding guests directly to the guest list.{' '}
                        <button
                          onClick={() => {
                            invitedGuestsList.forEach(guest => {
                              onRegisterPass(event, {
                                name: guest.name,
                                email: guest.email,
                                type: 'GENERAL'
                              });
                            });
                            setShowInviteGuestsModal(false);
                            alert(`Registered all ${invitedGuestsList.length} guests directly to the guest list successfully!`);
                          }}
                          className="text-pink-500 hover:text-pink-600 font-extrabold select-none cursor-pointer underline hover:no-underline font-sans"
                        >
                          Add Guests Directly
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom control row */}
              <div className="pt-4 border-t border-slate-150 dark:border-white/5 flex justify-between items-center shrink-0">
                {inviteStep === 2 ? (
                  <button
                    onClick={() => setInviteStep(1)}
                    className="px-4.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 bg-slate-55 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-black cursor-pointer transition-all flex items-center gap-1 select-none font-sans"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {inviteStep === 1 ? (
                  <button
                    onClick={() => {
                      if (invitedGuestsList.length === 0) {
                        alert("Add or upload at least one email recipient to proceed!");
                        return;
                      }
                      setInviteStep(2);
                    }}
                    className="px-5 py-2 rounded-xl bg-violet-650 hover:bg-violet-700 text-white text-xs font-black cursor-pointer transition-all shadow-md flex items-center gap-1 select-none font-sans"
                  >
                    Next &gt;
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      invitedGuestsList.forEach(guest => {
                        onRegisterPass(event, {
                          name: guest.name,
                          email: guest.email,
                          type: 'GENERAL'
                        });
                      });
                      setShowInviteGuestsModal(false);
                      alert(`Sent digital invitations to all ${invitedGuestsList.length} recipients!`);
                    }}
                    className="px-5 py-2 rounded-xl bg-violet-650 hover:bg-violet-700 text-white text-xs font-black cursor-pointer transition-all shadow-md shadow-violet-500/10 flex items-center gap-1.5 select-none font-sans"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Invites
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 2: Send Blast Modal --- */}
      {showSendBlastModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowSendBlastModal(false); }}
          className="fixed inset-0 bg-slate-150/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in font-sans"
        >
          <div className="bg-white dark:bg-[#110F30] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative text-left space-y-5 animate-scale-up" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center pb-2">
              <div>
                <h3 className="text-base font-black text-slate-905 dark:text-white">Send Blast</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Guests will receive the blast via email, SMS or in-app notification. It will also be shown on the event page.
                </p>
              </div>
              <button 
                onClick={() => setShowSendBlastModal(false)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {blastFeedbackMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold select-none leading-snug animate-pulse flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{blastFeedbackMessage}</span>
              </div>
            )}

            <div className="space-y-1.5 font-sans">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Recipients</label>
              
              <select
                value={blastRecipient}
                onChange={(e) => setBlastRecipient(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white font-extrabold focus:ring-2 focus:ring-violet-500/10 cursor-pointer outline-none"
              >
                <option value="All">All ({attendees.length + invitedGuestsList.length})</option>
                <option value="Going">Going ({attendees.length})</option>
                <option value="Invited">Invited ({invitedGuestsList.length})</option>
              </select>
            </div>

            <div className="space-y-1.5 font-sans">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Subject (Optional)</label>
              <input 
                type="text"
                placeholder={`New message in ${event.name || "iub"}`}
                value={blastSubject}
                onChange={(e) => setBlastSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/10 text-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-1.5 font-sans">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Message</label>
              <textarea 
                placeholder="Share a message with your guests..."
                value={blastMessage}
                onChange={(e) => setBlastMessage(e.target.value)}
                className="w-full h-32 p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/10 text-slate-800 dark:text-white resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-150 dark:border-white/5 flex justify-between items-center select-none font-sans">
              <div className="flex items-center gap-2 font-sans">
                <button
                  onClick={() => {
                    if (!blastMessage.trim()) {
                      alert("Add message body description before broadcasting!");
                      return;
                    }
                    setBlastFeedbackMessage(`Successfully broadcasted and delivered mail/SMS text to all going subscriber attendees!`);
                    setTimeout(() => setShowSendBlastModal(false), 3000);
                  }}
                  className="px-4.5 py-2 rounded-xl bg-violet-650 hover:bg-violet-700 text-white text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 select-none font-sans"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
                <button
                  onClick={() => {
                    setBlastFeedbackMessage(`Scheduled blast delivery queued in organizers dashboard successfully.`);
                    setTimeout(() => setShowSendBlastModal(false), 2000);
                  }}
                  className="px-4.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-705 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer transition-all select-none font-sans"
                >
                  Schedule
                </button>
              </div>

              <button
                onClick={() => setBlastPreviewMode(!blastPreviewMode)}
                className="text-slate-400 hover:text-indigo-650 dark:hover:text-violet-400 text-xs font-black transition-colors cursor-pointer select-none font-sans"
              >
                Preview
              </button>
            </div>

            {blastPreviewMode && (
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-150/50 dark:border-indigo-950 rounded-xl space-y-1.5 leading-snug text-xs text-slate-500 dark:text-slate-350 font-sans animate-fade-in text-left">
                <h5 className="text-[10px] font-bold text-indigo-505 uppercase tracking-widest leading-none">Smart Preview Overlay</h5>
                <p className="font-mono text-[9px] text-slate-400">Subject: {blastSubject || `New message in ${event.name || "Event"}`}</p>
                <p className="italic bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200/50 dark:border-white/5 font-serif text-[11px] text-slate-700 dark:text-slate-300">
                  {blastMessage || "Share a message with your guests..."}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- MODAL 3: Share Event Modal --- */}
      {showShareEventModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowShareEventModal(false); }}
          className="fixed inset-0 bg-slate-150/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in font-sans"
        >
          <div className="bg-white dark:bg-[#110F30] rounded-2xl w-full max-w-sm shadow-2xl p-6 relative text-center space-y-6 animate-scale-up" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setShowShareEventModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 dark:hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-indigo-950 text-slate-700 dark:text-slate-300 flex items-center justify-center select-none shadow-sm">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-3.5 font-sans">Share This Event</h3>
            </div>

            <div className="grid grid-cols-5 gap-3 shrink-0 py-2">
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`, '_blank')}
                className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-indigo-950/30 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:scale-[1.03] transition-all">
                  <Facebook className="w-4.5 h-4.5 fill-current stroke-0" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-tight">Share</span>
              </button>

              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(`Join ${event.name}!`)}`, '_blank')}
                className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-indigo-950/30 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:scale-[1.03] transition-all">
                  <Twitter className="w-4.5 h-4.5 fill-current stroke-0" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-tight">Post</span>
              </button>

              <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`, '_blank')}
                className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-indigo-950/30 text-slate-705 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:scale-[1.03] transition-all">
                  <Linkedin className="w-4.5 h-4.5 fill-current stroke-0" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-tight">Post</span>
              </button>

              <button 
                onClick={() => window.open(`mailto:?subject=${encodeURIComponent(event.name)}&body=${encodeURIComponent(publicUrl)}`)}
                className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-indigo-950/30 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:scale-[1.03] transition-all">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-tight">Email</span>
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                }}
                className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-indigo-950/30 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:scale-[1.03] transition-all">
                  <Share2 className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-tight font-sans">Share</span>
              </button>
            </div>

            <div className="border-t border-slate-100 dark:border-white/5" />

            <div className="space-y-1.5 text-left select-none font-sans">
              <label className="block text-[11px] font-bold text-slate-400">Share the link:</label>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={publicUrl}
                  className="flex-grow px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-xs font-mono select-all text-slate-700 dark:text-slate-300 focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publicUrl);
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 2000);
                  }}
                  className={`px-4.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors border select-none font-sans ${
                    shareCopied 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-indigo-950/30 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {shareCopied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
