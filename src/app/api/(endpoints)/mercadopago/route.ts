import { NextRequest, NextResponse } from 'next/server';
import { Response } from '../../utils';
import { sendNotification, validateToken } from '../../lib/firebaseAdmin';
import { descomprimirString } from '../../lib/const';
import { DonationsModel, UsersModel } from '@/app/(app)/mongo';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const uid = req.nextUrl.searchParams.get('state');
  const baseUrl = process.env.APP_BASE_URL!;

  const redirectUri = `${baseUrl}${process.env.MERCADO_PAGO_REDIRECT_URI!}`;

  if (!code || !uid) {
    /*  return Response({ message: 'Code no provided.' }, 404); */
    console.error('Code no provided.');
    return NextResponse.redirect(redirectUri);
  }

  const CLIENT_ID = process.env.MERCADO_PAGO_CLIENT_ID!;
  const CLIENT_SECRET = process.env.MERCADO_PAGO_CLIENT_SECRET!;
  const REDIRECT_URI = `${baseUrl}${process.env.MERCADO_PAGO_WEBHOOK!}`;

  try {
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return Response({ message: 'Error connecting with Mercado Pago.' }, 401);
    }

    const exist = await UsersModel.exists({
      mercadoPago: { user_id: data.user_id },
    });

    if (!exist) {
      await UsersModel.updateOne(
        { uid },
        {
          mercadoPago: data,
          updatedAt: new Date(),
        },
        {
          upsert: true,
        },
      );
    } else {
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

// WEBHOOK
export async function POST(req: NextRequest) {
  try {
    const webHookData = await req.json();

    if (webHookData.action === 'payment.created') {
      const paymentId = webHookData.data.id;
      const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

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

      const externalReference = JSON.parse(
        await descomprimirString(payment.external_reference as string),
      );

      const fee =
        payment.charges_details.find(
          ({ accounts }: any) => accounts.to === 'marketplace_owner',
        )?.amounts?.original || 0;

      const amount = payment.transaction_amount - fee;

      await DonationsModel.create({
        ...externalReference,
        paymentId,
        amount,
      });

      await UsersModel.updateOne(
        { uid: externalReference.donorId },
        {
          lastDonationAt: new Date(),
        },
        {
          upsert: true,
        },
      );

      const recipient = await UsersModel.findOne({
        uid: externalReference.recipientId,
      });

      const notificationToken = recipient?.notificationToken;
      if (notificationToken) {
        await sendNotification(notificationToken, {
          title: 'Nueva colaboración recibida',
          body: `Has recibido una nueva colaboración por un monto de $${amount}.`,
        });
      }
    }

    return Response();
  } catch (error: any) {
    return Response({ message: error.message }, error.status);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const CLIENT_ID = process.env.MERCADO_PAGO_CLIENT_ID!;
    const CLIENT_SECRET = process.env.MERCADO_PAGO_CLIENT_SECRET!;

    const { uid } = await req.json();
    const user = await UsersModel.findOne({ uid });

    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
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
        mercadoPago: data,
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
