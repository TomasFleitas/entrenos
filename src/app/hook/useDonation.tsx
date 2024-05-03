'use client';

import { useCallback, useRef, useState } from 'react';
import axiosInstance from '@/services';
import { useNotify } from './useNotify';

export const useDonation = () => {
  const { openErrorNotify } = useNotify();
  const lock = useRef(false);
  const [donations, setDonations] = useState([]);
  const [sending, setSending] = useState(false);

  const sendDonation = useCallback(async (amount: number) => {
    setSending(true);
    const { url } =
      (
        await axiosInstance
          .post('/api/donate', { amount })
          .catch(() => openErrorNotify('Algo salió mal, intente mas tarde.'))
      )?.data || {};

    setSending(false);

    if (url) {
      window.location.href = url;
    }
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

  return { sendDonation, getDonations, donations, sending };
};
