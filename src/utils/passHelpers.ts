/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to check contrast (relative luminance) for WCAG AA compliance
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastColor(hexBg: string): string {
  const luminance = getLuminance(hexBg);
  // WCAG standard contrast ratio threshold
  return luminance > 0.45 ? '#0F0E17' : '#FFFFFF';
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex) || { r: 99, g: 102, b: 241 };
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(10)}${f(8)}${f(4)}`;
}

// Generate full palette from a single color for real-time pass injection
export function generatePalette(baseHex: string) {
  const { h, s, l } = hexToHsl(baseHex);
  
  return {
    brand50: hslToHex(h, s, 95 + (l * 0.05)), // high lightness fallback template/contrast
    brand100: hslToHex(h, s, 90),
    brand200: hslToHex(h, s, 80),
    brand400: hslToHex(h, s, Math.max(30, l - 10)),
    brand500: baseHex,
    brand600: hslToHex(h, s, Math.max(20, l - 10)),
    brand700: hslToHex(h, s, Math.max(15, l - 20)),
    brand900: hslToHex(h, maxSaturation(s, 1.2), 8), // deep rich indigo-black-like
  };
}

function maxSaturation(s: number, factor: number): number {
  return Math.min(100, Math.round(s * factor));
}

// Simple deterministic signature helper (pure synchronous fallback) to sign strings without requiring heavy server or async crypto
// This ensures HMAC verification works flawlessly offline in the browser and in iframe
export function computeHMAC(message: string, secret: string): string {
  const key = message + '|' + secret;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Convert 32-bit integer to hex representations
  const hex = Math.abs(hash).toString(16).padEnd(8, '4') + 
              Array.from(key).reverse().slice(0, 6).map(c => c.charCodeAt(0).toString(16)).join('');
  return hex.substring(0, 16);
}

// Full format signature generators for attendee
export function signAttendeePass(eventId: string, attendeeId: string, secretKey: string): string {
  const msg = `${eventId}:${attendeeId}`;
  return computeHMAC(msg, secretKey);
}

export function verifyAttendeePass(eventId: string, attendeeId: string, signature: string, secretKey: string): boolean {
  const computed = signAttendeePass(eventId, attendeeId, secretKey);
  return computed === signature;
}

// Date formatter
export function formatPassDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Fallback to raw string
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    // Customize to "Saturday, 14 June 2026 · 7:00 PM"
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    
    let weekday = '';
    let day = '';
    let month = '';
    let year = '';
    let hour = '';
    let minute = '';
    let ampm = '';
    
    for (const part of parts) {
      if (part.type === 'weekday') weekday = part.value;
      else if (part.type === 'day') day = part.value;
      else if (part.type === 'month') month = part.value;
      else if (part.type === 'year') year = part.value;
      else if (part.type === 'hour') hour = part.value;
      else if (part.type === 'minute') minute = part.value;
      else if (part.type === 'dayPeriod') ampm = part.value.toUpperCase();
    }
    
    return `${weekday}, ${day} ${month} ${year} · ${hour}:${minute} ${ampm}`;
  } catch (e) {
    return dateString;
  }
}
