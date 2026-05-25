/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { EventDetails, Attendee, PassTemplate } from '../types';
import { getContrastColor, formatPassDate } from '../utils/passHelpers';
import { Ticket, Calendar, MapPin, Heart } from 'lucide-react';

interface PassCardPreviewProps {
  event: EventDetails;
  attendee: Partial<Attendee>;
  id?: string;
}

export function PassCardPreview({ event, attendee, id = 'pass-card-element' }: PassCardPreviewProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  const passId = attendee.passId || 'EVT-2026-DEMO99';
  const attendeeId = attendee.id || 'demo-attendee';
  const hmac = attendee.hmacSignature || 'demohmac';
  const badgeText = event.badgeText || attendee.type || 'General';
  
  const protocol = window.location.protocol;
  const host = window.location.host;
  const verificationUrl = `${protocol}//${host}?scannerCheck=true&eventId=${event.id}&attendeeId=${attendeeId}&hmac=${hmac}&name=${encodeURIComponent(attendee.name || '')}&type=${encodeURIComponent(badgeText)}`;

  // Dynamically compute the palette based on Template & color customization overrides
  const accent = event.brandColor || '#6366F1';
  let bg = event.brandBgColor;

  if (!bg) {
    if (event.template === 'CANVAS') bg = '#FAF8F5';
    else if (event.template === 'OBSIDIAN') bg = '#121314';
    else if (event.template === 'AURORA') bg = '#0C0A21';
    else if (event.template === 'NEON') bg = '#05050A';
    else if (event.template === 'BLOOM') bg = '#EDF5EB';
    else if (event.template === 'ROMANCE') bg = '#FFFDF9';
    else if (event.template === 'GLASS') bg = 'rgba(255, 255, 255, 0.14)';
    else if (event.template === 'LOVE_IN_THE_AIR') bg = '#5C0612';
    else if (event.template === 'GARDEN_BERRIES') bg = '#FAF5FF';
    else if (event.template === 'TECH_MOTION') bg = '#060814';
    else if (event.template === 'CREATIVE_FEST') bg = '#FCF8FF';
    else bg = '#FFFFFF';
  }

  // Generate larger QR Code (Increased code size request)
  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 320, // Crisp high-definition QR
      errorCorrectionLevel: 'H',
      color: {
        dark: ['NEON', 'TECH_MOTION'].includes(event.template) ? '#000000' : event.template === 'OBSIDIAN' ? '#FFFFFF' : '#0F0E17',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [verificationUrl, event.template, bg, accent]);

  // General theme options mapping for display
  const isDarkTheme = ['OBSIDIAN', 'AURORA', 'NEON', 'LOVE_IN_THE_AIR', 'TECH_MOTION'].includes(event.template);
  const isGlass = event.template === 'GLASS';
  const isRomance = event.template === 'ROMANCE';
  const isCanvas = event.template === 'CANVAS';
  const isBloom = event.template === 'BLOOM';
  const isLove = event.template === 'LOVE_IN_THE_AIR';
  const isGarden = event.template === 'GARDEN_BERRIES';
  const isTech = event.template === 'TECH_MOTION';
  const isCreative = event.template === 'CREATIVE_FEST';

  // Card outline / shadow settings
  let cardBorderColor = 'rgba(226, 232, 240, 0.8)';
  let cardShadow = '0 20px 40px -15px rgba(0, 0, 0, 0.1)';
  let glowStyle: React.CSSProperties = {};

  if (event.template === 'NEON') {
    cardBorderColor = accent;
    cardShadow = `0 0 25px -5px ${accent}40`;
    glowStyle = {
      boxShadow: `0 0 20px ${accent}15, inset 0 0 20px ${accent}08`
    };
  } else if (event.template === 'AURORA') {
    cardBorderColor = 'rgba(99, 102, 241, 0.25)';
    cardShadow = `0 15px 35px -10px ${accent}30`;
  } else if (event.template === 'GLASS') {
    cardBorderColor = 'rgba(255, 255, 255, 0.25)';
    cardShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.08)';
  } else if (event.template === 'ROMANCE') {
    cardBorderColor = 'rgba(212, 175, 55, 0.3)';
    cardShadow = '0 15px 35px -12px rgba(139, 92, 26, 0.12)';
  } else if (isLove) {
    cardBorderColor = 'rgba(244, 63, 94, 0.4)';
    cardShadow = '0 15px 40px -10px rgba(153, 27, 27, 0.35)';
    glowStyle = {
      boxShadow: '0 0 25px rgba(244, 63, 94, 0.18), inset 0 0 20px rgba(244, 63, 94, 0.12)'
    };
  } else if (isGarden) {
    cardBorderColor = '#E9D5FF';
    cardShadow = '0 15px 35px -12px rgba(124, 58, 237, 0.12)';
  } else if (isTech) {
    cardBorderColor = '#1E2B48';
    cardShadow = `0 12px 35px -10px ${accent}40`;
    glowStyle = {
      boxShadow: `0 0 20px ${accent}25`
    };
  } else if (isCreative) {
    cardBorderColor = '#F2E8FF';
    cardShadow = '0 15px 40px -8px rgba(139, 92, 246, 0.18)';
  } else if (isBloom) {
    cardBorderColor = 'rgba(46, 111, 64, 0.22)';
    cardShadow = '0 15px 35px -12px rgba(46, 111, 64, 0.12)';
  } else if (isDarkTheme) {
    cardBorderColor = '#2D3142';
    cardShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
  }

  // Custom typography styles based on selected templates
  let nameFontClass = "font-extrabold tracking-tight";
  let nameStyle: React.CSSProperties = {};
  let bodyFontClass = "font-sans";
  let subtitleTextClass = "font-mono uppercase tracking-widest text-[8px]";

  if (isCanvas) {
    nameFontClass = "font-serif text-2xl font-bold italic";
    bodyFontClass = "font-serif";
  } else if (isRomance) {
    nameFontClass = "font-serif tracking-wide text-2xl lowercase italic font-medium pt-0.5";
    nameStyle = { fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif", letterSpacing: '0.05em' };
    bodyFontClass = "font-serif";
  } else if (isLove) {
    nameFontClass = "font-serif tracking-wide text-xl italic font-semibold";
    nameStyle = { fontFamily: "'Playfair Display', 'Georgia', serif" };
    bodyFontClass = "font-serif";
  } else if (isTech) {
    nameFontClass = "font-mono font-bold tracking-tight uppercase text-lg text-cyan-400";
    bodyFontClass = "font-mono";
  } else if (isGarden) {
    nameFontClass = "font-sans font-medium tracking-wide text-lg text-purple-950 dark:text-purple-200";
    bodyFontClass = "font-sans";
  } else if (isCreative) {
    nameFontClass = "font-sans font-black tracking-tighter uppercase text-xl text-indigo-900 dark:text-indigo-200";
    bodyFontClass = "font-sans";
  } else if (event.template === 'OBSIDIAN') {
    nameFontClass = "font-sans font-light tracking-wide text-lg";
    bodyFontClass = "font-sans font-normal";
  } else if (event.template === 'NEON') {
    nameFontClass = "font-mono font-black uppercase tracking-wider text-base";
    bodyFontClass = "font-mono";
  } else if (isBloom) {
    nameFontClass = "font-sans font-bold text-lg rounded-md";
    bodyFontClass = "font-sans";
  }

  return (
    <div
      id={id}
      className="pass-card w-[315px] sm:w-[325px] h-[550px] rounded-3xl transition-all duration-300 relative border overflow-hidden select-none flex flex-col justify-between"
      style={{
        borderColor: cardBorderColor,
        boxShadow: cardShadow,
        backgroundColor: bg === 'transparent' ? 'rgba(255,255,255,0.05)' : bg,
        color: isDarkTheme ? '#E2E8F0' : '#1E293B',
        ...glowStyle
      }}
    >
      {/* Iridescent background gradient specifically layered for Liquid Glassmorphism template */}
      {isGlass && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Neon blob refraction gradients behind glass pane */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full mix-blend-screen filter blur-3xl opacity-45 animate-pulse" style={{ backgroundColor: accent }} />
          <div className="absolute top-24 -right-12 w-44 h-44 rounded-full mix-blend-screen filter blur-3xl opacity-40" style={{ backgroundColor: '#F472B6' }} />
          <div className="absolute -bottom-16 left-12 w-48 h-48 rounded-full mix-blend-screen filter blur-3xl opacity-35" style={{ backgroundColor: '#60A5FA' }} />
        </div>
      )}

      {isLove && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5C0612]/20 to-[#4C051E]/75" />
          <div className="absolute top-10 left-6 text-rose-500/35"><Heart className="w-5 h-5 fill-current animate-pulse duration-1000" /></div>
          <div className="absolute top-36 right-8 text-rose-400/25"><Heart className="w-4 h-4 fill-current animate-pulse duration-700" /></div>
          <div className="absolute bottom-40 left-10 text-rose-500/20"><Heart className="w-3.5 h-3.5 fill-current" /></div>
          <div className="absolute bottom-16 right-12 text-rose-500/30"><Heart className="w-6 h-6 fill-current animate-bounce duration-[3000ms]" /></div>
          <div className="absolute inset-2 border border-rose-500/10 rounded-2xl pointer-events-none" />
        </div>
      )}

      {isBloom && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#EDF5EB]/10 to-[#E2EFE0]/50" />
          <div className="absolute top-10 right-6 text-emerald-700/25 text-2.5xl select-none animate-[pulse_5s_infinite_alternate]">🌸</div>
          <div className="absolute top-[120px] left-4 text-emerald-600/20 text-lg select-none">🌿</div>
          <div className="absolute bottom-[230px] right-2 text-green-600/15 text-2xl select-none">🍃</div>
          <div className="absolute bottom-24 left-6 text-emerald-700/25 text-2.5xl select-none animate-[pulse_4s_infinite_alternate_1s]">🌺</div>
          <div className="absolute bottom-40 right-10 text-yellow-600/15 text-lg select-none">🌼</div>
          <div className="absolute inset-2 border border-emerald-500/10 rounded-2xl pointer-events-none" />
        </div>
      )}

      {isGarden && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-gradient-to-tr from-[#F3E8FF] via-[#FAF5FF] to-[#EDE9FE]">
          {/* Floating pretty floral and berry decorations peeking out from margins with dropshadows & rotations */}
          <div className="absolute top-6 -right-2 text-3xl transform rotate-12 drop-shadow-md select-none animate-[bounce_4s_infinite]">🌸</div>
          <div className="absolute top-28 -left-3 text-3xl transform -rotate-12 drop-shadow-md select-none">🍇</div>
          <div className="absolute bottom-56 -right-3 text-3xl transform rotate-45 drop-shadow-md select-none">🍓</div>
          <div className="absolute bottom-20 -left-2 text-3xl transform -rotate-12 drop-shadow-md select-none animate-[pulse_3s_infinite]">🌺</div>
          <div className="absolute top-44 right-4 text-purple-400/20 text-xs">✿</div>
          <div className="absolute bottom-40 left-6 text-purple-400/25 text-sm">❀</div>
          <div className="absolute inset-2.5 border border-purple-300/30 rounded-[20px] pointer-events-none" />
        </div>
      )}

      {isTech && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#020409]">
          <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_0.8px,transparent_0.8px)] [background-size:14px_14px] opacity-[0.08]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080E24]/30 to-[#020409]" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.6)] animate-pulse z-20" />
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-[4px]" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-[4px]" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-400/40 rounded-bl-[4px]" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan-400/40 rounded-br-[4px]" />
          <div className="absolute top-1/2 left-2 w-1.5 h-6 border-l border-y border-cyan-400/20 -translate-y-1/2" />
          <div className="absolute top-1/2 right-2 w-1.5 h-6 border-r border-y border-cyan-400/20 -translate-y-1/2" />
          <div className="absolute top-12 right-6 text-cyan-400/30 font-mono text-[8.5px] select-none">SYS: [OK]</div>
          <div className="absolute bottom-40 left-6 text-cyan-400/20 font-mono text-[9px] select-none">+</div>
        </div>
      )}

      {isCreative && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#FCFAFF]">
          <div className="absolute -top-16 -left-16 w-52 h-52 bg-pink-500/18 rounded-full filter blur-3xl opacity-90 animate-[pulse_6s_infinite_alternate]" />
          <div className="absolute top-24 -right-16 w-44 h-44 bg-amber-400/15 rounded-full filter blur-2xl opacity-80 animate-[pulse_8s_infinite_alternate_2s]" />
          <div className="absolute -bottom-16 left-16 w-48 h-48 bg-violet-500/20 rounded-full filter blur-3xl opacity-95 animate-[pulse_7s_infinite_alternate_1s]" />
          <div className="absolute inset-1.5 border border-indigo-100/40 rounded-[22px] pointer-events-none" />
          <div className="absolute top-10 right-10 text-pink-500/45 text-lg select-none animate-[bounce_3s_infinite]">✦</div>
          <div className="absolute top-44 left-6 text-violet-400/40 text-sm select-none animate-pulse">★</div>
          <div className="absolute bottom-36 right-8 text-amber-500/40 text-lg select-none animate-[bounce_4s_infinite_1s]">✦</div>
          <div className="absolute bottom-12 left-12 text-pink-400/45 text-sm select-none">★</div>
        </div>
      )}

      {/* Hand-drawn artist illustrative layers for Classic Canvas */}
      {isCanvas && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40 select-none">
          {/* Subtle hand-sketched lines decor in background */}
          <svg viewBox="0 0 100 100" fill="none" stroke="#7A6A53" strokeWidth="0.6" className="absolute top-4 right-4 w-16 h-16 opacity-30">
            <path d="M10,10 Q30,15 40,40 T70,50" />
            <circle cx="40" cy="40" r="1.5" fill="#7A6A53" />
            <path d="M5,25 C25,20 30,35 60,30" />
          </svg>
          <svg viewBox="0 0 100 100" fill="none" stroke="#7A6A53" strokeWidth="0.6" className="absolute bottom-24 left-4 w-20 h-20 opacity-30">
            <path d="M30,90 Q40,50 10,20" />
            <path d="M15,85 C25,70 5,45 25,12" />
          </svg>
          {/* Warm sketched inner borders */}
          <div className="absolute inset-2 border border-dashed border-[#7A6A53]/25 pointer-events-none rounded-2xl" />
        </div>
      )}

      {/* High-profile silver & black tech event style glossy finish for Premium Slate */}
      {event.template === 'OBSIDIAN' && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-3xl" style={{
          boxShadow: 'inset 0 0 45px rgba(255, 255, 255, 0.05)'
        }}>
          {/* Sweeping diagonal high-profile glossy sheen glare reflection */}
          <div className="absolute inset-0 opacity-40" style={{
            background: 'linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0.0) 50%, rgba(255,255,255,0.05) 100%)'
          }} />
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/[0.04] rotate-45 transform pointer-events-none blur-xl" />
        </div>
      )}

      {/* Elite love luxury romance layout details */}
      {isRomance && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Golden fine double framing */}
          <div className="absolute inset-[9px] border border-[#C5A059]/30 rounded-[18px]" />
          <div className="absolute inset-[13px] border border-[#C5A059]/15 rounded-[14px]" />
          {/* Luxury corner hearts */}
          <div className="absolute top-4 left-4 text-[#C5A059]/50"><Heart className="w-2.5 h-2.5 fill-current" /></div>
          <div className="absolute top-4 right-4 text-[#C5A059]/50"><Heart className="w-2.5 h-2.5 fill-current" /></div>
          <div className="absolute bottom-4 left-4 text-[#C5A059]/40"><Heart className="w-2.5 h-2.5 fill-current" strokeWidth={1} /></div>
          <div className="absolute bottom-4 right-4 text-[#C5A059]/40"><Heart className="w-2.5 h-2.5 fill-current" strokeWidth={1} /></div>
        </div>
      )}

      {/* ── COVER IMAGE HEADER (TALL HEIGHT - 44% of ticket) ── */}
      <div
        className="relative overflow-hidden flex flex-col justify-between p-4 shrink-0 transition-all duration-300"
        style={{
          height: '228px',
          borderBottom: isBloom ? `2px dashed color-mix(in srgb, ${accent} 25%, #DDD6C2)` : undefined,
          backgroundColor: isGlass ? 'rgba(255, 255, 255, 0.08)' : (event.bannerUrl ? 'transparent' : undefined),
          backgroundImage: event.bannerUrl ? undefined : (() => {
            if (isGlass) return 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)';
            if (event.template === 'AURORA') {
              return `radial-gradient(ellipse at top left, ${accent}33, transparent 75%), linear-gradient(135deg, ${bg} 0%, #03010F 100%)`;
            }
            if (event.template === 'NEON') {
              return `radial-gradient(ellipse at top right, ${accent}25, transparent 65%), linear-gradient(to bottom, ${bg}, #000000)`;
            }
            if (isRomance) {
              return `radial-gradient(circle at 50% 120%, ${accent}0a, transparent 75%), linear-gradient(to bottom, #FFFDF9, #F5EFF2)`;
            }
            if (isLove) {
              return `radial-gradient(ellipse at center, rgba(244, 63, 94, 0.25) 0%, transparent 75%), linear-gradient(135deg, ${bg} 0%, #310007 100%)`;
            }
            if (isGarden) {
              return `linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 100%)`;
            }
            if (isTech) {
              return `radial-gradient(ellipse at center right, ${accent}25, transparent 70%), linear-gradient(to bottom, ${bg}, #020409)`;
            }
            if (isCreative) {
              return `radial-gradient(circle at 10% 20%, rgba(236,72,153,0.14) 0%, rgba(139,92,246,0.1) 90%), linear-gradient(135deg, #FAF5FF 0%, #FFF1F2 100%)`;
            }
            return undefined; // Falls back to outer card background
          })(),
          backdropFilter: isGlass ? 'blur(22px)' : undefined,
          borderLeft: event.template === 'OBSIDIAN' ? `6px solid ${accent}` : undefined,
        }}
      >
        {/* Full-bleed banner photo background if custom image uploaded */}
        {event.bannerUrl && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src={event.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover brightness-[0.70]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]"></div>
          </div>
        )}

        {/* Elegant fine metallic hairlines frame for Eternal Romance template */}
        {isRomance && (
          <div className="absolute inset-2 border border-[#D4AF37]/30 pointer-events-none rounded-xl z-0" />
        )}

        {/* Healing botanicals watercolor effect behind Bloom text */}
        {isBloom && (
          <div className="absolute inset-0 opacity-[0.06] select-none pointer-events-none z-0">
            <svg viewBox="0 0 100 100" fill="currentColor" className="absolute -right-6 -bottom-6 w-32 h-32" style={{ color: accent }}>
              <path d="M50 0 C60 20, 80 40, 100 50 C80 60, 60 80, 50 100 C40 80, 20 60, 0 50 C20 40, 40 20, 50 0" />
            </svg>
            <svg viewBox="0 0 100 100" fill="currentColor" className="absolute -left-4 top-2 w-24 h-24" style={{ color: accent }}>
              <path d="M50 0 C60 20, 80 40, 100 50 C80 60, 60 80, 50 100 C40 80, 20 60, 0 50 C20 40, 40 20, 50 0" />
            </svg>
          </div>
        )}

        {/* Content top: Logo & Ticket Badge */}
        <div className="flex justify-between items-start w-full relative z-10">
          <div className="flex items-center gap-1.5 overflow-hidden max-w-[70%]">
            {event.logoUrl ? (
              <img
                src={event.logoUrl}
                alt="Logo"
                className="h-6 max-w-[60px] object-contain rounded"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="w-5.5 h-5.5 rounded flex items-center justify-center bg-white/20 backdrop-blur-md shrink-0 border border-white/10"
                style={{
                  backgroundColor: event.brandTitleColor ? `${event.brandTitleColor}18` : (isBloom ? `color-mix(in srgb, ${accent} 25%, white)` : undefined),
                  borderColor: event.brandTitleColor ? `${event.brandTitleColor}30` : undefined
                }}
              >
                <Ticket
                  className="w-3.5 h-3.5"
                  style={{ color: event.brandTitleColor || (isBloom ? accent : '#FFFFFF') }}
                />
              </div>
            )}
            <span
              className="text-[10px] font-mono tracking-wider font-semibold opacity-90 truncate"
              style={{
                color: event.brandTitleColor || event.brandTextColor || (isBloom ? `color-mix(in srgb, ${accent} 80%, black)` : isCanvas ? '#2C2621' : isLove ? '#FEE2E2' : isGarden ? '#4C1D95' : isTech ? '#E0F2FE' : isCreative ? '#1E1B4B' : '#FFFFFF'),
                fontFamily: isRomance || isCanvas || isLove ? 'Georgia, serif' : undefined
              }}
            >
              {event.organizerName || 'Trmn pass'}
            </span>
          </div>

          <div
            className="px-2 py-0.5 rounded-full text-[8.5px] font-extrabold tracking-wider uppercase select-none shadow-sm transition-transform duration-200"
            style={{
              backgroundColor: event.brandTextColor ? `${event.brandTextColor}18` : (isRomance ? '#FFFDF9' : isLove ? '#991B1B' : isGarden ? '#F3E8FF' : isTech ? '#1E3A8A' : isCreative ? '#EDE9FE' : '#FFFFFF'),
              color: event.brandTextColor || (isLove ? '#FECDD3' : isGarden ? '#701A75' : isTech ? '#38BDF8' : isCreative ? '#7C3AED' : accent),
              border: event.brandTextColor ? `1.5px solid ${event.brandTextColor}` : (isRomance ? '0.5px solid rgba(212,175,55,0.4)' : isLove ? '1px solid rgba(244,63,94,0.3)' : undefined)
            }}
          >
            {badgeText}
          </div>
        </div>

        {/* Content bottom: Event Name display */}
        <div className="relative z-10 pb-1 mt-auto">
          <span className="text-[8px] font-bold tracking-widest uppercase opacity-75 block mb-0.5"
            style={{
              color: event.brandTitleColor || event.brandTextColor || (isBloom ? `color-mix(in srgb, ${accent} 80%, black)` : isCanvas ? '#292524' : isLove ? '#FDA4AF' : isGarden ? '#6B21A8' : isTech ? '#67E8F9' : isCreative ? '#4F46E5' : '#FFFFFF')
            }}
          >
            ADMIT ONE PASS
          </span>
          <h1
            className={`leading-tight font-extrabold line-clamp-2 drop-shadow-sm transition-colors ${isCreative ? 'font-sans font-black tracking-tighter uppercase text-lg sm:text-xl' : 'text-lg'}`}
            style={{
              color: event.brandTitleColor || event.brandTextColor || (isBloom ? `color-mix(in srgb, ${accent} 90%, black)` : isCanvas ? '#1C1917' : isRomance ? '#2C1B04' : isLove ? '#FFFFFF' : isGarden ? '#2E1065' : isTech ? '#E0F2FE' : isCreative ? '#1E1B4B' : '#FFFFFF'),
              fontFamily: isCanvas || isRomance || isLove ? "'Playfair Display', 'Georgia', serif" : isTech ? "monospace, 'JetBrains Mono'" : undefined,
              textShadow: event.template === 'AURORA' ? `0 0 10px ${accent}45` : undefined
            }}
          >
            {event.name || 'Event Title'}
          </h1>
        </div>
      </div>

      {/* ── CARD BODY DETAILS SECTION (Attendee details, timing, venue) ── */}
      <div
        className="w-full flex-grow flex flex-col justify-between p-4 border-t border-slate-100/10 transition-all duration-300 relative z-10"
        style={{
          backgroundColor: (() => {
            if (isGlass) return 'rgba(255, 255, 255, 0.04)';
            if (isBloom) return 'transparent';
            if (isRomance) return '#FFFDF5';
            if (isLove) return '#3B0007';
            if (isGarden) return 'transparent';
            if (isTech) return '#060814';
            if (isCreative) return 'transparent';
            if (event.template === 'NEON') return '#0C0D18';
            if (event.template === 'OBSIDIAN') return '#1A1B1D';
            if (event.template === 'AURORA') return '#12102E';
            return bg;
          })(),
          backdropFilter: isGlass ? 'blur(20px)' : undefined,
        }}
      >
        {/* Elegant metallic border for romantic mood */}
        {isRomance && (
          <div className="absolute inset-x-2 inset-y-1 border border-[#D4AF37]/20 pointer-events-none rounded-lg" />
        )}

        <div className="space-y-2 text-left">
          {/* Guest Label & Name */}
          <div className="space-y-0.5">
            <span 
              className={subtitleTextClass}
              style={{
                color: event.brandContentColor || (event.brandTextColor ? `${event.brandTextColor}b0` : (isBloom ? '#2E6F40' : isCanvas ? '#564E46' : isRomance ? '#70593B' : isGarden ? '#4C1D95' : isTech ? '#67E8F9' : isCreative ? '#701A75' : isDarkTheme ? '#8E8BA7' : '#526071')),
                fontFamily: isRomance || isCanvas || isLove ? 'Georgia, serif' : isTech ? 'var(--font-mono)' : undefined
              }}
            >
              pass holder
            </span>
            <p
              className={`leading-snug transition-colors line-clamp-1 ${nameFontClass}`}
              style={{
                ...nameStyle,
                color: event.brandContentColor || event.brandTextColor || (() => {
                  if (event.template === 'NEON') return accent;
                  if (isBloom) return `color-mix(in srgb, ${accent} 85%, black)`;
                  if (isRomance) return '#3D311F';
                  if (isCanvas) return '#292524';
                  if (isLove) return '#FFE4E6';
                  if (isGarden) return '#4C1D95';
                  if (isTech) return '#22D3EE';
                  if (isCreative) return '#1E1B4B';
                  if (isDarkTheme) return '#FFFFFF';
                  return '#0F172A';
                })()
              }}
            >
              {attendee.name || 'Yemi Adebayo'}
            </p>
          </div>

          <div
            className={`grid grid-cols-1 gap-1 pt-1 text-[11px] font-medium transition-colors ${bodyFontClass}`}
            style={{
              color: event.brandContentColor || (event.brandTextColor ? `${event.brandTextColor}d0` : (isBloom ? '#2D5A27' : isRomance ? '#5C4E3A' : isCanvas ? '#44403C' : isGarden ? '#5B21B6' : isTech ? '#A5F3FC' : isCreative ? '#4338CA' : isDarkTheme ? '#CBD5E1' : '#334155')),
            }}
          >
            {/* Event Time */}
            <div className="flex items-center gap-1.5 opacity-90">
              <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: event.brandContentColor || event.brandTextColor || accent }} />
              <span className="leading-tight truncate">
                {formatPassDate(event.dateTime) || 'Saturday, 14 June 2026 · 7:00 PM'}
              </span>
            </div>

            {/* Event Venue */}
            <div className="flex items-center gap-1.5 opacity-95">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: event.brandContentColor || event.brandTextColor || accent }} />
              <span className="leading-tight truncate max-w-[240px]">
                {event.venue || 'Provide a physical or virtual location.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PERFORATION NOTCH LINE (Placed precisely above QR stub) ── */}
      <div className="relative h-6 bg-transparent select-none shrink-0 transition-all duration-300 z-10"
        style={{
          backgroundColor: (() => {
            if (isGlass) return 'rgba(255, 255, 255, 0.04)';
            if (isBloom) return 'transparent';
            if (isRomance) return '#FFFDF5';
            if (isLove) return '#3B0007';
            if (isGarden) return 'transparent';
            if (isTech) return '#060814';
            if (isCreative) return 'transparent';
            if (event.template === 'NEON') return '#0C0D18';
            if (event.template === 'OBSIDIAN') return '#1A1B1D';
            if (event.template === 'AURORA') return '#12102E';
            return bg;
          })(),
          backdropFilter: isGlass ? 'blur(20px)' : undefined,
        }}
      >
        {/* Notch - Left */}
        <div 
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-r transition-colors pointer-events-none z-10" 
          style={{
            backgroundColor: 'currentColor',
            color: 'var(--color-bg-page, #F7F6F3)',
            borderColor: 'rgba(0,0,0,0.06)'
          }}
        />
        
        {/* Dotted perforation line */}
        <div 
          className="absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t border-dashed z-20 transition-colors" 
          style={{
            borderColor: isDarkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }}
        />
        
        {/* Notch - Right */}
        <div 
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-l transition-colors pointer-events-none z-10" 
          style={{
            backgroundColor: 'currentColor',
            color: 'var(--color-bg-page, #F7F6F3)',
            borderColor: 'rgba(0,0,0,0.06)'
          }}
        />
      </div>

      {/* ── QR CODE ENTRY STUB (Placed at bottom below notch and address - height 150px) ── */}
      <div
        className="w-full h-[155px] p-2 bg-transparent flex flex-col items-center justify-center select-none shrink-0 transition-all duration-300 relative z-10"
        style={{
          borderTop: isGlass ? '1px solid rgba(255, 255, 255, 0.1)' : undefined,
          backgroundColor: (() => {
            if (isGlass) return 'rgba(255, 255, 255, 0.02)';
            if (isBloom) return 'rgba(46, 111, 64, 0.05)';
            if (isRomance) return '#F5EFE0';
            if (isLove) return '#2D0005';
            if (isGarden) return 'rgba(124, 58, 237, 0.04)';
            if (isTech) return '#03040B';
            if (isCreative) return 'rgba(236, 72, 153, 0.03)';
            if (event.template === 'NEON') return '#060710';
            if (event.template === 'OBSIDIAN') return '#0F1012';
            if (event.template === 'AURORA') return '#08061C';
            return bg;
          })(),
          backdropFilter: isGlass ? 'blur(25px)' : undefined,
        }}
      >
        {/* Metallic hairline inner border for Romance stub */}
        {isRomance && (
          <div className="absolute inset-x-2 inset-y-1 border border-[#D4AF37]/15 pointer-events-none rounded-lg z-0" />
        )}

        {/* Scaled QR Frame (Increased size requested from 78px to 102px) */}
        <div
          className="pass-qr p-1 flex items-center justify-center bg-white transition-all duration-200 hover:scale-105 shadow-md relative z-10"
          style={{
            borderColor: (() => {
              if (event.template === 'OBSIDIAN') return '#3B3A5A';
              if (event.template === 'NEON') return accent;
              if (isBloom) return `color-mix(in srgb, ${accent} 25%, #E2DDD0)`;
              if (isRomance) return 'rgba(212,175,55,0.4)';
              if (isGlass) return 'rgba(255,255,255,0.4)';
              if (isLove) return 'rgba(244,63,94,0.35)';
              if (isGarden) return '#D8B4FE';
              if (isTech) return '#22D3EE';
              if (isCreative) return '#DDD6FE';
              return 'rgba(0, 0, 0, 0.1)';
            })(),
            borderWidth: '1.5px',
            borderRadius: '10px',
            width: '102px',
            height: '102px',
          }}
        >
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Verifiable Event Ticket QR"
              className="w-full h-full object-contain pointer-events-none select-none rounded"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 rounded animate-pulse" />
          )}
        </div>

        {/* Monospace Pass Ticket ID Bar */}
        <span 
          className="text-[8.5px] font-bold tracking-widest font-mono uppercase mt-2 transition-colors relative z-10"
          style={{
            color: event.brandTextColor ? `${event.brandTextColor}b0` : (isBloom ? '#8B8276' : isRomance ? '#9F8D75' : isLove ? '#FDA4AF' : isGarden ? '#7C3AED' : isTech ? '#67E8F9' : isCreative ? '#7C3AED' : isDarkTheme ? '#787596' : '#94A3B8'),
          }}
        >
          PASS ID: {passId}
        </span>
      </div>
    </div>
  );
}
