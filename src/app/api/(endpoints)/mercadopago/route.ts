import { NextRequest, NextResponse } from 'next/server';
import { Response, validateMercadoPagoNotification } from '../../utils';
import { sendNotification, validateToken } from '../../lib/firebaseAdmin';
import { descomprimirString } from '../../lib';
import { DonationsModel, UsersModel } from '@/app/(app)/mongo';
import {
  APP_BASE_URL,
  MERCADO_PAGO_CLIENT_ID,
  MERCADO_PAGO_CLIENT_SECRET,
  MERCADO_PAGO_REDIRECT_URI,
  MERCADO_PAGO_WEBHOOK,
} from '../../utils/const';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const uid = req.nextUrl.searchParams.get('state');

  const redirectUri = `${APP_BASE_URL}${MERCADO_PAGO_REDIRECT_URI}`;

  if (!code || !uid) {
    /*  return Response({ message: 'Code no provided.' }, 404); */
    console.error('Code no provided.');
    return NextResponse.redirect(redirectUri);
  }

  try {
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: MERCADO_PAGO_CLIENT_ID,
        client_secret: MERCADO_PAGO_CLIENT_SECRET,
        code: code,
        redirect_uri: `${APP_BASE_URL}${MERCADO_PAGO_WEBHOOK}`,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return Response({ message: 'Error connecting with Mercado Pago.' }, 401);
    }

    const user = await UsersModel.findOne({
      'mercadoPago.user_id': data.user_id,
    });

    if (!user) {
      await UsersModel.updateOne(
        { uid },
        {
          mercadoPago: { ...data, updatedAt: new Date() },
          updatedAt: new Date(),
        },
        {
          upsert: true,
        },
      );
    } else {
      await UsersModel.updateOne(
        {
          'mercadoPago.user_id': data.user_id,
        },
        {
          mercadoPago: { ...data, updatedAt: new Date() },
          updatedAt: new Date(),
        },
        {
          new: true,
          upsert: true,
        },
      );
      return Response(
        { message: 'Mercado pago account already connected.' },
        400,
      );
    }

    // TODO VER ESTO
    return NextResponse.redirect(redirectUri);
  } catch (error) {
    console.log(error);
  }
}

// TODO QUE PASA CON LOS TOPIC PAYMENT ? que vienen desde una colleciton
// WEBHOOK
export async function POST(req: NextRequest) {
  try {
    console.log(
      'ID: ',
      req.nextUrl?.searchParams?.get('id'),
      'TOPIC: ',
      req.nextUrl?.searchParams?.get('topic'),
    );
    const webHookData = await req.json();

    if (webHookData.topic === 'merchant_order ') {
      return Response();
    }

    console.log('WebHook MercadoPago - Data:', webHookData);

    const isValidSignature = validateMercadoPagoNotification(
      req.headers,
      req.nextUrl?.searchParams?.get('id') || webHookData?.data?.id,
    );

    if (!isValidSignature) {
      return Response({ message: 'Invalid Mercado Pago signature' }, 401);
    }

    processMercadoPagoWebHook(webHookData);

    return Response();
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return Response({ message: error.message }, error.status);
  }
}

const processMercadoPagoWebHook = async (webHookData: any) => {
  if (['payment.updated', 'payment.created'].includes(webHookData.action)) {
    const isUpdate = webHookData.action === 'payment.updated';

    const paymentId = webHookData.data.id;
    const mpUserId = webHookData.user_id;

    const recipient = await UsersModel.findOne({
      'mercadoPago.user_id': mpUserId,
    });

    const accessToken = recipient?.mercadoPago?.access_token;

    if (!accessToken) {
      console.log('Access Token Not Found, MP User: ', mpUserId);
      return;
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const payment = await response.json();

    console.log('WebHook MercadoPago - Payment:', payment);

    if (payment.status === 404) {
      console.log('Payment Not Found, id: ', paymentId);
      return;
    }

    const externalReference = JSON.parse(
      await descomprimirString(payment.external_reference as string),
    );

    const fee =
      payment.charges_details.find(
        ({ accounts }: any) => accounts.to === 'marketplace_owner',
      )?.amounts?.original || 0;

    const amount = payment.transaction_amount - fee;

    await Promise.all([
      DonationsModel.updateOne(
        { paymentId },
        {
          ...externalReference,
          paymentId,
          amount,
          timestamp: new Date(),
        },
        {
          new: true,
          upsert: true,
        },
      ),
      payment.status === 'approved' &&
        UsersModel.updateOne(
          { uid: externalReference.donorId },
          {
            lastDonationAt: new Date(),
          },
          {
            upsert: true,
          },
        ),
    ]);

    if (!isUpdate) {
      const tokens = Object.values(
        Object.fromEntries(recipient?.notificationTokens || new Map()) as {
          [x: string]: string;
        },
      ).filter(Boolean);

      if (tokens.length) {
        sendNotification(tokens, {
          title: 'Nueva colaboración recibida',
          body: `Has recibido una nueva colaboración por un monto de $${amount}.`,
        });
      }
    }
  }
};

export async function PUT(req: NextRequest) {
  try {
    const { uid } = await req.json();
    const user = await UsersModel.findOne({ uid });

    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: MERCADO_PAGO_CLIENT_ID,
        client_secret: MERCADO_PAGO_CLIENT_SECRET,
        refresh_token: user?.mercadoPago?.refresh_token,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return Response({ message: 'Error refreshing token.' }, 401);
    }

    await UsersModel.updateOne(
      { uid },
      {
        mercadoPago: { ...data, updatedAt: new Date() },
        updatedAt: new Date(),
      },
      {
        upsert: true,
      },
    );

    return Response({ token: data.access_token });
  } catch (error: any) {
    return Response({ message: error.message }, error.status);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const uid = await validateToken(req);

    const user = await UsersModel.findOneAndUpdate(
      { uid },
      {
        mercadoPago: null,
        updatedAt: new Date(),
      },
      {
        upsert: true,
        returnOriginal: false,
      },
    );

    return Response({ user });
  } catch (error: any) {
    return Response({ message: error.message }, error.status);
  }
}
