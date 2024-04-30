'use client';

import { useDonation } from '@/app/hook/useDonation';
import React, { useEffect } from 'react';

export default function DonationsPage() {
  const { getDonations, donations } = useDonation();

  useEffect(() => {
    getDonations({ pageSize: 11 });
  }, []);

  console.log(donations);

  return (
    <div>
      <h4>Donaciones enviadas</h4>
    </div>
  );
}
