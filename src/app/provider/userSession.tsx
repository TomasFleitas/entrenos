'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { messaging, onMessage } from '@/utils/firebase';
import { notification } from 'antd';

type TUserSession = {};

const UserSessionContext = createContext<TUserSession>({} as TUserSession);

export function useSession() {
  return useContext(UserSessionContext);
}

export function UserSessionProvider({ children }: CommonReactProps) {
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
    <UserSessionContext.Provider value={value}>
      <>
        {contextHolder}
        {children}
      </>
    </UserSessionContext.Provider>
  );
}
