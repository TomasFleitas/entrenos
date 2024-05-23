import { NextRequest, NextResponse } from 'next/server';
import { Response } from '../../utils';
import { descomprimirString } from '../../lib';

export async function GET(req: NextRequest, res: NextResponse) {
  const pass = req.nextUrl.searchParams.get('password');

  if (pass != '321') {
    return Response({ message: 'Forbidden' }, 401);
  }

  const data = req.nextUrl.searchParams.get('code');

  return Response(await descomprimirString(data!));
}
