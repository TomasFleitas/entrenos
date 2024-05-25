import { DonationsModel, MongoConnection, UsersModel } from '@/app/(app)/mongo';
import { User } from 'firebase/auth';
import type { NextRequest } from 'next/server';
import { Response } from '../../utils';
import { validateToken } from '../../lib/firebaseAdmin';
import { UserResponse } from 'mercadopago/dist/clients/user/get/types';
import {
  COMMON_ALGORITHM_SECOND_PART,
  COMMON_ALGORITHM_FIRST_PART,
  COMMON_ALGORITHM_SECOND_THIRD,
} from '../../utils/const';
import { descomprimirString } from '../../lib';
import { cookies } from 'next/headers';

const mongo = new MongoConnection();

export const dynamic = 'force-dynamic';

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

    const user: User & { notificationTokens?: { [x: string]: string | null } } =
      await req.json();

    let invitedBy;
    let invitedById = user.invitedBy || cookies().get('friendId')?.value;
    if (invitedById) {
      invitedById = await descomprimirString(invitedById);
      if (invitedById !== uid) {
        const exist = await UsersModel.exists({
          uid: invitedById,
        });
        if (exist) {
          invitedBy = invitedById;
        }
      }
    }

    const oldUser = await UsersModel.findOne({ uid });

    await UsersModel.updateOne(
      { uid },
      {
        uid,
        ...(!oldUser && { invitedBy }),
        defaultName: user.defaultName,
        email: user.email,
        avatar: {
          ...(oldUser?.avatar || {}),
          ...user.avatar,
        },
        notificationTokens: {
          ...Object.fromEntries(oldUser?.notificationTokens || new Map()),
          ...user.notificationTokens,
        },
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

    cookies().delete('friendId');

    return Response({ user: updatedUser });
  } catch (error: any) {
    console.log(error);
    return Response({ message: error.message }, error.status);
  }
}

const getUserById = async (uid: string) => {
  const users = await UsersModel.aggregate([
    {
      $match: {
        uid,
      },
    },
    ...COMMON_ALGORITHM_FIRST_PART(DonationsModel.collection.name),
    ...COMMON_ALGORITHM_SECOND_PART({
      email: { $first: '$email' },
      name: { $first: '$name' },
      defaultName: { $first: '$defaultName' },
      birthday: { $first: '$birthday' },
      updatedAt: { $first: '$updatedAt' },
      createdAt: { $first: '$createdAt' },
      avatar: { $first: '$avatar' },
      donations: {
        $push: {
          amount: '$donations.amount',
          timestamp: '$donations.timestamp',
        },
      },
    }),
    ...COMMON_ALGORITHM_SECOND_THIRD(false),
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
        avatar: 1,
        score: 1,
      },
    },
  ]);

  const user = {
    ...users[0],
    isFirstDonation: !users[0]?.donations?.length,
  };

  const userAccessToken = user?.mercadoPago?.access_token;
  user.mpConnected = !!user?.mercadoPago?.access_token;
  delete user.mercadoPago;
  delete user.donations;

  if (!userAccessToken) {
    return user;
  }

  // Get mercado pago account
  let mercadoPagoAccount: MercadoPagoAccountDetail;
  try {
    const url = 'https://api.mercadopago.com/users/me';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const mpUser = (await response.json()) as UserResponse;

    const phone =
      mpUser?.phone && mpUser?.phone?.number
        ? `${mpUser?.phone?.area_code}${mpUser?.phone?.number}`
        : undefined;

    mercadoPagoAccount = {
      alias: undefined,
      cvu: undefined,
      email: mpUser?.email,
      firstName: mpUser?.first_name,
      lastName: mpUser?.last_name,
      phone,
      thumbnailUrl: mpUser?.logo ?? (mpUser as any)?.thumbnail?.picture_url!,
      userName: mpUser?.nickname,
    };
  } catch (error) {
    console.error(error);
    return user;
  }

  return { ...user, mercadoPagoAccount };
};
