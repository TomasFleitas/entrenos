import Lottie from 'react-lottie';
import loading from './loading.json';

export const LottieComponent = () => {
  return (
    <Lottie
      options={{
        loop: true,
        autoplay: true,
        animationData: loading,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      }}
      height={200}
      width={400}
    />
  );
};
