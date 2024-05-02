'use client';

import { Avatar, Typography } from 'antd';
import { useAuth } from '@/app/provider/authContext';
import style from './index.module.scss';

export const MercadoPagoAccount = () => {
  const { user } = useAuth();

  if (!user?.mercadoPagoAccount) return <></>;

  const { thumbnailUrl, firstName, lastName, userName } =
    user?.mercadoPagoAccount;

  return (
    <div>
      <Avatar src={thumbnailUrl} />
      <Typography.Title level={4} className={style.name}>
        {firstName ?? ''} {lastName ?? ''}
      </Typography.Title>
      <p className={style['user-name']}>{userName}</p>
    </div>
  );
};
