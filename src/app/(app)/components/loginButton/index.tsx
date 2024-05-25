'use client';

import { GoogleIcon } from '@/app/(app)/components/icons';
import { useRecaptcha } from '@/app/hook/useRecaptcha';
import { useAuth } from '@/app/provider/authContext';
import { Button } from 'antd';
import style from "./index.module.scss"

export const LoginButton = ({
  label,
  onlyButton = false,
}: {
  label?: string;
  onlyButton?: boolean;
}) => {
  const { signInWithGoogle, isLogin } = useAuth();
  const { loading, allowed, Captcha } = useRecaptcha();

  return (
    <>
      <Button
        icon={<GoogleIcon height={25} width={25} />}
        loading={isLogin || loading}
        disabled={!allowed}
        className={onlyButton ? style['only-button'] : ''}
        onClick={() => allowed && signInWithGoogle()}
      >
        {!onlyButton ? label || 'INICIAR SESIÓN' : null}
      </Button>
      {Captcha}
    </>
  );
};
