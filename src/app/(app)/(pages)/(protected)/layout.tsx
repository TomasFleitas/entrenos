'use client';

import { useAuth } from '@/app/provider/authContext';
import { redirect } from 'next/navigation';
import { Menu } from '../../components/menu';
import style from './index.module.scss';
import { Suspense } from 'react';
import { SuspenseFallback } from '../../components/suspenseFallback';

export default function ProtectedLayout({ children }: CommonReactProps) {
  const { user } = useAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <div className={style.content}>{children}</div>
      <Menu />
    </Suspense>
  );
}
