import axiosInstance from '@/services';
import { messaging } from '@/utils/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import React, { useEffect, useState } from 'react';

type Notification = {
  title?: string;
  body?: string;
};

const RequestPermission = () => {
  const [notification, setNotification] = useState<Notification>({});

  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        setNotification({
          title: payload?.notification?.title,
          body: payload?.notification?.body,
        });
      });
    }
  }, []);

  const requestPermission = async () => {
    if (!messaging) {
      console.warn('Firebase Messaging is not supported in this browser.');
      return;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_PUSH_NOTIFICATION,
      });
      if (token) {
        console.log('FCM token:', token);
        await axiosInstance.put('/api/user', {
          notificationToken: token,
        });
      } else {
        console.log(
          'No registration token available. Request permission to generate one.',
        );
      }
    } catch (error) {
      console.log('An error occurred while retrieving token. ', error);
    }
  };

  return (
    <div>
      <button onClick={requestPermission}>Enable Notifications</button>
      {notification.title && (
        <div>
          <h4>Notification</h4>
          <p>{notification.title}</p>
          <p>{notification.body}</p>
        </div>
      )}
    </div>
  );
};

export default RequestPermission;
