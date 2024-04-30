'use client';

import { useCallback, useRef, useState } from 'react';
import axiosInstance from '@/services';

export const useDonation = () => {
  const lock = useRef(false);
  const [donations, setDonations] = useState([]);

  const sendDonation = useCallback(async (amount: number) => {
    const { url } = (await axiosInstance.post('/api/donate', { amount })).data;
    window.location.href = url;
  }, []);

  const getDonations = useCallback(
    async (params?: { lastDonationId?: number; pageSize?: number }) => {
      if (!lock.current) {
        lock.current = true;
        setDonations(
          (await axiosInstance.get('/api/donations', { params })).data
            ?.donations,
        );
        lock.current = false;
      }
    },
    [],
  );

  return { sendDonation, getDonations, donations };
};
