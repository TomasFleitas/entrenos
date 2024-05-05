'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  User,
  onAuthStateChanged,
  signOut as logout,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
} from 'firebase/auth';

import { auth, getToken, messaging, onMessage } from '@/utils/firebase';
import axiosInstance from '@/services';
import {
  RequestInterceptor,
  ResponseInterceptor,
  setToken,
} from '@/services/interceptors';
import { Loading } from '../components/loading';

type TAuthContext = {
  user?: User | null;
  isLogged: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
  updateUser: (user: User) => void;
  isLogin: boolean;
  mpConnected: boolean;
  isUpdating: boolean;
};

const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

type AuthData =
  | {
      init: boolean;
      user?: User;
    }
  | undefined;

export function AuthProvider({ children }: CommonReactProps) {
  const [authData, setAuthData] = useState<AuthData>({ init: false });

  const [isUpdating, setUpdating] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    let unsubscribeRequest: () => void;
    let unsubscribeResponse: () => void;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await setPersistence(auth, browserLocalPersistence);
        setToken(await user.getIdToken());

        const token = await getNotificationToken();

        await updateUser({
          email: user.email,
          defaultName: user.displayName,
          notificationToken: token,
        });
        unsubscribeRequest = RequestInterceptor(user.getIdToken.bind(user));
        unsubscribeResponse = ResponseInterceptor(user.getIdToken.bind(user));
      } else {
        setAuthData({ init: true });
      }
      setIsLogin(false);
    });

    onPushNotification();

    return () => {
      unsubscribe();
      unsubscribeRequest?.();
      unsubscribeResponse?.();
    };
  }, []);

  const onPushNotification = () => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log(payload);
      });
    }
  };

  const getNotificationToken = async () => {
    if (messaging) {
      return await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_PUSH_NOTIFICATION,
      });
    }
  };

  const updateUser = async ({
    seed,
    ...data
  }: Partial<User & { seed: string; notificationToken?: string }>) => {
    setUpdating(true);
    const avatar = { seed };

    const isAvatar = Object.values(avatar).filter(Boolean).length;

    const { user: updatedUser } =
      (
        await axiosInstance
          .put('/api/user', {
            ...data,
            ...(isAvatar && { avatar }),
          })
          .catch(() => null)
      )?.data || {};

    setAuthData((prev) => {
      const newUser: AuthData = {
        init: true,
        user: { ...prev?.user, ...updatedUser },
      };

      if (!Object.values(newUser).filter(Boolean).length) {
        return { init: false };
      }

      return newUser;
    });

    setUpdating(false);
  };

  const signInWithGoogle = useCallback(async () => {
    setIsLogin(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.log(error);
      setIsLogin(false);
    }
  }, []);

  const signOut = useCallback(() => logout(auth), []);

  const value = useMemo(
    () => ({
      user: authData?.user,
      mpConnected: !!authData?.user?.mpConnected,
      isLogged: !!authData?.user,
      signInWithGoogle,
      signOut,
      isLogin,
      updateUser,
      isUpdating,
    }),
    [authData?.user?.updatedAt, isLogin, isUpdating],
  );

  if (!authData?.init) {
    return <Loading />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
