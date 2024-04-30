import { DonationsModel, MongoConnection } from '@/mongo';
import { Response } from '../../utils';
import { validateToken } from '../../lib/firebaseAdmin';

import { NextRequest } from 'next/server';

const mongo = new MongoConnection();

export async function GET(req: NextRequest) {
  try {
    const uid = await validateToken(req);

    await mongo.init();

    const pageSize: number = req.nextUrl.searchParams.get('pageSize') as unknown as number || 10;
    const lastDonationId = req.nextUrl.searchParams.get('lastDonationId');

    let query = { donorId: uid } as any;
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
