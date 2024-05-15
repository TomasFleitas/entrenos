import axiosInstance from '@/services';
import { NEXT_PUBLIC_RECAPTCHA_SITE_KEY } from '@/utils/const';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export const useRecaptcha = () => {
  const lock = useRef(false);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<any>();

  const checkGPT = useCallback(async () => {
    if (!recaptchaRef.current) {
      return;
    }
    lock.current = true;
    setLoading(true);
    try {
      const recaptchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      await axiosInstance.post('/api/captcha', {
        recaptchaToken,
      });
      setAllowed(true);
    } catch (error) {
      console.log(error);
      setAllowed(false);
    } finally {
      setLoading(false);
      lock.current = false;
    }
  }, []);

  useEffect(() => {
    !lock.current && checkGPT();
  }, [checkGPT]);

  const Captcha = (
    <ReCAPTCHA
      sitekey={NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      size="invisible"
      ref={recaptchaRef}
    />
  );

  return { Captcha, loading, allowed };
};
