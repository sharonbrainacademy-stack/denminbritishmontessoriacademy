import React, { useState, useEffect } from 'react';
import { Download, Check, Sparkles } from 'lucide-react';

export const PWAStatus: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable && !isInstalled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full shadow-lg transition transform hover:scale-105"
        >
          <Download className="w-4 h-4 text-emerald-300" />
          <span>Install School App</span>
        </button>
      )}
      {isInstalled && (
        <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-emerald-400 text-[11px] rounded-full border border-slate-700 shadow">
          <Check className="w-3.5 h-3.5" /> Sharon Brain PWA Active
        </span>
      )}
    </div>
  );
};
