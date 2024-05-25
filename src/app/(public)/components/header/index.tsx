import style from './index.module.scss';
import Link from 'next/link';
import { Logo } from '@/app/components/logo';

export const Header = () => {
  return (
    <div className={style['header']}>
      <Logo />
      <Link href="/login">ENTRAR</Link>
    </div>
  );
};
