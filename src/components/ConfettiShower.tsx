/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { useAppTheme } from './ThemeHandler';

interface ConfettiShowerProps {
  trigger: number;
  styleType: 'classic' | 'brand' | 'stars' | 'snow' | 'minimal';
  brandColor?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  shape: 'circle' | 'square' | 'star';
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export function ConfettiShower({ trigger, styleType, brandColor = '#6366F1' }: ConfettiShowerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useAppTheme();

  useEffect(() => {
    if (trigger === 0 || settings.reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const colorsMap = {
      classic: ['#6366F1', '#F97316', '#22C55E', '#F43F5E', '#F59E0B'],
      brand: [brandColor, '#A5B4FC', '#FFFFFF'],
      stars: ['#F59E0B', '#FBBF24', '#FDE68A'],
      snow: ['#E0E7FF', '#C7D2FE', '#FFFFFF'],
      minimal: [settings.theme === 'dark' ? '#F0EFFF' : '#0F0E17', brandColor],
    };

    const selectedColors = colorsMap[styleType] || colorsMap.classic;
    const shapeChoices: ('circle' | 'square' | 'star')[] =
      styleType === 'stars'
        ? ['star']
        : styleType === 'brand'
        ? ['circle', 'square']
        : ['circle', 'square'];

    const gravity = styleType === 'snow' ? 0.08 : 0.25;
    const particleCount = styleType === 'minimal' ? 35 : styleType === 'snow' ? 120 : 150;

    // Initialize particles from the center or spread across top edge depending on style
    for (let i = 0; i < particleCount; i++) {
      const isSnow = styleType === 'snow';
      particles.push({
        x: isSnow ? Math.random() * canvas.width : canvas.width / 2,
        y: isSnow ? -20 - Math.random() * 200 : canvas.height * 0.75, // Spawn from middle-lower quadrant for explosion, or top for snow
        vx: isSnow
          ? (Math.random() - 0.5) * 1.5
          : (Math.random() - 0.5) * 12 + (Math.random() - 0.5) * 3,
        vy: isSnow
          ? Math.random() * 2 + 1
          : -Math.random() * 14 - 5,
        color: selectedColors[Math.floor(Math.random() * selectedColors.length)],
        shape: shapeChoices[Math.floor(Math.random() * shapeChoices.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
      });
    }

    let animationId: number;

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const updateAndRender = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;

      for (let p of particles) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (styleType !== 'snow') {
          p.vx *= 0.98; // Air resistance
          if (p.vy > 0) {
            p.opacity -= 0.008; // Fade out as they fall down
          }
        } else {
          // Wrap snow around edges
          if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }
        }

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'square') {
            ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
          } else if (p.shape === 'star') {
            drawStar(0, 0, 5, p.size * 1.5, p.size * 0.6);
          }

          ctx.restore();
        }
      }

      if (alive) {
        animationId = requestAnimationFrame(updateAndRender);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    updateAndRender();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [trigger, styleType, brandColor, settings.reduceMotion]);

  if (settings.reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
    />
  );
}
