import { NextResponse } from 'next/server';

export const Response = (data: any = undefined, status = 200) =>
  new NextResponse(data && JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
