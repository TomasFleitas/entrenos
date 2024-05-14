'use client';

import { useAuth } from '@/app/provider/authContext';
import style from './index.module.scss';
import { Button } from 'antd';
import { GoogleIcon } from '@/app/(app)/components/icons';
import { useRecaptcha } from '@/app/hook/useRecaptcha';

export default function LoginPage() {
  const { signInWithGoogle, isLogin } = useAuth();
  const { loading, allowed, Captcha } = useRecaptcha();

  return (
    <div className={style.login}>
      <Button
        icon={<GoogleIcon height={25} width={25} />}
        loading={isLogin || loading}
        disabled={!allowed}
        onClick={()=>allowed && signInWithGoogle()}
      >
        INICIAR SESIÓN
      </Button>
      {Captcha}
    </div>
  );
}
