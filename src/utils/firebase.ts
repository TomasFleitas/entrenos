import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  Messaging,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from 'firebase/messaging';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';

import { getId, getInstallations } from 'firebase/installations';

import {
  NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
} from './const';

// Initialize Firebase
const app = !getApps().length
  ? initializeApp(
      {
        apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: NEXT_PUBLIC_FIREBASE_APP_ID,
      },
      NEXT_PUBLIC_APP_NAME,
    )
  : getApp(NEXT_PUBLIC_APP_NAME);

const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting Local persistence:', error);
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error('Error setting Session persistence:', error);
  });
});

const installations = getInstallations(app);

let messaging: Messaging | undefined;

(async () => {
  if (await isSupported()) {
    messaging = getMessaging(app);
  } else {
    console.warn('Firebase Messaging is not supported in this browser.');
  }
})();

const getInstanceId = (): Promise<string> => getId(installations);

export { auth, messaging, getToken, onMessage, getInstanceId };
