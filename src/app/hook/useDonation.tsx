'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/services';

export const useDonation = () => {
  const [donations, setDonations] = useState([]);

  const sendDonation = useCallback(async (amount: number) => {
    const { url } = (await axiosInstance.post('/api/donate', { amount })).data;
    window.location.href = url;
  }, []);

  const getDonations = useCallback(
    async (params?: { lastDonationId?: number; pageSize?: number }) => {
      setDonations(
        (await axiosInstance.get('/api/donations', { params })).data?.donations,
      );
    },
    [],
  );

  return { sendDonation, getDonations, donations };
};
