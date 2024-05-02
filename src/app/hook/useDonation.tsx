'use client';

import { useCallback, useRef, useState } from 'react';
import axiosInstance from '@/services';
import { useNotify } from './useNotify';

export const useDonation = () => {
  const { openErrorNotify } = useNotify();
  const lock = useRef(false);
  const [donations, setDonations] = useState([]);

  const sendDonation = useCallback(async (amount: number) => {
    const { url } = (await axiosInstance.post('/api/donate', { amount })).data;
    window.location.href = url;
  }, []);

  const getDonations = useCallback(
    async (params?: {
      lastDonationId?: number;
      pageSize?: number;
      type: 'sent' | 'received';
    }) => {
      if (!lock.current) {
        lock.current = true;
        setDonations(
          (
            await axiosInstance
              .get('/api/donations', { params })
              .catch(() => openErrorNotify('Error al buscar persona.'))
          )?.data?.donations,
        );
        lock.current = false;
      }
    },
    [],
  );

  return { sendDonation, getDonations, donations };
};
