import React from 'react';
import style from './index.module.scss';
import { TDonation } from '@/app/hook/useDonationListener';
import { ArrowRightOutlined } from '@ant-design/icons';

type Props = {
  donation: TDonation;
};

export const DonationItem = ({ donation }: Props) => {
  return (
    <div className={style['donation']}>
      <div>
        <div>
          <h3>{donation.donor.name}</h3>
        </div>
        <div>
          <ArrowRightOutlined />
        </div>
        <div>
          <h3>{donation.recipient.name}</h3>
        </div>
      </div>
      <div>
        <h1>$ {donation.amount}</h1>
      </div>
    </div>
  );
};
