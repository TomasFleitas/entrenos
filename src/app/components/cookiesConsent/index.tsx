'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './index.module.scss';

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setShowConsent(false);
  };

  const handleCancel = () => {
    setShowConsent(false);
  };

  return (
    <div
      className={`${styles.cookieConsent} ${showConsent ? styles.show : ''}`}
    >
      <p>
        Usamos cookies para mejorar tu experiencia en nuestro sitio. Al aceptar,
        aceptas nuestra{' '}
        <a href="#" className={styles.link}>
          política de cookies
        </a>
        .
      </p>
      <div className={styles.buttonContainer}>
        <button onClick={handleAccept}>Aceptar</button>
        <button onClick={handleCancel} className={styles.cancelButton}>
          Cancelar
        </button>
      </div>
    </div>
  );
};
