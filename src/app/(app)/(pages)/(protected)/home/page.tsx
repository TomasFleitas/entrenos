'use client';

import style from './index.module.scss';
import { Button } from 'antd';
import { AMOUNTS_OPTIONS } from '@/utils/const';
import { useAuth } from '@/app/provider/authContext';
import { useDonation } from '@/app/hook/useDonation';
import { MoneyIcon } from '@/app/(app)/components/icons';

export default function HomePage() {
  const { user } = useAuth();
  const { sendDonation, sending } = useDonation();

  const isFirst = !user?.donations?.length;

  return (
    <div className={style.home}>
      <h1>
        {(isFirst && 'Realiza tu primera donación') || 'Envía más donaciones'}
      </h1>
      <div className={style.amounts}>
        {AMOUNTS_OPTIONS.map((value) => (
          <Button
            loading={sending}
            key={value}
            icon={<MoneyIcon />}
            onClick={() => sendDonation(value)}
            className={style.donation}
          >
            {value}
          </Button>
        ))}
      </div>
      {sending && (
        <p className={style['info-text']}>
          Estamos buscando al mejor candidato...
        </p>
      )}
    </div>
  );
}
