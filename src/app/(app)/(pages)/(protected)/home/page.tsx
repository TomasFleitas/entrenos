'use client';

import { useDonation } from '@/app/hook/useDonation';
import style from './index.module.scss';
import { Button } from 'antd';
import { useAuth } from '@/app/provider/authContext';
import { AMOUNTS_OPTIONS } from '@/utils/const';

export default function HomePage() {
  const { user } = useAuth();
  const { sendDonation } = useDonation();

  const isFrist = !user?.donations?.length;

  return (
    <div className={style.home}>
      <h1>
        {(isFrist && 'Realizá tu primer donación') || 'Envia mas donaciones'}
      </h1>
      <div className={style.amounts}>
        {AMOUNTS_OPTIONS.map((value) => (
          <Button key={value} onClick={() => sendDonation(value)}>
            {`$ ${value}`}
          </Button>
        ))}
      </div>
    </div>
  );
}
