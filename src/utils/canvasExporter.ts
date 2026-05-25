/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventDetails, Attendee } from '../types';
import { formatPassDate } from './passHelpers';
import QRCode from 'qrcode';

// Load image helper
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed for source: ' + src));
    img.src = src;
  });
};

/**
 * High-fidelity Canvas renderer which outputs print-grade PNGs or PDF buffers.
 */
export async function renderPassToCanvas(
  event: EventDetails,
  attendee: Partial<Attendee>,
  scale = 2
): Promise<HTMLCanvasElement> {
  const width = 325 * scale;
  const stdHeight = 550 * scale; // Standardized taller pass size to handle the larger QR layout

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = stdHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to acquire 2D context');

  // Activate antialiasing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Overriding background and accent color configs matching preview logic
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

  const isDarkTheme = ['OBSIDIAN', 'AURORA', 'NEON', 'LOVE_IN_THE_AIR', 'TECH_MOTION'].includes(event.template);
  const isGlass = event.template === 'GLASS';
  const isRomance = event.template === 'ROMANCE';
  const isCanvas = event.template === 'CANVAS';
  const isBloom = event.template === 'BLOOM';
  const isLove = event.template === 'LOVE_IN_THE_AIR';
  const isGarden = event.template === 'GARDEN_BERRIES';
  const isTech = event.template === 'TECH_MOTION';
  const isCreative = event.template === 'CREATIVE_FEST';

  // Setup layout variables matching the tall visual ticket
  const headerHeight = 228 * scale;
  const perfY = 373 * scale; // Placed precisely above the QR stub cutout
  const stubHeight = stdHeight - perfY;

  // Render Background (Base Outer Card Box)
  ctx.save();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, stdHeight);
  ctx.restore();

  // Draw Heart Bezier Helper
  const drawHeartPath = (c: CanvasRenderingContext2D, hX: number, hY: number, hW: number, hH: number) => {
    c.beginPath();
    const topCurveHeight = hH * 0.3;
    c.moveTo(hX, hY + topCurveHeight);
    c.bezierCurveTo(hX, hY, hX - hW / 2, hY, hX - hW / 2, hY + topCurveHeight);
    c.bezierCurveTo(hX - hW / 2, hY + (hH + topCurveHeight) / 2, hX, hY + (hH + topCurveHeight) / 2, hX, hY + hH);
    c.bezierCurveTo(hX, hY + (hH + topCurveHeight) / 2, hX + hW / 2, hY + (hH + topCurveHeight) / 2, hX + hW / 2, hY + topCurveHeight);
    c.bezierCurveTo(hX + hW / 2, hY, hX, hY, hX, hY + topCurveHeight);
    c.closePath();
    c.fill();
  };

  // Glassmorphism iridescent backgrounds peeking through
  if (isGlass) {
    ctx.save();
    // Pink radiant blur sphere
    const peakGrad1 = ctx.createRadialGradient(250 * scale, 120 * scale, 0, 250 * scale, 120 * scale, 150 * scale);
    peakGrad1.addColorStop(0, hexToRgba('#F472B6', 0.45));
    peakGrad1.addColorStop(1, 'transparent');
    ctx.fillStyle = peakGrad1;
    ctx.fillRect(0, 0, width, stdHeight);

    // Cyan radiant blur sphere
    const peakGrad2 = ctx.createRadialGradient(40 * scale, 350 * scale, 0, 40 * scale, 350 * scale, 180 * scale);
    peakGrad2.addColorStop(0, hexToRgba('#60A5FA', 0.35));
    peakGrad2.addColorStop(1, 'transparent');
    ctx.fillStyle = peakGrad2;
    ctx.fillRect(0, 0, width, stdHeight);

    // Accent radiant blur sphere
    const peakGrad3 = ctx.createRadialGradient(40 * scale, 40 * scale, 0, 40 * scale, 40 * scale, 160 * scale);
    peakGrad3.addColorStop(0, hexToRgba(accent, 0.40));
    peakGrad3.addColorStop(1, 'transparent');
    ctx.fillStyle = peakGrad3;
    ctx.fillRect(0, 0, width, stdHeight);
    ctx.restore();
  }

  // Draw background details for Love in the air
  if (isLove) {
    ctx.save();
    ctx.fillStyle = hexToRgba('#F43F5E', 0.08);
    drawHeartPath(ctx, 40 * scale, 120 * scale, 32 * scale, 30 * scale);
    ctx.fillStyle = hexToRgba('#F43F5E', 0.05);
    drawHeartPath(ctx, 280 * scale, 60 * scale, 24 * scale, 22 * scale);
    drawHeartPath(ctx, 60 * scale, 450 * scale, 20 * scale, 18 * scale);
    ctx.fillStyle = hexToRgba('#F43F5E', 0.07);
    drawHeartPath(ctx, 260 * scale, 320 * scale, 38 * scale, 35 * scale);
    ctx.restore();
  }

  // Draw background details for Garden berries
  if (isGarden) {
    ctx.save();
    const lilacGrad = ctx.createLinearGradient(0, 0, width, stdHeight);
    lilacGrad.addColorStop(0, '#F3E8FF');
    lilacGrad.addColorStop(0.5, '#FAF5FF');
    lilacGrad.addColorStop(1, '#EDE9FE');
    ctx.fillStyle = lilacGrad;
    ctx.fillRect(0, 0, width, stdHeight);

    ctx.font = `${24 * scale}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("🌸", 298 * scale, 48 * scale);
    ctx.fillText("🍇", 16 * scale, 160 * scale);
    ctx.fillText("🍓", 298 * scale, 340 * scale);
    ctx.fillText("🌺", 16 * scale, 450 * scale);
    ctx.restore();
  }

  // Draw background details for Tech Motion
  if (isTech) {
    ctx.save();
    ctx.fillStyle = '#060814';
    ctx.fillRect(0, 0, width, stdHeight);

    // Neon-blue glow centered below the header lightbar
    const glowGrad = ctx.createRadialGradient(width / 2, stdHeight / 2, 0, width / 2, stdHeight / 2, 130 * scale);
    glowGrad.addColorStop(0, 'rgba(34, 211, 238, 0.14)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, stdHeight);

    ctx.fillStyle = 'rgba(34, 211, 238, 0.08)';
    const dotSpacing = 14 * scale;
    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = 0; y < stdHeight; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Technical crosshair in the center of background
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
    ctx.lineWidth = 1 * scale;
    const cX = width / 2;
    const cY = stdHeight * 0.45;
    ctx.beginPath();
    ctx.moveTo(cX - 10 * scale, cY); ctx.lineTo(cX + 10 * scale, cY);
    ctx.moveTo(cX, cY - 10 * scale); ctx.lineTo(cX, cY + 10 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cX, cY, 4 * scale, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.lineWidth = 1.5 * scale;
    const pad = 12 * scale;
    const len = 15 * scale;
    ctx.beginPath();
    ctx.moveTo(pad + len, pad); ctx.lineTo(pad, pad); ctx.lineTo(pad, pad + len);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width - pad - len, pad); ctx.lineTo(width - pad, pad); ctx.lineTo(width - pad, pad + len);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pad + len, stdHeight - pad); ctx.lineTo(pad, stdHeight - pad); ctx.lineTo(pad, stdHeight - pad - len);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width - pad - len, stdHeight - pad); ctx.lineTo(width - pad, stdHeight - pad); ctx.lineTo(width - pad, stdHeight - pad - len);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(4 * scale, stdHeight / 2 - 12 * scale, 3 * scale, 24 * scale);
    ctx.strokeRect(width - 7 * scale, stdHeight / 2 - 12 * scale, 3 * scale, 24 * scale);

    ctx.fillStyle = '#22D3EE';
    ctx.fillRect(width * 0.2, 0, width * 0.6, 2.5 * scale);
    ctx.restore();
  }

  // Draw background details for Creative fest
  if (isCreative) {
    ctx.save();
    const shapeGrad1 = ctx.createRadialGradient(20 * scale, 60 * scale, 0, 20 * scale, 60 * scale, 130 * scale);
    shapeGrad1.addColorStop(0, 'rgba(236, 72, 153, 0.18)');
    shapeGrad1.addColorStop(1, 'transparent');
    ctx.fillStyle = shapeGrad1;
    ctx.fillRect(0, 0, width, stdHeight);

    const shapeGrad2 = ctx.createRadialGradient(300 * scale, 300 * scale, 0, 300 * scale, 300 * scale, 150 * scale);
    shapeGrad2.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
    shapeGrad2.addColorStop(1, 'transparent');
    ctx.fillStyle = shapeGrad2;
    ctx.fillRect(0, 0, width, stdHeight);

    const shapeGrad3 = ctx.createRadialGradient(80 * scale, 480 * scale, 0, 80 * scale, 480 * scale, 160 * scale);
    shapeGrad3.addColorStop(0, 'rgba(139, 92, 246, 0.20)');
    shapeGrad3.addColorStop(1, 'transparent');
    ctx.fillStyle = shapeGrad3;
    ctx.fillRect(0, 0, width, stdHeight);

    ctx.fillStyle = '#EC4899';
    ctx.font = `bold ${14 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("✦", 285 * scale, 80 * scale);
    ctx.fillStyle = '#8B5CF6';
    ctx.fillText("★", 25 * scale, 210 * scale);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText("✦", 295 * scale, 360 * scale);
    ctx.fillStyle = '#EC4899';
    ctx.fillText("★", 35 * scale, 480 * scale);
    ctx.restore();
  }

  // Draw background details for Healing organic bloom
  if (isBloom) {
    ctx.save();
    ctx.font = `${18 * scale}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("🌸", 290 * scale, 100 * scale);
    ctx.fillText("🌿", 25 * scale, 120 * scale);
    ctx.fillText("🍃", 295 * scale, 400 * scale);
    ctx.fillText("🌺", 25 * scale, 460 * scale);
    ctx.fillText("🌼", 280 * scale, 280 * scale);
    ctx.restore();
  }

  // 1. Draw Header Section clip & background
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, headerHeight);
  ctx.clip();

  if (isGlass) {
    // Glass overlay gradient shine
    const glassGrad = ctx.createLinearGradient(0, 0, width, headerHeight);
    glassGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
    glassGrad.addColorStop(1, 'rgba(255,255,255,0.03)');
    ctx.fillStyle = glassGrad;
    ctx.fill();
  } else if (event.template === 'OBSIDIAN') {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, headerHeight);
    // Accent left stripe
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 6 * scale, headerHeight);
  } else if (event.template === 'NEON') {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, headerHeight);
    
    // Ambient back neon accent glow
    const glowRad = 150 * scale;
    const glowGrad = ctx.createRadialGradient(width, 0, 10 * scale, width, 0, glowRad);
    glowGrad.addColorStop(0, hexToRgba(accent, 0.28));
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(width, 0, glowRad, 0, Math.PI * 2);
    ctx.fill();
  } else if (isBloom) {
    // Soft organic tint blend
    ctx.fillStyle = colorMixHex(accent, '#FCFAF5', 8);
    ctx.fillRect(0, 0, width, headerHeight);
  } else if (isLove) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, headerHeight);
    const grad = ctx.createRadialGradient(width / 2, headerHeight / 2, 0, width / 2, headerHeight / 2, 200 * scale);
    grad.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, headerHeight);
  } else if (isGarden) {
    const grad = ctx.createLinearGradient(0, 0, width, headerHeight);
    grad.addColorStop(0, '#F3E8FF');
    grad.addColorStop(1, '#FAF5FF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, headerHeight);
  } else if (isTech) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, headerHeight);
    const grad = ctx.createRadialGradient(width, 0, 10 * scale, width, 0, 180 * scale);
    grad.addColorStop(0, hexToRgba(accent, 0.25));
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, headerHeight);
  } else if (isCreative) {
    const grad = ctx.createLinearGradient(0, 0, width, headerHeight);
    grad.addColorStop(0, '#FAF5FF');
    grad.addColorStop(1, '#FFF1F2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, headerHeight);
  } else if (event.template === 'AURORA') {
    // Aurora spectrum layout
    const grad = ctx.createLinearGradient(0, 0, width, headerHeight);
    grad.addColorStop(0, bg);
    // Mimics the smooth northern lights gradient mapping
    const midAccent = hexToRgba(accent, 0.22);
    const grad2 = ctx.createRadialGradient(0, 0, 50 * scale, 100 * scale, 100 * scale, 220 * scale);
    grad2.addColorStop(0, accent);
    grad2.addColorStop(0.5, '#1E1A3C');
    grad2.addColorStop(1, '#060412');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, headerHeight);
  } else if (isRomance) {
    // Elegant warm gradients
    const graceGrad = ctx.createLinearGradient(0, 0, width, headerHeight);
    graceGrad.addColorStop(0, '#FFFDF9');
    graceGrad.addColorStop(1, '#F5EFF2');
    ctx.fillStyle = graceGrad;
    ctx.fillRect(0, 0, width, headerHeight);
  } else {
    // CLASSIC CANVAS
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, headerHeight);
  }

  // Draw optional custom banner photo background if uploaded
  if (event.bannerUrl) {
    try {
      const bannerImg = await loadImage(event.bannerUrl);
      ctx.drawImage(bannerImg, 0, 0, width, headerHeight);
      
      // Fine dark overlay to make texts pop clearly
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, width, headerHeight);
    } catch (e) {
      console.warn('Canvas Exporter banner load skipped', e);
    }
  }

  // Draw delicate hairline frames inside Romance cards
  if (isRomance) {
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(8 * scale, 8 * scale, width - 16 * scale, headerHeight - 16 * scale);
  }

  // Draw Bloom vectors
  if (isBloom) {
    ctx.save();
    ctx.fillStyle = hexToRgba(accent, 0.05);
    ctx.beginPath();
    ctx.arc(width, headerHeight, 60 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore(); // header clip reset

  // 2. Draw Body Background
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, headerHeight, width, perfY - headerHeight);
  ctx.clip();

  if (isGlass) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  } else if (isBloom) {
    ctx.fillStyle = '#FCFAF5';
  } else if (isRomance) {
    ctx.fillStyle = '#FFFDF5';
  } else if (isLove) {
    ctx.fillStyle = '#3B0007';
  } else if (isGarden) {
    ctx.fillStyle = '#FCFBFE';
  } else if (isTech) {
    ctx.fillStyle = '#020409';
  } else if (isCreative) {
    ctx.fillStyle = '#FCFAFF';
  } else if (event.template === 'NEON') {
    ctx.fillStyle = '#0C0D18';
  } else if (event.template === 'OBSIDIAN') {
    ctx.fillStyle = '#1A1B1D';
  } else if (event.template === 'AURORA') {
    ctx.fillStyle = '#12102E';
  } else {
    ctx.fillStyle = bg;
  }
  ctx.fillRect(0, headerHeight, width, perfY - headerHeight);

  // Inner lines for Romance body
  if (isRomance) {
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 0.8 * scale;
    ctx.strokeRect(8 * scale, headerHeight + 5 * scale, width - 16 * scale, perfY - headerHeight - 10 * scale);
  }

  ctx.restore();

  // 3. Draw Bottom QR Stub background
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, perfY, width, stdHeight - perfY);
  ctx.clip();

  if (isGlass) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  } else if (isBloom) {
    ctx.fillStyle = '#F0E9DF';
  } else if (isRomance) {
    ctx.fillStyle = '#F5EFE0';
  } else if (isLove) {
    ctx.fillStyle = '#2D0005';
  } else if (isGarden) {
    ctx.fillStyle = '#F3E8FF';
  } else if (isTech) {
    ctx.fillStyle = '#010205';
  } else if (isCreative) {
    ctx.fillStyle = '#F5EEFF';
  } else if (event.template === 'NEON') {
    ctx.fillStyle = '#060710';
  } else if (event.template === 'OBSIDIAN') {
    ctx.fillStyle = '#0F1012';
  } else if (event.template === 'AURORA') {
    ctx.fillStyle = '#08061C';
  } else {
    ctx.fillStyle = bg;
  }
  ctx.fillRect(0, perfY, width, stdHeight - perfY);

  if (isRomance) {
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.lineWidth = 0.8 * scale;
    ctx.strokeRect(8 * scale, perfY + 5 * scale, width - 16 * scale, stdHeight - perfY - 10 * scale);
  }

  ctx.restore();

  // 4. Draw Perforation semicircles and dotted line
  ctx.save();
  ctx.fillStyle = getPageBgBackup();
  
  // Left cutout
  ctx.beginPath();
  ctx.arc(0, perfY, 12 * scale, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  
  // Right Cutout
  ctx.beginPath();
  ctx.arc(width, perfY, 12 * scale, Math.PI / 2, (3 * Math.PI) / 2);
  ctx.fill();

  // DASHED LINE
  ctx.strokeStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1 * scale;
  ctx.setLineDash([4 * scale, 5 * scale]);
  ctx.beginPath();
  ctx.moveTo(12 * scale, perfY);
  ctx.lineTo(width - 12 * scale, perfY);
  ctx.stroke();
  ctx.restore();

  // 5. DRAW HEADER LABELS & LOGO
  ctx.save();
  let headerTextColor = event.brandTextColor || '#FFFFFF';
  if (!event.brandTextColor) {
    if (isBloom && !event.bannerUrl) {
      headerTextColor = `color-mix(in srgb, ${accent} 80%, black)`;
    } else if (isCanvas && !event.bannerUrl) {
      headerTextColor = '#2C2621';
    } else if (isRomance && !event.bannerUrl) {
      headerTextColor = '#2C1B04';
    } else if (isLove && !event.bannerUrl) {
      headerTextColor = '#FEE2E2';
    } else if (isGarden && !event.bannerUrl) {
      headerTextColor = '#4C1D95';
    } else if (isTech && !event.bannerUrl) {
      headerTextColor = '#E0F2FE';
    } else if (isCreative && !event.bannerUrl) {
      headerTextColor = '#1E1B4B';
    }
  }
  ctx.fillStyle = headerTextColor;

  // Render organization logo or icon
  let orgXOffset = 20 * scale;
  if (event.logoUrl) {
    try {
      const logoImg = await loadImage(event.logoUrl);
      const aspect = logoImg.width / logoImg.height;
      const hHeight = 18 * scale;
      const hWidth = hHeight * aspect;
      ctx.drawImage(logoImg, orgXOffset, 16 * scale, hWidth, hHeight);
      orgXOffset += hWidth + 8 * scale;
    } catch (e) {
      console.warn('Canvas Exporter logo load skipped', e);
    }
  } else {
    // Draw pretty default vector stamp
    ctx.fillStyle = isBloom ? hexToRgba(accent, 0.3) : 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(orgXOffset, 15 * scale, 18 * scale, 18 * scale, 4 * scale);
    ctx.fill();
    
    ctx.strokeStyle = headerTextColor;
    ctx.lineWidth = 1.2 * scale;
    ctx.beginPath();
    ctx.arc(orgXOffset + 9 * scale, 15 * scale, 2.5 * scale, 0, Math.PI);
    ctx.stroke();
    orgXOffset += 26 * scale;
  }

  // Draw Organizer details text
  ctx.fillStyle = headerTextColor;
  ctx.font = isRomance || isCanvas || isLove ? `600 ${9.5 * scale}px "Georgia", serif` : isTech ? `600 ${9.5 * scale}px "Courier New", monospace` : `600 ${10 * scale}px "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(event.organizerName || 'Trmn Event', orgXOffset, 24 * scale);

  // Badge Text far right
  const badgeText = event.badgeText || attendee.type || 'General';
  ctx.font = `bold ${8.5 * scale}px "Inter", sans-serif`;
  const badgeWidth = ctx.measureText(badgeText).width + 12 * scale;
  const badgeHeight = 18 * scale;
  const badgeX = width - badgeWidth - 20 * scale;
  const badgeY = 15 * scale;

  if (event.brandTextColor) {
    ctx.fillStyle = hexToRgba(event.brandTextColor, 0.09);
    ctx.strokeStyle = event.brandTextColor;
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 9 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = event.brandTextColor;
  } else {
    ctx.fillStyle = isRomance ? '#FFFDF9' : isLove ? '#991B1B' : isGarden ? '#F3E8FF' : isTech ? '#1E3A8A' : isCreative ? '#EDE9FE' : '#FFFFFF';
    ctx.beginPath();
    if (isRomance) {
      ctx.strokeStyle = 'rgba(212,175,55,0.4)';
      ctx.lineWidth = 0.5 * scale;
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 9 * scale);
      ctx.fill();
      ctx.stroke();
    } else if (isLove) {
      ctx.strokeStyle = 'rgba(244,63,94,0.3)';
      ctx.lineWidth = 0.5 * scale;
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 9 * scale);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 9 * scale);
      ctx.fill();
    }
    ctx.fillStyle = isLove ? '#FECDD3' : isGarden ? '#701A75' : isTech ? '#38BDF8' : isCreative ? '#7C3AED' : accent;
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);

  // Admit one tag
  ctx.fillStyle = event.brandTitleColor || event.brandTextColor || (isBloom ? `color-mix(in srgb, ${accent} 80%, black)` : isCanvas ? '#292524' : isLove ? '#FDA4AF' : isGarden ? '#6B21A8' : isTech ? '#67E8F9' : isCreative ? '#4F46E5' : '#FFFFFF');
  ctx.globalAlpha = 0.75;
  ctx.font = `bold ${8 * scale}px "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('ADMIT ONE PASS', 20 * scale, headerHeight - 34 * scale);
  ctx.globalAlpha = 1.0;

  // Title of Event name
  ctx.fillStyle = event.brandTitleColor || headerTextColor;
  ctx.font = isCanvas || isRomance || isLove ? `700 ${17 * scale}px "Georgia", serif` : isTech ? `700 ${17 * scale}px "Courier New", monospace` : isCreative ? `900 ${18 * scale}px "Inter", sans-serif` : `700 ${18 * scale}px "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  
  let rawEventName = event.name || 'Branded Workshop Class';
  if (isCreative) rawEventName = rawEventName.toUpperCase();
  const maxEventNameWidth = width - 40 * scale;
  let dispEventName = rawEventName;
  if (ctx.measureText(dispEventName).width > maxEventNameWidth) {
    while (ctx.measureText(dispEventName + '...').width > maxEventNameWidth) {
      dispEventName = dispEventName.substring(0, dispEventName.length - 1);
    }
    dispEventName += '...';
  }
  ctx.fillText(dispEventName, 20 * scale, headerHeight - 12 * scale);
  ctx.restore();

  // 6. DRAW CARD DETAILS (Guest holder and Venue/Time)
  ctx.save();
  let textPrimary = event.brandContentColor || event.brandTextColor || '#0F172A';
  let textSecondary = event.brandContentColor ? hexToRgba(event.brandContentColor, 0.7) : (event.brandTextColor ? hexToRgba(event.brandTextColor, 0.7) : '#64748B');

  if (!event.brandContentColor && !event.brandTextColor) {
    if (isBloom) {
      textPrimary = `color-mix(in srgb, ${accent} 85%, black)`;
      textSecondary = '#5D5347';
    } else if (event.template === 'NEON') {
      textPrimary = '#FFFFFF';
      textSecondary = '#8E8BA7';
    } else if (event.template === 'OBSIDIAN') {
      textPrimary = '#FFFFFF';
      textSecondary = '#8E8BA7';
    } else if (event.template === 'AURORA') {
      textPrimary = '#FFFFFF';
      textSecondary = '#8E8BA7';
    } else if (isRomance) {
      textPrimary = '#372004';
      textSecondary = '#70593B';
    } else if (isCanvas) {
      textPrimary = '#292524';
      textSecondary = '#564E46';
    } else if (isLove) {
      textPrimary = '#FFFFFF';
      textSecondary = '#FDA4AF';
    } else if (isGarden) {
      textPrimary = '#2E1065';
      textSecondary = '#5B21B6';
    } else if (isTech) {
      textPrimary = '#06B6D4';
      textSecondary = '#8E8BA7';
    } else if (isCreative) {
      textPrimary = '#312E81';
      textSecondary = '#6366F1';
    }
  }

  // Label Holder
  ctx.fillStyle = textSecondary;
  ctx.font = isRomance || isCanvas || isLove ? `bold ${8 * scale}px "Georgia", serif` : isTech ? `bold ${8 * scale}px "Courier New", monospace` : `bold ${8 * scale}px "Inter", sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText('PASS HOLDER', 20 * scale, headerHeight + 15 * scale);

  // Holder Name
  ctx.fillStyle = textPrimary;
  ctx.font = isCanvas || isRomance || isLove ? `italic 700 ${17 * scale}px "Georgia", serif` : isTech ? `700 ${17 * scale}px "Courier New", monospace` : isCreative ? `900 ${17 * scale}px "Inter", sans-serif` : `700 ${17 * scale}px "Inter", sans-serif`;
  let holderName = attendee.name || 'Yemi Adebayo';
  if (isCreative) holderName = holderName.toUpperCase();
  ctx.fillText(holderName, 20 * scale, headerHeight + 28 * scale);

  // Timings and Location details
  ctx.fillStyle = event.brandContentColor ? event.brandContentColor : (event.brandTextColor ? hexToRgba(event.brandTextColor, 0.85) : (isBloom ? '#3C443D' : isRomance ? '#5C4E3A' : isCanvas ? '#44403C' : isLove ? '#FECDD3' : isGarden ? '#5B21B6' : isTech ? '#E0F2FE' : isCreative ? '#4F46E5' : isDarkTheme ? '#CBD5E1' : '#334155'));
  ctx.font = isRomance || isCanvas || isLove ? `500 ${11 * scale}px "Georgia", serif` : isTech ? `500 ${11 * scale}px "Courier New", monospace` : `500 ${11 * scale}px "Inter", sans-serif`;
  ctx.fillText(formatPassDate(event.dateTime) || 'Saturday, 14 June 2026', 20 * scale, headerHeight + 58 * scale);
  ctx.fillText(event.venue || 'Maitama Community Gardens', 20 * scale, headerHeight + 76 * scale);
  ctx.restore();

  // 7. DRAW RESPONSIVE QR CODE FRAME inside stub height
  ctx.save();
  const qrSize = 102 * scale; // Enlarged QR Code frame size request
  const qrX = (width - qrSize) / 2;
  const qrY = perfY + 12 * scale;

  // Background white box representing QR mounting frame
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = (() => {
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
  })();
  ctx.lineWidth = 1.5 * scale;
  
  ctx.beginPath();
  ctx.roundRect(qrX, qrY, qrSize, qrSize, 8 * scale);
  ctx.fill();
  ctx.stroke();

  const passIdStr = attendee.passId || 'EVT-2026-DEMO99';
  const attendeeIdStr = attendee.id || 'demo-id';
  const hmacStr = attendee.hmacSignature || 'demohmac';
  const protocolStr = window.location.protocol;
  const hostStr = window.location.host;
  const verificationUrl = `${protocolStr}//${hostStr}?scannerCheck=true&eventId=${event.id}&attendeeId=${attendeeIdStr}&hmac=${hmacStr}&name=${encodeURIComponent(attendee.name || '')}&type=${encodeURIComponent(attendee.type || '')}`;

  try {
    const tempCanvas = document.createElement('canvas');
    await QRCode.toCanvas(tempCanvas, verificationUrl, {
      margin: 1,
      width: qrSize - 6 * scale,
      errorCorrectionLevel: 'H',
      color: {
        dark: ['NEON', 'TECH_MOTION'].includes(event.template) ? '#000000' : event.template === 'OBSIDIAN' ? '#FFFFFF' : '#0F0E17',
        light: '#FFFFFF',
      },
    });

    ctx.drawImage(tempCanvas, qrX + 3 * scale, qrY + 3 * scale, qrSize - 6 * scale, qrSize - 6 * scale);
  } catch (qrErr) {
    console.error('Failed drawing QR onto export Canvas context:', qrErr);
    ctx.fillStyle = '#000000';
    ctx.fillRect(qrX + 6 * scale, qrY + 6 * scale, qrSize - 12 * scale, qrSize - 12 * scale);
  }

  // Draw Ticket ID text centered under the expanded QR framework
  ctx.fillStyle = event.brandContentColor ? event.brandContentColor : (event.brandTextColor ? hexToRgba(event.brandTextColor, 0.70) : (isBloom ? '#8B8276' : isRomance ? '#9F8D75' : isLove ? '#FDA4AF' : isGarden ? '#7C3AED' : isTech ? '#67E8F9' : isCreative ? '#7C3AED' : isDarkTheme ? '#787596' : '#94A3B8'));
  ctx.font = `bold ${8.5 * scale}px "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`PASS ID: ${passIdStr}`.toUpperCase(), width / 2, qrY + qrSize + 16 * scale);

  ctx.restore();

  return canvas;
}

// Color mixing and configuration helpers
function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
    : 'rgba(99,102,241,0.2)';
}

function colorMixHex(color1: string, color2: string, weightPct: number): string {
  const c1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color1) || ['', '63', '66', 'f1'];
  const c2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color2) || ['', 'ff', 'ff', 'ff'];
  
  const w = weightPct / 100;
  const mix = (idx: number) => {
    const v1 = parseInt(c1[idx], 16);
    const v2 = parseInt(c2[idx], 16);
    return Math.round(v1 * w + v2 * (1 - w)).toString(16).padStart(2, '0');
  };
  return '#' + mix(1) + mix(2) + mix(3);
}

function getPageBgBackup(): string {
  const isDarkSaved = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDarkSaved ? '#0D0C1A' : '#F7F6F3';
}
