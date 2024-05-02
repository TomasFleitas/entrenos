import MercadoPagoConfig from 'mercadopago';

export const getMercadoPagoClient = () => {
  return new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    options: { timeout: 15000 },
  });
};
