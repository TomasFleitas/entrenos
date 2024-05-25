import { LoginButton } from '@/app/(app)/components/loginButton';
import style from './index.module.scss';

export default function LoginPage() {
  return (
    <div className={style.login}>
      <LoginButton />
    </div>
  );
}
