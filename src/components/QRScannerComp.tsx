/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { verifyAttendeePass } from '../utils/passHelpers';
import { EventDetails, Attendee } from '../types';
import { Camera, X, CheckCircle, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';

interface QRScannerCompProps {
  event: EventDetails;
  attendeeList: Attendee[];
  onCheckIn: (attendeeId: string) => void;
  onClose: () => void;
}

type ScanState = 'idle' | 'valid' | 'used' | 'invalid';

export function QRScannerComp({ event, attendeeList, onCheckIn, onClose }: QRScannerCompProps) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scannedAttendee, setScannedAttendee] = useState<{ name: string; type: string; info?: string } | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'trmn-qr-scanner';

  useEffect(() => {
    // Start camera
    const qrScanner = new Html5Qrcode(scannerContainerId);
    qrScannerRef.current = qrScanner;

    const startCamera = async () => {
      try {
        setCameraError(null);
        setIsScanning(true);
        await qrScanner.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.65;
              return { width: size, height: size };
            },
          },
          (decodedText) => {
            handleDecodedText(decodedText);
          },
          () => {
            // Quiet fail for scan misses
          }
        );
      } catch (err: any) {
        console.error('Failed to start camera scanner:', err);
        setCameraError(
          err?.message || 'Camera access permissions were denied or camera is currently busy in another tab.'
        );
        setIsScanning(false);
      }
    };

    // Tiny timeout to ensure mount finishes
    const t = setTimeout(() => {
      startCamera();
    }, 150);

    return () => {
      clearTimeout(t);
      if (qrScannerRef.current && qrScannerRef.current.isScanning) {
        qrScannerRef.current.stop().catch((e) => console.error('Failed to stop camera release:', e));
      }
    };
  }, []);

  const handleDecodedText = async (decodedText: string) => {
    // Stop scanning immediately on detection to avoid spam
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      await qrScannerRef.current.stop().catch((e) => console.error(e));
      setIsScanning(false);
    }

    try {
      // Standard query parsing or hash checking
      let checkEventId = '';
      let checkAttendeeId = '';
      let checkHmac = '';
      let checkName = '';
      let checkType = '';

      if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
        const urlObj = new URL(decodedText);
        checkEventId = urlObj.searchParams.get('eventId') || '';
        checkAttendeeId = urlObj.searchParams.get('attendeeId') || '';
        checkHmac = urlObj.searchParams.get('hmac') || '';
        checkName = urlObj.searchParams.get('name') || '';
        checkType = urlObj.searchParams.get('type') || '';
      }

      // 1. Signature check to prevent custom forgery
      const isSignatureValid = verifyAttendeePass(event.id, checkAttendeeId, checkHmac, event.secretKey);

      if (!isSignatureValid || checkEventId !== event.id) {
        setScanState('invalid');
        setScannedAttendee({
          name: checkName || 'Unknown Pass Holder',
          type: checkType || 'INVALID SIGNATURE',
          info: 'Verification signature failed. This is not an authentic ticket pass.',
        });
        return;
      }

      // 2. Find in local register list
      const attendeeInList = attendeeList.find((a) => a.id === checkAttendeeId);
      
      if (!attendeeInList) {
        // Correct signature but not specifically in this attendee registry representation
        setScanState('invalid');
        setScannedAttendee({
          name: checkName,
          type: checkType,
          info: 'Ticket is authenticated under your organization seal, but attendee is not present in this event registry list.',
        });
      } else if (attendeeInList.status === 'checked-in') {
        setScanState('used');
        setScannedAttendee({
          name: attendeeInList.name,
          type: attendeeInList.type,
          info: attendeeInList.checkedInAt
            ? `Checked in at ${new Date(attendeeInList.checkedInAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`
            : 'Already verified previously',
        });
      } else {
        // Valid check in
        setScanState('valid');
        setScannedAttendee({
          name: attendeeInList.name,
          type: attendeeInList.type,
        });
        
        // Trigger check in callback
        onCheckIn(attendeeInList.id);
      }
    } catch (e: any) {
      console.error(e);
      setScanState('invalid');
      setScannedAttendee({
        name: 'Unreadable Pass Code',
        type: 'ERROR',
        info: 'Mangled ticket URL payload, please check pass brightness.',
      });
    }
  };

  const resetScanner = async () => {
    setScanState('idle');
    setScannedAttendee(null);

    // Restart the camera
    if (qrScannerRef.current) {
      try {
        setIsScanning(true);
        await qrScannerRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.65;
              return { width: size, height: size };
            },
          },
          (decodedText) => {
            handleDecodedText(decodedText);
          },
          () => {}
        );
      } catch (err: any) {
        console.error('Failed to restart camera:', err);
        setCameraError(err?.message || 'Failed to re-initialize camera.');
        setIsScanning(false);
      }
    }
  };

  // Status background map matching style guide
  const stateBgs = {
    idle: 'bg-[#0D0C1A]',
    valid: 'bg-[#16A34A]',
    used: 'bg-[#D97706]',
    invalid: 'bg-[#DC2626]',
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between ${stateBgs[scanState]} transition-all duration-300`}>
      {/* ── TOP ACTION BAR ── */}
      <div className="flex justify-between items-center px-5 py-4 bg-black/40 backdrop-blur-md border-b border-white/10 text-white z-10">
        <div className="flex items-center gap-2">
          <Camera className={`w-5 h-5 ${isScanning ? 'animate-pulse text-indigo-400' : ''}`} />
          <span className="font-semibold text-sm tracking-wide">
            {event.name} · Door Check
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
          aria-label="Close Scanner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── SCAN RESULT / VIEWPORT ZONE ── */}
      <div className="flex flex-col items-center justify-center flex-1 p-6 relative">
        {scanState === 'idle' ? (
          <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
            {!cameraError ? (
              <>
                {/* Simulated scanning preview frame */}
                <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-2 border-dashed border-indigo-400/50 flex items-center justify-center bg-slate-900/60 shadow-2xl">
                  {/* Real-time WebCam container */}
                  <div id={scannerContainerId} className="w-full h-full object-cover [&>video]:object-cover" />
                  
                  {/* Subtle focus rect overlays */}
                  <div className="absolute inset-8 border border-indigo-400/20 rounded-lg pointer-events-none"></div>
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-indigo-500 rounded-tl-md"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-indigo-500 rounded-tr-md"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-indigo-500 rounded-bl-md"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-indigo-500 rounded-br-md"></div>
                  
                  {/* Line scanner shimmer indicator */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-bounce opacity-80" style={{ animationDuration: '3s' }} />
                </div>
                
                <div className="space-y-1.5 text-center px-4">
                  <p className="text-white text-base font-semibold">Align Event Pass QR</p>
                  <p className="text-indigo-200/60 text-xs">
                    Aim camera at the QR code located in the bottom-right of the attendee's mobile pass.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-slate-900/80 p-6 rounded-2xl border border-rose-500/30 text-center space-y-4 shadow-xl select-text">
                <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                <div className="space-y-2">
                  <h3 className="text-white text-lg font-bold">Camera Access Error</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{cameraError}</p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={resetScanner}
                    className="btn-primary w-full h-[44px] text-sm bg-rose-600 hover:bg-rose-700 font-semibold"
                  >
                    Grant Camera Access & Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* FULL VIEWPORT TAKEOVER FOR SCAN STATES */
          <div className="w-full text-white text-center space-y-6 max-w-lg px-4 animate-fade-in">
            {scanState === 'valid' && (
              <div className="space-y-6">
                <div className="success-icon mx-auto bg-white/20 border border-white/40 shadow-xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-widest font-bold text-white/80">VALID INTERIOR PASS</p>
                  <h2 className="scan-result-name text-4xl sm:text-5xl md:text-6xl tracking-tight break-words select-text">
                    {scannedAttendee?.name}
                  </h2>
                  <p className="font-semibold text-lg uppercase bg-white/20 inline-block px-3.5 py-0.5 rounded-full backdrop-blur-sm select-text">
                    {scannedAttendee?.type}
                  </p>
                </div>
              </div>
            )}

            {scanState === 'used' && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-white/20 border border-white/40 shadow-xl flex items-center justify-center mx-auto animate-bounce">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-widest font-bold text-white/80">ALREADY SCANNED PASS</p>
                  <h2 className="scan-result-name text-4xl sm:text-5xl md:text-6xl tracking-tight break-words select-text">
                    {scannedAttendee?.name}
                  </h2>
                  <p className="font-semibold text-xs mt-2 text-white/70 select-text">
                    {scannedAttendee?.info}
                  </p>
                </div>
              </div>
            )}

            {scanState === 'invalid' && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-white/20 border border-white/40 shadow-xl flex items-center justify-center mx-auto animate-pulse">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-widest font-bold text-white/80">UNAUTHENTIC PASS</p>
                  <h2 className="scan-result-name text-3xl sm:text-4xl md:text-5xl tracking-tight break-words select-text">
                    {scannedAttendee?.name}
                  </h2>
                  <p className="font-semibold text-[13px] bg-white/10 px-4 py-2.5 rounded-xl block max-w-sm mx-auto select-text leading-snug">
                    {scannedAttendee?.info}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-8">
              <button
                onClick={resetScanner}
                className="scan-next-btn hover:bg-white/30 transition-all font-semibold flex items-center gap-2 mx-auto active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Scan Next Attendee
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTOM BRANDING BAR ── */}
      <div className="hidden sm:flex justify-center items-center py-4 bg-black/20 border-t border-white/5 text-[10px] text-indigo-200/50 font-mono tracking-widest uppercase">
        TRMN SECURITY SUITE v1.0 • HMAC OFFLINE
      </div>
    </div>
  );
}
