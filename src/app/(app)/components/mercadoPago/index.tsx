'use client';

import { Button } from 'antd';
import style from './index.module.scss';
import { useMercadoPago } from '@/app/hook/useMercadoPago';
import { useAuth } from '@/app/provider/authContext';

export const ConnectMercadoPago = () => {
  const { mpConnected } = useAuth();
  const { connectAccount, disconnectAccount } = useMercadoPago();

  return (
    <div className={style.configuration}>
      {mpConnected ? (
        <Button danger onClick={disconnectAccount}>
          DESCONECTAR CUENTA
        </Button>
      ) : (
        <Button onClick={connectAccount}>CONECTAR CUENTA</Button>
      )}
    </div>
  );
};
