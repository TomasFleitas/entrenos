import { useEffect, useState } from 'react';

export const useObservable = ({ onVisible }: { onVisible: () => void }) => {
  const [ref, setRef] = useState<any>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible();
        }
      },
      { threshold: 0.1 },
    );

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      ref && observer.unobserve(ref);
    };
  }, [ref]);

  return { ref: setRef };
};
