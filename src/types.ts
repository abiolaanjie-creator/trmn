/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PassTemplate = 'OBSIDIAN' | 'AURORA' | 'BLOOM' | 'NEON' | 'CANVAS' | 'ROMANCE' | 'GLASS' | 'LOVE_IN_THE_AIR' | 'GARDEN_BERRIES' | 'TECH_MOTION' | 'CREATIVE_FEST';

export type BackgroundPattern = 'none' | 'dots' | 'grid' | 'diagonal' | 'waves' | 'noise';

export type PassAnimation = 'none' | 'shimmer' | 'pulse' | 'float';

export interface ConfettiStyleConfig {
  type: 'classic' | 'brand' | 'stars' | 'snow' | 'minimal';
  shapes: string[];
  colors: string[];
  gravity?: number;
  count?: number;
}

export type AttendeeType = 'VIP' | 'GENERAL' | 'STAFF' | 'SPEAKER' | string;

export interface Attendee {
  id: string; // Unique attendee ID
  name: string;
  type: AttendeeType;
  email: string;
  status: 'registered' | 'checked-in';
  checkedInAt?: string; // ISO date-time string
  passId: string; // Format EVT-YYYY-[Random]
  hmacSignature: string; // Signature to prevent forge
}

export interface EventDetails {
  id: string;
  name: string;
  dateTime: string; // Format: Saturday, 14 June 2026 · 7:00 PM or standard ISO
  venue: string;
  organizerName: string;
  brandColor: string; // Hex color e.g., #6366F1
  brandBgColor?: string; // Optional custom background color override e.g., #FFFFFF
  brandTextColor?: string; // Optional custom text color override e.g., #000000
  brandTitleColor?: string; // Edit color of the event name/title on the pass image
  brandContentColor?: string; // Edit text on the lower part (body) of the event pass
  logoUrl?: string; // Data URI or URL
  bannerUrl?: string; // Data URI or URL
  template: PassTemplate;
  pattern: BackgroundPattern;
  animation: PassAnimation;
  emojis: string[]; // 1 to 3 emojis
  badgeText: string; // VIP, Staff, etc. (defaults to Attendee.type)
  secretKey: string; // Unique secret key for scanning validity checks

  // Extra gorgeous wizard configuration fields matching design mockup
  isPublished?: boolean;
  eventThemeVibe?: 'default' | 'standard_minimalist' | 'midnight_cosmic' | 'radiant_cyber_neon' | 'rustic_amber' | 'moss_whisper' | 'geometric_grid' | 'solstice_shift' | 'standard' | 'midnight' | 'neon' | 'warm' | 'forest';
  ticketType?: 'free' | 'paid';
  ticketPrice?: number;
  category?: string;
  shortDescription?: string;
  about?: string;
  hostTitle?: string;
  hostAvatar?: string;
  hostTwitter?: string;
  hostLinkedIn?: string;
  timezone?: string;
  startTime?: string;
  endTimeName?: string;
  isOnline?: boolean;
  onlineLink?: string;
  tags?: string[];
  requirements?: string[];
  agenda?: { id: string; time: string; activity: string }[];
}

export interface ThemeSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string; // Used for global UI accents, defaults to #6366F1
  textSize: 'small' | 'default' | 'large';
  reduceMotion: boolean;
}
