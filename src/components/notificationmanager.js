'use client';
import { useEffect } from 'react';

export default function NotificationManager({ userId }) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log("✅ Service worker registered", registration);

        // Wait for the service worker to be ready
        const swRegistration = await navigator.serviceWorker.ready;

        const subscription = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          ),
        });

        console.log("✅ Push subscribed", subscription);

        await fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify({ subscription, userId }),
        });
      } catch (error) {
        console.error("❌ Error in SW registration or subscription:", error);
      }
    };

    register();
  }, [userId]);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    return new Uint8Array([...raw].map((char) => char.charCodeAt(0)));
  };

  return null;
}
