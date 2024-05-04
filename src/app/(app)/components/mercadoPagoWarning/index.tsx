import style from './index.module.scss';
import { MercadoPagoIcon } from '../icons';
import { useAuth } from '@/app/provider/authContext';
import { useMercadoPago } from '@/app/hook/useMercadoPago';

export const MercadoPagoWarning = () => {
  const { mpConnected } = useAuth();
  const { connectAccount } = useMercadoPago();

  return (
    (!mpConnected && (
      <div className={style['mercado-pago-warning']}>
        No has configurado tu cuenta de Mercado Pago. Hasta que no la
        configures, no podrás recibir donaciones.
        <div onClick={connectAccount}>
          <MercadoPagoIcon />
        </div>
      </div>
    )) ||
    null
  );
};
