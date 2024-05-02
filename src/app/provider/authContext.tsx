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
  signInWithRedirect,
  signOut as logout,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

import { auth } from '@/utils/firebase';
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
  getUserFromDB: () => void;
  signOut: () => void;
  updateUser: (user: User) => void;
  isLogin: boolean;
  mpConnected: boolean;
};

const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: CommonReactProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    let unsubscribeRequest: () => void;
    let unsubscribeResponse: () => void;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(false);

      if (user) {
        await setPersistence(auth, browserLocalPersistence);

        setToken(await user.getIdToken());

        await updateUser({
          email: user.email,
          defaultName: user.displayName,
        });

        unsubscribeRequest = RequestInterceptor(user.getIdToken.bind(user));
        unsubscribeResponse = ResponseInterceptor(user.getIdToken.bind(user));
      } else {
        setUser(user);
      }

      setIsLogin(false);
    });

    return () => {
      unsubscribe();
      unsubscribeRequest?.();
      unsubscribeResponse?.();
    };
  }, []);

  const updateUser = async ({
    seed,
    ...data
  }: Partial<User & { seed: string }>) => {
    const avatar = { seed };

    const isAvatar = Object.values(avatar).filter(Boolean).length;

    const { user: updatedUser } = (
      await axiosInstance.put('/api/user', {
        ...data,
        ...(isAvatar && { avatar }),
      })
    ).data;

    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const getUserFromDB = useCallback(async () => {
    const { user } = (await axiosInstance.get('/user')).data;
    setUser((prev) => ({ ...prev, ...user }));
    return user;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLogin(true);
    try {
      await signInWithRedirect(auth, new GoogleAuthProvider());
    } catch (error) {
      console.log(error);
      setIsLogin(false);
    }
  }, []);

  const signOut = useCallback(() => logout(auth), []);

  const value = useMemo(
    () => ({
      user,
      mpConnected: !!user?.mercadoPago,
      isLogged: !!user,
      signInWithGoogle,
      getUserFromDB,
      signOut,
      isLogin,
      updateUser,
    }),
    [user?.uid, user?.updatedAt, isLogin],
  );

  if (loading && value.isLogged) {
    return <Loading />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
