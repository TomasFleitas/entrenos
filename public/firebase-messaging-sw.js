importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);

self.addEventListener('fetch', () => {
  try {
    const urlParams = new URLSearchParams(location.search);
    self.firebaseConfig = Object.fromEntries(urlParams);
  } catch (err) {
    console.error('Failed to add event listener', err);
  }
});

const defaultConfig = {
  apiKey: 'AIzaSyAPmVDNhCZIE6rTseGOp8gz8xq43jGH6OM',
  projectId: 'entrenos-c3514',
  messagingSenderId: '902553761023',
  appId: '1:902553761023:web:e3ec3ab7e256c4294d08ca',
};

firebase.initializeApp(self.firebaseConfig || defaultConfig);

let messaging;
try {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
} catch (err) {
  console.error('Failed to initialize Firebase Messaging', err);
}

if (messaging) {
  try {
    messaging.onBackgroundMessage((payload) => {
      const notificationTitle = payload.notification.title;

      const notificationOptions = {
        body: payload.notification.body,
        tag: notificationTitle,
        icon: payload.notification?.image,
        data: {
          url: payload?.data?.openUrl,
        },
      };

      if (payload?.collapseKey && payload.notification?.image) {
        self.registration.showNotification(
          notificationTitle,
          notificationOptions,
        );
      } else {
        return new Promise(function (resolve, reject) {});
      }
    });
  } catch (err) {
    console.log(err);
  }
}
