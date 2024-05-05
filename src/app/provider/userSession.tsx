'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { messaging, onMessage } from '@/utils/firebase';
import { notification } from 'antd';

type TNotification = {};

const NotificationContext = createContext<TNotification>({} as TNotification);

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: CommonReactProps) {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message?: string, description?: string) => {
    api.info({
      message,
      description,
      placement: 'top',
    });
  };

  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        openNotification(
          payload?.notification?.title,
          payload?.notification?.body,
        );
      });
    }
  }, []);

  const value = useMemo(() => ({}), []);

  return (
    <NotificationContext.Provider value={value}>
      <>
        {contextHolder}
        {children}
      </>
    </NotificationContext.Provider>
  );
}
