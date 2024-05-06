'use client';

import style from './index.module.scss';
import { Button } from 'antd';
import { AMOUNTS_OPTIONS } from '@/utils/const';
import { useAuth } from '@/app/provider/authContext';
import { useDonation } from '@/app/hook/useDonation';
import { MoneyIcon } from '@/app/(app)/components/icons';
import { MercadoPagoWarning } from '@/app/(app)/components/mercadoPagoWarning';

export default function HomePage() {
  const { user } = useAuth();
  const { sendDonation, sending } = useDonation();

  return (
    <div className={style.home}>
      <h1>
        {(user?.isFirstDonation && 'Realiza tu primera colaboración.') ||
          'Continúa colaborando.'}
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
      <MercadoPagoWarning />
    </div>
  );
}
