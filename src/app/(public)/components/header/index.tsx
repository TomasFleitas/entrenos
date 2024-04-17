import React from 'react';
import style from './index.module.scss';
import Link from 'next/link';

export const Header = () => {
  return (
    <div className={style['header']}>
      PublicHeader
      <Link href="/login">Entrar</Link>
    </div>
  );
};
