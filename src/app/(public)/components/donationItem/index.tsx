import React from 'react';
import style from './index.module.scss';
import { TDonation } from '@/app/hook/useDonationListener';
import { UserAvatar } from '@/app/(app)/components/userAvatar';
import { MoneyIcon } from '@/app/(app)/components/icons';

type Props = {
  donation: TDonation;
};

export const DonationItem = ({ donation }: Props) => {
  return (
    <div
      className={`${style['donation']} ${
        donation.className ? style[donation.className] : ''
      }`}
    >
      <div>
        <UserAvatar
          {...donation.donor.avatar}
          name={donation.donor.name}
          backgroundColor={donation.donor.backgroundColor}
          direction="right"
        />
        {donation.donor.name}
      </div>
      <div>
        <MoneyIcon /> <p className={style.money}>{donation.amount}</p>
      </div>
      <div>
        {donation.recipient.name}
        <UserAvatar
          {...donation.recipient.avatar}
          backgroundColor={donation.recipient.backgroundColor}
          name={donation.recipient.name}
          direction="left"
        />
      </div>
    </div>
  );
};
