import { MongoConnection, UsersModel } from '@/app/(app)/mongo';
import { NextRequest } from 'next/server';
import { Response } from '../../../utils';
import { comprimirString, descomprimirString } from '@/app/api/lib';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const mongo = new MongoConnection();

export async function GET(
  req: NextRequest,
  context: { params: { friend: string } },
) {
  let friendId = context.params.friend;

  if (!friendId) {
    return Response({ message: 'Friend Not Found' }, 404);
  }

  try {
    friendId = await descomprimirString(friendId);
  } catch (e: any) {
    return Response({ message: 'Friend Not Found' }, 404);
  }

  await mongo.init();

  const user = await UsersModel.findOne({ uid: friendId });

  if (!user) {
    return Response({ message: 'Friend Not Found' }, 404);
  }

  const friend = {
    name: user?.name || user?.defaultName,
    avatar: user?.avatar,
  };

  cookies().set({
    name: 'friendId',
    value: context.params.friend,
    httpOnly: true,
    path: '/',
  });

  return Response({ friend });
}
