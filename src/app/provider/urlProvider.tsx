'use client';

import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';

type TUrl = {};

const UrlContext = createContext<TUrl>({} as TUrl);

export function useUrl() {
  return useContext(UrlContext);
}

export function UrlProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const invitedBy = urlParams.get('invitedBy');
      if (invitedBy) {
        sessionStorage.setItem('invitedBy', invitedBy);
      }
    }
  }, []);

  const value = useMemo(() => ({}), []);

  return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>;
}
