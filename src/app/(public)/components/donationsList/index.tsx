import React from 'react';
import { DonationItem } from '../donationItem';
import style from './index.module.scss';
import { useDonationWatch } from '@/app/hook/useDonationListener';
import { LoadingOutlined } from '@ant-design/icons';

const DonationList = () => {
  const { donations } = useDonationWatch();
  return (
    <div
      className={`${style['donation-list']} ${
        !donations.length ? style['hidden'] : ''
      }`}
    >
      {(!donations.length && (
        <LoadingOutlined className={style.loading} spin />
      )) ||
        donations.map((donation) => (
          <DonationItem
            donation={donation}
            key={`${donation.timestamp} - ${donation.amount} - ${donation.donor.name} - ${donation.recipient.name}`}
          />
        ))}
    </div>
  );
};

export default DonationList;
