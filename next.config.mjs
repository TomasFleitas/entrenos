/** @type {import('next').NextConfig} */
import config from 'next-pwa';

const withPWA = config({
  dest: 'public',
});

export default withPWA();
