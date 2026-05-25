import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Check } from 'lucide-react';

interface EventImageUploaderProps {
  logoUrl?: string;
  bannerUrl?: string;
  onChange: (updates: { logoUrl?: string | null; bannerUrl?: string | null }) => void;
}

export function EventImageUploader({ logoUrl, bannerUrl, onChange }: EventImageUploaderProps) {
  const [dragActiveLogo, setDragActiveLogo] = useState(false);
  const [dragActiveBanner, setDragActiveBanner] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // File parsers
  const processFile = (file: File, target: 'logo' | 'banner') => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target?.result as string;
      if (target === 'logo') {
        onChange({ logoUrl: b64 });
      } else {
        onChange({ bannerUrl: b64 });
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag listeners
  const handleDrag = (e: React.DragEvent, target: 'logo' | 'banner', status: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (target === 'logo') {
      setDragActiveLogo(status);
    } else {
      setDragActiveBanner(status);
    }
  };

  const handleDrop = (e: React.DragEvent, target: 'logo' | 'banner') => {
    e.preventDefault();
    e.stopPropagation();
    if (target === 'logo') {
      setDragActiveLogo(false);
    } else {
      setDragActiveBanner(false);
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], target);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], target);
    }
  };

  const handleClear = (e: React.MouseEvent, target: 'logo' | 'banner') => {
    e.stopPropagation();
    if (target === 'logo') {
      onChange({ logoUrl: null });
      if (logoInputRef.current) logoInputRef.current.value = '';
    } else {
      onChange({ bannerUrl: null });
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* SECTION LABEL */}
      <div>
        <h4 className="text-[10.5px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
          Pass Identity
        </h4>
        <p className="text-[11px] text-slate-500">
          Upload custom graphics to make your passes look distinctly hand-crafted.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LOGO DROPZONE (Compact aspect/square) */}
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Event Logo
          </span>
          
          <div
            onClick={() => logoInputRef.current?.click()}
            onDragOver={(e) => handleDrag(e, 'logo', true)}
            onDragLeave={(e) => handleDrag(e, 'logo', false)}
            onDrop={(e) => handleDrop(e, 'logo')}
            className={`cursor-pointer h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all relative overflow-hidden select-none group min-h-[110px] ${
              dragActiveLogo
                ? 'border-violet-500 bg-violet-500/5'
                : logoUrl
                  ? 'border-emerald-500/40 bg-slate-950'
                  : 'border-slate-200 hover:border-violet-400 dark:border-indigo-950/40 dark:hover:border-violet-500/40 bg-slate-50/20 dark:bg-slate-900/10'
            }`}
          >
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleInputChange(e, 'logo')}
            />

            {logoUrl ? (
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-between p-4">
                <img
                  src={logoUrl}
                  alt="Uploaded event logo"
                  className="absolute inset-0 w-full h-full object-contain p-2 brightness-[0.35] shrink-0 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                <div className="relative z-10 flex items-center gap-3 overflow-hidden text-white">
                  <div className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center bg-white/10 shrink-0">
                    <UploadCloud className="w-5 h-5 text-violet-300" />
                  </div>
                  <div className="text-left space-y-0.5 overflow-hidden">
                    <span className="text-[9.5px] font-extrabold text-violet-350 flex items-center gap-1 drop-shadow-sm font-sans">
                      <Check className="w-3 h-3" /> LOGO READY
                    </span>
                    <p className="text-[11px] font-bold text-white truncate drop-shadow-sm leading-tight font-sans">
                      Custom Logo Active
                    </p>
                    <p className="text-[9px] text-zinc-300 uppercase font-mono tracking-wider drop-shadow-sm">
                      reflects in ticket header
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pr-1">
                  <button
                    type="button"
                    onClick={(e) => handleClear(e, 'logo')}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-red-600/70 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                    title="Clear Logo File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-1 touch-target-height-pad">
                <div className="inline-flex py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-indigo-950/40 shadow-sm text-slate-400 group-hover:text-violet-500 transition-colors">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-1">
                  <strong className="text-violet-500 dark:text-violet-400 font-bold">Click to upload</strong> or drag logo file here
                </div>
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">
                  PNG, SVG, WEBP (transparent suggested)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* COVER BANNER DROPZONE (Wide aspect preview) */}
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Event Cover Banner Card Photo
          </span>

          <div
            onClick={() => bannerInputRef.current?.click()}
            onDragOver={(e) => handleDrag(e, 'banner', true)}
            onDragLeave={(e) => handleDrag(e, 'banner', false)}
            onDrop={(e) => handleDrop(e, 'banner')}
            className={`cursor-pointer h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all relative overflow-hidden select-none group min-h-[110px] ${
              dragActiveBanner
                ? 'border-violet-500 bg-violet-500/5'
                : bannerUrl
                  ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                  : 'border-slate-200 hover:border-violet-400 dark:border-indigo-950/40 dark:hover:border-violet-500/40 bg-slate-50/20 dark:bg-slate-900/10'
            }`}
          >
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleInputChange(e, 'banner')}
            />

            {bannerUrl ? (
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-between">
                {/* Full-bleed card preview aspect */}
                <img
                  src={bannerUrl}
                  alt="Cover Banner preview background"
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.4] shrink-0 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                <div className="relative z-10 px-4 py-2 flex items-center gap-3 overflow-hidden text-white">
                  <div className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center bg-white/10 shrink-0">
                    <ImageIcon className="w-5 h-5 text-indigo-200" />
                  </div>
                  <div className="text-left space-y-0.5 overflow-hidden">
                    <span className="text-[9.5px] font-extrabold text-indigo-300 flex items-center gap-1 drop-shadow-sm font-sans">
                      <Check className="w-3 h-3" /> PASS COVER READY
                    </span>
                    <p className="text-[11px] font-bold text-white truncate drop-shadow-sm leading-tight">
                      Banner Image Active
                    </p>
                    <p className="text-[9px] text-zinc-300 uppercase font-mono tracking-wider drop-shadow-sm">
                      Full-bleed pass header background
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pr-4">
                  <button
                    type="button"
                    onClick={(e) => handleClear(e, 'banner')}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-red-600/70 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                    title="Clear Cover Banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-1 touch-target-height-pad">
                <div className="inline-flex py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-indigo-950/40 shadow-sm text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-1">
                  <strong className="text-violet-500 dark:text-violet-400">Click to upload</strong> or drag cover photo here
                </div>
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">
                  High-res cover art (horizontal suggested)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
