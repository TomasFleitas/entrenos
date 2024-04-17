'use client';

import { useCallback } from 'react';
import axiosInstance from '@/services';

export const useDonation = () => {
  const sendDonation = useCallback(async (amount: number) => {
    const { url } = (await axiosInstance.post('/api/donate', { amount })).data;
    window.location.href = url;
  }, []);

  return { sendDonation };
};
