'use client';

import { useCallback, useRef, useState } from 'react';
import axiosInstance from '@/services';
import { useNotify } from './useNotify';
import { User } from 'firebase/auth';

type PaginationParams = {
  size?: number;
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
  const [loading, setLoading] = useState(false);
  const currentPage = useRef(1);
  const noRecords = useRef(false);

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
        setLoading(true);

        if (
          keepParams.current?.type !== params?.type ||
          keepParams.current?.size !== params?.size
        ) {
          currentPage.current = 1;
          setDonations([]);
        } else if (!noRecords.current) {
          currentPage.current += 1;
        }

        keepParams.current = { ...params };
        lock.current = true;

        const resp = (
          await axiosInstance
            .get('/api/donations', {
              params: { ...params, page: currentPage.current },
            })
            .catch(() => ({
              data: {
                donations: [],
              },
            }))
        )?.data?.donations;

        if ((params?.size || 0) > resp.length + 1) {
          noRecords.current = true;
        } else {
          noRecords.current = false;
        }

        setDonations((prev) => {
          if (currentPage.current > 1) {
            return [...prev, ...resp].filter(
              (value, index, array) =>
                array.findIndex((item) => item.id === value.id) === index,
            );
          }
          return resp;
        });

        setLoading(false);
        lock.current = false;
      }
    },
    [donations?.length],
  );

  return { sendDonation, getDonations, donations, sending, loading };
};
