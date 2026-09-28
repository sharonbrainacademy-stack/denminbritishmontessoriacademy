import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, GraduationCap } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAStatus: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [dismissBanner, setDismissBanner] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      {/* Offline Alert Indicator */}
      {!isOnline && (
        <div className="bg-[#0B3D27] text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-xl fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-50 rounded-2xl border-2 border-[#D4AF37]">
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-4 h-4 text-[#D4AF37] animate-pulse shrink-0" />
            <span>You are offline. Showing cached Denmin British Montessori resources.</span>
          </div>
        </div>
      )}

      {/* In-App Install Prompt Banner */}
      {!isInstalled && deferredPrompt && !dismissBanner && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0B3D27] text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3.5 border-2 border-[#D4AF37] max-w-sm transition-all duration-300">
          <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center p-1.5 border border-[#D4AF37] shadow-inner shrink-0 overflow-hidden">
            <img
              src="/icon-192.png"
              alt="Denmin British Icon"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to graduation cap icon if image not available
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37]">Install PWA</h4>
              <span className="text-[9px] bg-emerald-900 px-1.5 py-0.5 rounded text-emerald-200">Offline App</span>
            </div>
            <p className="text-xs font-bold text-white mt-0.5">Denmin British Montessori</p>
            <p className="text-[11px] text-emerald-100/90 leading-tight">Install app for instant offline access to CBT exams, results, and attendance.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleInstallClick}
              className="bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1 shadow-md shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setDismissBanner(true)}
              className="text-white/60 hover:text-white p-1 rounded-md"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
