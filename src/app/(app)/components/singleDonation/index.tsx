import { UserAvatar } from '../userAvatar';
import style from './index.module.scss';
import { MoneyIcon } from '../icons';
import { SingleDonation } from '@/app/hook/useDonation';

export const SingleDonationItem = ({
  donation,
}: {
  donation: SingleDonation;
}) => {
  return (
    <div className={style.donation}>
      <div>
        <UserAvatar {...donation.user.avatar} />
        {donation.user.name}
      </div>
      <div>
        <MoneyIcon /> <p className={style.money}>{donation.amount}</p>
      </div>
    </div>
  );
};
