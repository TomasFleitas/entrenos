'use client';

import { useAuth } from '@/app/provider/authContext';
import { redirect } from 'next/navigation';

export default function NonProtectedLayout({ children }: CommonReactProps) {
  const { user } = useAuth();

  if (user) {
    redirect('/home');
  }

  return children;
}
