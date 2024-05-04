import { DonationsModel, MongoConnection } from '@/app/(app)/mongo';
import { Response } from '../../utils';
import { validateToken } from '../../lib/firebaseAdmin';

import { NextRequest } from 'next/server';

const mongo = new MongoConnection();

export async function GET(req: NextRequest) {
  try {
    const uid = await validateToken(req);

    await mongo.init();

    const pageSize = req.nextUrl.searchParams.get('pageSize') || '10';

    const lastDonationId = req.nextUrl.searchParams.get('lastDonationId');

    const type = req.nextUrl.searchParams.get('type');

    console.log(pageSize, lastDonationId, type);

    const resp = await DonationsModel.aggregate(
      [
        lastDonationId && { $match: { _id: { $lt: lastDonationId } } },
        { $match: { [type === 'sent' ? 'donorId' : 'recipientId']: uid } },
        {
          $lookup: {
            from: 'users',
            localField: 'donorId',
            foreignField: 'uid',
            as: 'donorDetails',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'recipientId',
            foreignField: 'uid',
            as: 'recipientDetails',
          },
        },
        {
          $addFields: {
            donor: { $arrayElemAt: ['$donorDetails', 0] },
            recipient: { $arrayElemAt: ['$recipientDetails', 0] },
          },
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $limit: parseInt(pageSize, 10),
        },
        {
          $project: {
            'donor.name': 1,
            'donor.defaultName': 1,
            'donor.email': 1,
            'donor.avatar': 1,
            'recipient.name': 1,
            'recipient.defaultName': 1,
            'recipient.email': 1,
            'recipient.avatar': 1,
            donorId: 1,
            recipientId: 1,
            amount: 1,
            paymentId: 1,
            timestamp: 1,
          },
        },
      ].filter(Boolean) as any,
    );

    const donations = resp?.map(
      ({ donor, recipient, timestamp, amount, _id }: any) => ({
        user:
          type === 'received'
            ? { name: donor.name || donor.defaultName, avatar: donor.avatar }
            : {
                name: recipient.name || recipient.defaultName,
                avatar: recipient.avatar,
              },
        timestamp,
        amount,
        id: _id,
      }),
    );

    return Response({ donations });
  } catch (error: any) {
    return Response({ message: error.message }, error.status);
  }
}
