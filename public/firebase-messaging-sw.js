importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
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

const APP_BASE_URL = `https://entrenos.app`;

if (messaging) {
  try {
    messaging.onBackgroundMessage(async (payload) => {
      const notificationTitle = payload.notification.title;

      // Fetch the friend's avatar to use as the notification icon
      let icon = payload.notification?.image;
      if (!icon && payload.data.friendId) {
        try {
          const response = await fetch(
            `${APP_BASE_URL}/api/get-friend/${payload.data.friendId}`,
          );
          if (response.ok) {
            const friendData = await response.json();
            const { avatarStyle, seed } = friendData?.friend?.avatar || {};
            icon = `https://api.dicebear.com/8.x/${
              avatarStyle || 'lorelei'
            }/svg?seed=${seed}`;
          }
        } catch (error) {
          console.error('Failed to fetch friend avatar', error);
        }
      }

      const notificationOptions = {
        body: payload.notification.body,
        tag: notificationTitle,
        icon,
        data: {
          url: payload?.data?.openUrl,
        },
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions,
      );
    });

    self.addEventListener('notificationclick', (event) => {
      event.notification.close();
      const url = event.notification.data.url || APP_BASE_URL;
      if (url) {
        event.waitUntil(
          clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
              for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                  return client.focus();
                }
              }
              if (clients.openWindow) {
                return clients.openWindow(url);
              }
            }),
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
}
