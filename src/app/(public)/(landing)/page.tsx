'use client';

import Link from 'next/link';
import DonationList from '../components/donationsList';
import style from './index.module.scss';

export default function LandingPage() {
  return (
    <div className={style.landing}>
      <div>
        <h1>¡Colabora con personas de todo el país!</h1>
        <p>
          Únete a nuestra red solidaria en tiempo real. Cada donación cuenta y
          podría ser para ti. Mientras más dones, más oportunidades tendrás de
          recibir. ¡Únete ahora y forma parte de esta cadena de generosidad!
        </p>
        <Link href={'/login'}>
          Hazte miembro y comienza a colaborar y recibir ayuda
        </Link>
      </div>
      <DonationList />
    </div>
  );
}
