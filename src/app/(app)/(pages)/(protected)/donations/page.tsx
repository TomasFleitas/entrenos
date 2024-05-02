'use client';

import { useDonation } from '@/app/hook/useDonation';
import React, { useEffect } from 'react';

export default function DonationsPage() {
  const { getDonations, donations } = useDonation();

  useEffect(() => {
    getDonations({ pageSize: 11, type: 'sent' });
  }, []);

  return (
    <div>
      <h4>Donaciones</h4>
    </div>
  );
}
