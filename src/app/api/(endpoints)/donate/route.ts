import { UsersModel, MongoConnection, DonationsModel } from '@/app/(app)/mongo';
import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '../../lib/firebaseAdmin';
import { Response } from '../../utils';
import { comprimirString } from '../../lib/const';

export const dynamic = 'force-dynamic';

const mongo = new MongoConnection();

export async function POST(req: NextRequest) {
  try {
    const uid = await validateToken(req);

    const { amount: unit_price } = await req.json();

    const decayRate = parseFloat(process.env.DECAY_RATE || '1');
    const daysToDecay = parseFloat(process.env.DAYS_TO_DECAY || '30');
    const daysThreshold = parseInt(process.env.DAYS_THRESHOLD || '30');

    await mongo.init();

    const currentTime = new Date();

    const users = await UsersModel.aggregate([
      {
        $match: {
          uid: { $ne: uid },
          mercadoPago: { $ne: null, $exists: true },
          $or: [
            { lastDonationAt: { $exists: false } },
            {
              lastDonationAt: {
                $lt: new Date(new Date().getTime() - daysThreshold * 86400000),
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: DonationsModel.collection.name,
          localField: 'uid',
          foreignField: 'donorId',
          as: 'donations',
        },
      },
      {
        $unwind: {
          path: '$donations',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'donations.decayedAmount': {
            $multiply: [
              '$donations.amount',
              {
                $pow: [
                  Math.E,
                  {
                    $multiply: [
                      -decayRate,
                      {
                        $divide: [
                          { $subtract: [new Date(), '$donations.timestamp'] },
                          86400000 * daysToDecay,
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          uid: { $first: '$uid' },
          mercadoPago: { $first: '$mercadoPago' },
          totalDecayedDonations: { $sum: '$donations.decayedAmount' },
          lastDonationTime: { $max: '$donations.timestamp' },
        },
      },
      {
        $addFields: {
          timeSinceLastDonation: {
            $divide: [
              { $subtract: [new Date(), '$lastDonationTime'] },
              86400000,
            ],
          },
        },
      },
      {
        $addFields: {
          score: {
            $multiply: [
              '$totalDecayedDonations',
              {
                $pow: [Math.E, { $multiply: [-0.1, '$timeSinceLastDonation'] }],
              },
              { $rand: {} },
            ],
          },
        },
      },
      {
        $sort: { score: -1 },
      },
      { $limit: 1 },
    ]);

    const user = users[0];

    if (!user?.mercadoPago?.access_token) {
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
        title: process.env.DONATION_TITLE || 'Titulo',
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
  extraInformation: { donorId: string; recipientId: string },
) {
  const notification_url = `${process.env.APP_BASE_URL!}${process.env
    .MERCADO_PAGO_WEBHOOK!}`;

  const success = `${process.env.APP_BASE_URL!}${process.env
    .MERCADO_PAGO_REDIRECT_URI_SUCCESS!}`;

  const mode =
    process.env.MERCADO_PAGO_FEE_MODE === 'fixed'
      ? process.env.MERCADO_PAGO_FEE_MODE
      : 'porcentage';

  const marketplace_fee =
    mode === 'porcentage'
      ? item.unit_price *
        (parseFloat(process.env.MERCADO_PAGO_FEE || '5') / 100)
      : parseFloat(process.env.MERCADO_PAGO_FEE || '5');

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
    marketplace: process.env.MERCADO_PAGO_CLIENT_ID,
    marketplace_fee,
    notification_url,
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
