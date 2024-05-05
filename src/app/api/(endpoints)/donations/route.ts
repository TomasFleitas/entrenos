import { DonationsModel, MongoConnection } from '@/app/(app)/mongo';
import { Response } from '../../utils';
import { validateToken } from '../../lib/firebaseAdmin';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const mongo = new MongoConnection();

export async function GET(req: NextRequest) {
  try {
    const uid = await validateToken(req);

    await mongo.init();

    const limit = parseInt(req.nextUrl.searchParams.get('size') || '10');
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const type = req.nextUrl.searchParams.get('type');

    const skip = (page - 1) * limit;

    const resp = await DonationsModel.aggregate(
      [
        { $match: { [type === 'sent' ? 'donorId' : 'recipientId']: uid } },
        type === 'received' && {
          $lookup: {
            from: 'users',
            localField: 'donorId',
            foreignField: 'uid',
            as: 'donorDetails',
          },
        },
        type === 'sent' && {
          $lookup: {
            from: 'users',
            localField: 'recipientId',
            foreignField: 'uid',
            as: 'recipientDetails',
          },
        },
        {
          $addFields: {
            ...(type === 'received' && {
              donor: { $arrayElemAt: ['$donorDetails', 0] },
            }),
            ...(type === 'sent' && {
              recipient: { $arrayElemAt: ['$recipientDetails', 0] },
            }),
          },
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            ...(type === 'received' && {
              'donor.name': 1,
              'donor.defaultName': 1,
              'donor.email': 1,
              'donor.avatar': 1,
              donorId: 1,
            }),
            ...(type === 'sent' && {
              'recipient.name': 1,
              'recipient.defaultName': 1,
              'recipient.email': 1,
              'recipient.avatar': 1,
              recipientId: 1,
            }),
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
