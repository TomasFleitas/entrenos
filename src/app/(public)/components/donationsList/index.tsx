import React from 'react';
import { DonationItem } from '../donationItem';
import style from './index.module.scss';
import { useDonationWatch } from '@/app/hook/useDonationListener';

const DonationList = () => {
  const { donations } = useDonationWatch();
  return (
    <div className={style['donation-list']}>
      {donations.map((donation) => (
        <DonationItem
          donation={donation}
          key={`${donation.timestamp} - ${donation.amount} - ${donation.donor.name} - ${donation.recipient.name}`}
        />
      ))}
    </div>
  );
};

export default DonationList;
