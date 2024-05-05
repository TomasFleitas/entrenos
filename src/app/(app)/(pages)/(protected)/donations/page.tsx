'use client';

import { useDonation } from '@/app/hook/useDonation';
import { useEffect, useState } from 'react';
import style from './index.module.scss';
import { Select, FloatButton } from 'antd';
import { SingleDonationItem } from '@/app/(app)/components/singleDonation';
import { useObservable } from '@/app/hook/useObservable';
import { LoadingOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function DonationsPage() {
  const [direction, setDirection] = useState<'received' | 'sent'>('sent');
  const [size, setPageSize] = useState<number>(10);
  const { getDonations, donations, loading } = useDonation();
  const { ref } = useObservable({
    onVisible: () => {
      getDonations({
        size,
        type: direction,
      });
    },
  });

  useEffect(() => {
    getDonations({ size, type: direction });
  }, [direction, size]);

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
          defaultValue={size}
          value={size}
          variant="borderless"
          onChange={setPageSize}
        >
          <Option value={10}>10</Option>
          <Option value={25}>25</Option>
          <Option value={50}>50</Option>
        </Select>
      </div>
      {(loading && !donations.length && (
        <LoadingOutlined className={style.loading} spin />
      )) || (
        <div className={style.list}>
          {donations.map((donation, index) => {
            if (index === donations.length - 5) {
              return (
                <SingleDonationItem
                  ref={ref}
                  key={donation.id}
                  donation={donation}
                />
              );
            }
            return <SingleDonationItem key={donation.id} donation={donation} />;
          })}
          {loading && <LoadingOutlined className={style.loading} spin />}
          <FloatButton.BackTop />
        </div>
      )}
    </div>
  );
}
