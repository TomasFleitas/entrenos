'use client';

import { useAuth } from '@/app/provider/authContext';
import style from './index.module.scss';
import { Button } from 'antd';
import { GoogleIcon } from '@/app/(app)/components/icons';

export default function LoginPage() {
  const { signInWithGoogle, isLogin } = useAuth();

  return (
    <div className={style.login}>
      <Button
        icon={<GoogleIcon height={25} width={25} />}
        loading={isLogin}
        onClick={signInWithGoogle}
      >
        INICIAR SESIÓN
      </Button>
    </div>
  );
}
