import { MongoConnection, UsersModel } from '@/app/(app)/mongo';
import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '../../lib/firebaseAdmin';
import { Response } from '../../utils';
import { comprimirString, getUserToDonate } from '../../lib';
import {
  APP_BASE_URL,
  DONATION_TITLE,
  MERCADO_PAGO_FEE,
  MERCADO_PAGO_FEE_MODE,
  MERCADO_PAGO_REDIRECT_URI_SUCCESS,
  MERCADO_PAGO_WEBHOOK_NOTIFICATION_URL,
} from '../../utils/const';

export const dynamic = 'force-dynamic';

const mongo = new MongoConnection();

export async function POST(req: NextRequest) {
  try {
    const uid = await validateToken(req);

    const { amount: unit_price } = await req.json();

    await mongo.init();

    const currentTime = new Date();

    const currentUser = await UsersModel.findOne({ uid });
    let user = null;
    if (currentUser?.invitedBy && !currentUser.hasDonatedToFriend) {
      user = await UsersModel.findOne({ uid: currentUser.invitedBy });
    }

    if (!user || !user?.mercadoPago?.access_token) {
      let users: any[] = await getUserToDonate(uid);
      if (!users.length) {
        users = await getUserToDonate(uid, true);
      }
      user = users?.[Math.floor(Math.random() * users?.length)];
    }

    if (!user?.mercadoPago?.access_token) {
      console.log('No one to donate.', user);
      return Response({ message: 'No one to donate.' }, 404);
    }

    let access_token = user.mercadoPago.access_token;

    const tokenReceivedAtMs = new Date(user.mercadoPago.updatedAt).getTime();
    const expiresInMs = user.mercadoPago.expires_in * 1000;
    const bufferTimeMs = 259200000;
    const tokenExpirationThreshold = expiresInMs - bufferTimeMs;
    const tokenExpired =
      currentTime.getTime() - tokenReceivedAtMs > tokenExpirationThreshold;

    if (tokenExpired) {
      const refreshResponse = await fetch('/api/mercadopago', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!refreshResponse.ok) {
        return new NextResponse(
          JSON.stringify({ message: 'Failed to refresh token' }),
          {
            status: refreshResponse.status,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      const { token } = await refreshResponse.json();
      access_token = token;
    }

    const checkoutUrl = await createMercadoPagoCheckoutLink(
      access_token,
      {
        id: '1',
        title: DONATION_TITLE,
        quantity: 1,
        unit_price,
        category_id: 'donations',
      },
      { donorId: uid, recipientId: user.uid },
    );

    return Response({ url: checkoutUrl });
  } catch (error: any) {
    console.log(error);
    return Response({ message: error.message }, error.status);
  }
}

async function createMercadoPagoCheckoutLink(
  accessToken: string,
  item: {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    category_id: string;
  },
  extraInformation: {
    donorId: string;
    recipientId: string;
  },
) {
  const success = `${APP_BASE_URL}${MERCADO_PAGO_REDIRECT_URI_SUCCESS}`;

  const mode =
    MERCADO_PAGO_FEE_MODE === 'fixed' ? MERCADO_PAGO_FEE_MODE : 'porcentage';

  const marketplace_fee =
    mode === 'porcentage'
      ? item.unit_price * (MERCADO_PAGO_FEE / 100)
      : MERCADO_PAGO_FEE;

  const url = 'https://api.mercadopago.com/checkout/preferences';

  const body = {
    items: [
      item,
      {
        id: '2',
        title: 'Tarifa del servicio',
        quantity: 1,
        category_id: 'services',
        unit_price: marketplace_fee,
      },
    ],
    auto_return: 'approved',
    binary_mode: true,
    external_reference: await comprimirString(JSON.stringify(extraInformation)),
    marketplace: 'EntreNos',
    marketplace_fee,
    notification_url: MERCADO_PAGO_WEBHOOK_NOTIFICATION_URL,
    back_urls: {
      success,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error creating Mercado Pago checkout link: ${data.error}`);
  }

  return data.init_point;
}
