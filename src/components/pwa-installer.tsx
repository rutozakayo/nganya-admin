"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a delay
      setTimeout(() => setIsVisible(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:w-96">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <div className="absolute right-2 top-2">
          <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-start space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Download className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Experience NGANYA HIRE like an app!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Install now for faster access to bookings and availability updates.
            </p>
            <div className="mt-4 flex space-x-2">
              <Button onClick={handleInstall} className="bg-primary text-primary-foreground font-bold">
                Install App
              </Button>
              <Button variant="outline" onClick={() => setIsVisible(false)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
