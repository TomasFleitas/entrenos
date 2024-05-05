'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', {
          scope: '/firebase-cloud-messaging-push-scope',
        })
        .then(() => null)
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);

  return null;
}
