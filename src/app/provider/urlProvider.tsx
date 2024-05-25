'use client';

import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
  useState,
} from 'react';

type TUrl = {
  invitedBy?: string;
};

const UrlContext = createContext<TUrl>({} as TUrl);

export function useInvite() {
  return useContext(UrlContext);
}

export function InviteProvider({ children }: { children: ReactNode }) {
  const [invitedBy, setInvitedBy] = useState<string>();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const invitedBy = urlParams.get('friend');
      if (invitedBy) {
        sessionStorage.setItem('invitedBy', invitedBy);
        setInvitedBy(invitedBy);
      }
    }
  }, []);

  const value = useMemo(() => ({ invitedBy }), [invitedBy]);

  return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>;
}
