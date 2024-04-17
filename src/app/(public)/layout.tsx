import { Header } from './components/header';
import style from './index.module.scss';

export default function PublicLayout({ children }: CommonReactProps) {
  return (
    <>
      <Header />
      <section className={style.section}>{children}</section>
    </>
  );
}
