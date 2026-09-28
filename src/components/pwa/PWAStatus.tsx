import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X } from 'lucide-react';

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
        <div className="bg-[#4a1478] text-white px-4 py-2 text-sm font-medium flex items-center justify-between shadow-md fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-50 rounded-xl border border-purple-400/30">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>You are offline. Showing cached Light Up resources.</span>
          </div>
        </div>
      )}

      {/* In-App Install Prompt Banner */}
      {!isInstalled && deferredPrompt && !dismissBanner && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#4a1478] text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-purple-300/30 max-w-sm transition-all duration-300">
          <img
            src="/icon-192.png"
            alt="Light Up Icon"
            className="w-10 h-10 rounded-xl shadow-inner border border-white/20"
          />
          <div className="flex-1 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-200">Install App</h4>
            <p className="text-xs text-white/90">Install Light Up Prayer House for quick offline access.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleInstallClick}
              className="bg-amber-400 hover:bg-amber-300 text-[#4a1478] px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
            <button
              onClick={() => setDismissBanner(true)}
              className="text-white/70 hover:text-white p-1 rounded-md"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
