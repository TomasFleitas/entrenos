'use client';

import { useCallback, useRef, useState } from 'react';
import axiosInstance from '@/services';
import { useNotify } from './useNotify';
import { TDonation } from './useDonationListener';
import { User } from 'firebase/auth';

type PaginationParams = {
  lastDonationId?: number;
  pageSize?: number;
  type?: 'sent' | 'received';
};

export type SingleDonation = {
  id: string;
  user: {
    name: string;
    avatar: User['avatar'];
  };
  timestamp: Date;
  amount: number;
};

export const useDonation = () => {
  const { openErrorNotify } = useNotify();
  const lock = useRef(false);
  const keepParams = useRef<PaginationParams>({} as PaginationParams);
  const [donations, setDonations] = useState<SingleDonation[]>([]);
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
    async (params?: PaginationParams) => {
      if (!lock.current) {
        let lastDonationId = donations.at(-1)?.id;

        if (
          keepParams.current?.type !== params?.type ||
          keepParams.current?.pageSize !== params?.pageSize
        ) {
          lastDonationId = undefined;
        }

        keepParams.current = { ...params };
        lock.current = true;

        const resp = (
          await axiosInstance
            .get('/api/donations', {
              params: { ...params, lastDonationId },
            })
            .catch(() => null)
        )?.data?.donations;

        setDonations(resp);
        lock.current = false;
      }
    },
    [donations.length],
  );

  return { sendDonation, getDonations, donations, sending };
};
