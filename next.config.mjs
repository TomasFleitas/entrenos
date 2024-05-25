/** @type {import('next').NextConfig} */
import config from 'next-pwa';

const withPWA = config({
  dest: 'public',
  disable: false,
});

export default withPWA();
