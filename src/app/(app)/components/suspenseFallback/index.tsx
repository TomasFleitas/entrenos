import { LottieComponent } from '@/app/components/lottie';
import style from './index.module.scss';

export const SuspenseFallback = () => {
  return (
    <div className={style['suspense-fallback']}>
      <LottieComponent />
    </div>
  );
};
