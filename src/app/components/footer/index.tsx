import React from 'react';
import style from './index.module.scss';

export const Footer = () => {
  return (
    <footer className={style['footer']}>
      Copyright &copy; {new Date().getFullYear()}
    </footer>
  );
};
