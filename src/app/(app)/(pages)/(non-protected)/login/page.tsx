'use client';

import { useAuth } from '@/app/provider/authContext';
import style from './index.module.scss';
import { Button } from 'antd';

export default function LoginPage() {
  const { signInWithGoogle, isLogin } = useAuth();

  return (
    <div className={style.login}>
      <Button loading={isLogin} onClick={signInWithGoogle}>
        Iniciar Sesión
      </Button>
    </div>
  );
}
