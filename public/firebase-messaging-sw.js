importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);

const apiKey = 'AIzaSyAPmVDNhCZIE6rTseGOp8gz8xq43jGH6OM';
const authDomain = 'entrenos-c3514.firebaseapp.com';
const projectId = 'entrenos-c3514';
const storageBucket = 'entrenos-c3514.appspot.com';
const messagingSenderId = '902553761023';
const appId = '1:902553761023:web:e3ec3ab7e256c4294d08ca';

firebase.initializeApp(
  {
    /* apiKey,
    authDomain,
    projectId,
    storageBucket, */
    messagingSenderId,
    /* appId, */
  },
  'EntreNos',
);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
