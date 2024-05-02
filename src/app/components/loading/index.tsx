import { LottieComponent } from '../lottie';
import style from './index.module.scss';

export const Loading = () => {
  return (
    <div className={style.loading}>
      <LottieComponent />
    </div>
  );
};
