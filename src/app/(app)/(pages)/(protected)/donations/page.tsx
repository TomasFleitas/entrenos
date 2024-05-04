'use client';

import { useDonation } from '@/app/hook/useDonation';
import { useEffect, useState } from 'react';
import style from './index.module.scss';
import { Select } from 'antd';
import { SingleDonationItem } from '@/app/(app)/components/singleDonation';

const { Option } = Select;

export default function DonationsPage() {
  const [direction, setDirection] = useState<'received' | 'sent'>('sent');
  const [pageSize, setPageSize] = useState<number>(10);
  const { getDonations, donations } = useDonation();

  useEffect(() => {
    getDonations({ pageSize, type: direction });
  }, [direction, pageSize]);

  return (
    <div className={style['donation-list']}>
      <div className={style.filters}>
        <Select
          defaultValue={direction}
          value={direction}
          variant="borderless"
          onChange={setDirection}
        >
          <Option value="sent">Enviadas</Option>
          <Option value="received">Recibidas</Option>
        </Select>
        <Select
          defaultValue={pageSize}
          value={pageSize}
          variant="borderless"
          onChange={setPageSize}
        >
          <Option value={10}>10</Option>
          <Option value={25}>25</Option>
          <Option value={50}>50</Option>
        </Select>
      </div>
      <div>
        {donations.map((donation) => (
          <SingleDonationItem key={donation.id} donation={donation} />
        ))}
      </div>
    </div>
  );
}
