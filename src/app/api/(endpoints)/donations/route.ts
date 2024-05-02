import { DonationsModel, MongoConnection } from '@/app/(app)/mongo';
import { Response } from '../../utils';
import { validateToken } from '../../lib/firebaseAdmin';

import { NextRequest } from 'next/server';

const mongo = new MongoConnection();

export async function GET(req: NextRequest) {
  try {
    const uid = await validateToken(req);

    await mongo.init();

    const pageSize: number =
      (req.nextUrl.searchParams.get('pageSize') as unknown as number) || 10;
    const lastDonationId = req.nextUrl.searchParams.get('lastDonationId');
    const type = req.nextUrl.searchParams.get('type');

    let query = { [type === 'sent' ? 'donorId' : 'recipientId']: uid } as any;
    if (lastDonationId) {
      query = { ...query, _id: { $lt: lastDonationId } };
    }

    const donations = (
      (await DonationsModel.find(query)
        .sort({ timestamp: -1 })
        .limit(pageSize)) as any[]
    )?.map(({ amount, timestamp, _id }) => ({
      amount,
      timestamp,
      id: _id,
    }));

    return Response({ donations });
  } catch (error: any) {
    return Response({ message: error.message }, error.status);
  }
}
