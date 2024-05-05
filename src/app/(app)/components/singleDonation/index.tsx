import { UserAvatar } from '../userAvatar';
import style from './index.module.scss';
import { MoneyIcon } from '../icons';
import { SingleDonation } from '@/app/hook/useDonation';
import { forwardRef } from 'react';

export const SingleDonationItem = forwardRef<
  HTMLDivElement,
  { donation: SingleDonation }
>(({ donation }, ref) => {
  return (
    <div ref={ref} className={style.donation}>
      <div>
        <UserAvatar {...donation.user.avatar} />
        {donation.user.name}
      </div>
      <div>
        <MoneyIcon /> <p className={style.money}>{donation.amount}</p>
      </div>
    </div>
  );
});
