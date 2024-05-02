'use client';

import { Button } from 'antd';
import style from './index.module.scss';
import { useMercadoPago } from '@/app/hook/useMercadoPago';
import { useAuth } from '@/app/provider/authContext';
import { MercadoPago } from '../icons';
import { MercadoPagoAccount } from '../mercadoPagoAccount';

export const ConnectMercadoPago = () => {
  const { mpConnected } = useAuth();
  const { connectAccount, disconnectAccount, loading } = useMercadoPago();

  return (
    <div className={style.configuration}>
      {mpConnected ? (
        <>
          <MercadoPagoAccount />
          <Button
            loading={loading}
            block
            type="default"
            danger
            shape="round"
            onClick={disconnectAccount}
            icon={<MercadoPago height={15} width={'auto'} />}
          >
            DESCONECTAR CUENTA
          </Button>
        </>
      ) : (
        <Button
          block
          type="default"
          loading={loading}
          shape="round"
          onClick={connectAccount}
          icon={<MercadoPago height={15} width={'auto'} />}
        >
          CONECTAR CUENTA
        </Button>
      )}
    </div>
  );
};
