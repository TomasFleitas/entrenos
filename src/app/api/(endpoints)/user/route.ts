import { DonationsModel, MongoConnection, UsersModel } from '@/mongo';
import { User } from 'firebase/auth';
import type { NextRequest } from 'next/server';
import { Response } from '../../utils';
import { validateToken } from '../../lib/firebaseAdmin';

const mongo = new MongoConnection();

export async function GET(req: NextRequest) {
  try {
    const uid = await validateToken(req);

    await mongo.init();

    const user = await getUserById(uid);

    return Response({ user });
  } catch (error: any) {
    return Response({ message: error.message }, error.status);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const uid = await validateToken(req);

    await mongo.init();

    const user: User = await req.json();

    await UsersModel.updateOne(
      { uid },
      {
        uid,
        defualtName: user.defaultName,
        email: user.email,
        name: user.name,
        birthday: user.birthday,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      },
    );

    const updatedUser = await getUserById(uid);

    return Response({ user: updatedUser });
  } catch (error: any) {
    return Response({ message: error.message }, error.status);
  }
}

const getUserById = async (uid: string) => {
  const decayRate = parseFloat(process.env.DECAY_RATE || '1');
  const daysToDecay = parseFloat(process.env.DAYS_TO_DECAY || '30');

  const users = await UsersModel.aggregate([
    {
      $match: {
        uid,
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
        email: { $first: '$email' },
        name: { $first: '$name' },
        defaultName: { $first: '$defaultName' },
        birthday: { $first: '$birthday' },
        updatedAt: { $first: '$updatedAt' },
        mercadoPago: { $first: '$mercadoPago' },
        createdAt: { $first: '$createdAt' },
        donations: {
          $push: {
            amount: '$donations.amount',
            timestamp: '$donations.timestamp',
          },
        },
        totalDecayedDonations: { $sum: '$donations.decayedAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        uid: 1,
        email: 1,
        name: 1,
        updatedAt: 1,
        mercadoPago: 1,
        birthday: 1,
        defaultName: 1,
        createdAt: 1,
        donations: 1,
        score: '$totalDecayedDonations',
      },
    },
  ]);

  const user = {
    ...users[0],
    donations: users[0]?.donations?.filter(
      (donation: User['donations']) => Object.keys(donation).length,
    ),
  };

  return user;
};
