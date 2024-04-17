'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type TPreferences = {
  isOpenMenu: boolean;
};

type TUserPreferenceContext = {
  openMenu: (open: boolean) => void;
  preferences: TPreferences;
};

const UserPreferenceContext = createContext<TUserPreferenceContext>(
  {} as TUserPreferenceContext,
);

export function useUserPreference() {
  return useContext(UserPreferenceContext);
}

export function UserPreference({ children }: CommonReactProps) {
  const [preferences, setPreferences] = useState({
    isOpenMenu: false,
  });

  const openMenu = useCallback((isOpenMenu: boolean) => {
    setPreferences((prev) => ({ ...prev, isOpenMenu }));
  }, []);

  const value = useMemo(
    () => ({ preferences, openMenu }),
    Object.values(preferences),
  );

  return (
    <UserPreferenceContext.Provider value={value}>
      {children}
    </UserPreferenceContext.Provider>
  );
}
