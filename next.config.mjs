/** @type {import('next').NextConfig} */

import config from 'next-pwa';

const withPWA = config({
  dest: 'public',
  /* disable: process.env.NODE_ENV === 'development', */
});

export default withPWA();
