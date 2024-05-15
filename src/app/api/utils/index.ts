import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { MERCADO_PAGO_WEBHOOK_SECRET } from './const';

export const Response = (data: any = undefined, status = 200) =>
  new NextResponse(data && JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const validateMercadoPagoNotification = (
  headers: Headers,
  dataId: string,
): boolean => {

  if (!MERCADO_PAGO_WEBHOOK_SECRET) {
    return false;
  }

  const xSignatureHeader = headers.get('x-signature') ?? '';
  const xRequestIdHeader = headers.get('x-request-id') ?? '';
  const xSignature: { v1: string; ts: string } = Object.fromEntries(
    xSignatureHeader.split(',').map((entry) => entry.split('=')),
  );
  const signatureTemplateParsed = `id:${dataId};request-id:${xRequestIdHeader};ts:${xSignature?.ts};`;
  const cyphedSignature = crypto
    .createHmac('sha256', MERCADO_PAGO_WEBHOOK_SECRET)
    .update(signatureTemplateParsed)
    .digest('hex');

  return xSignature?.v1 === cyphedSignature;
};
