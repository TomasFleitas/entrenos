import { comprimirString } from '@/app/api/lib';
import { validateToken } from '@/app/api/lib/firebaseAdmin';
import { NextRequest } from 'next/server';
import { Response } from '../../../utils';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const uid = await validateToken(req);
    return Response({ code: await comprimirString(uid) });
  } catch (error: any) {
    return Response({ message: error.message }, error.status);
  }
}
