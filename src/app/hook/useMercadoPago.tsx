'use client';

import { useCallback } from 'react';
import { useAuth } from '../provider/authContext';
import axiosInstance from '@/services';

export const useMercadoPago = () => {
  const { user, updateUser } = useAuth();

  const connectAccount = useCallback(() => {
    window.location.href = `https://auth.mercadopago.com.ar/authorization?client_id=${process.env.NEXT_PUBLIC_MERCADO_PAGO_APP_ID}&response_type=code&state=${user?.uid}&platform_id=mp&redirect_uri=${window.location.origin}${process.env.NEXT_PUBLIC_MERCADO_PAGO_CALLBACK}`;
  }, [user?.uid]);

  const disconnectAccount = useCallback(async () => {
    const { user } = (await axiosInstance.delete('/api/mercadopago')).data;
    updateUser(user);
  }, []);

  return { connectAccount, disconnectAccount };
};
