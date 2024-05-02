import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EntreNos',
  description:
    'EntreNos es una aplicación diseñada para conectar personas de toda la nación, facilitando la ayuda mutua mediante el envío y recepción de dinero de manera aleatoria y segura.',
};

export default function RootLayout({ children }: CommonReactProps) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}