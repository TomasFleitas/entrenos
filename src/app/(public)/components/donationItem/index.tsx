import React from 'react';
import style from './index.module.scss';
import { TDonation } from '@/app/hook/useDonationListener';

type Props = {
  donation: TDonation;
};

export const DonationItem = ({ donation }: Props) => {
  return (
    <div className={style['donation']}>
      <div>{donation.donor.name}</div>
      <div>$ {donation.amount}</div>
      <div>{donation.recipient.name}</div>
    </div>
  );
};
