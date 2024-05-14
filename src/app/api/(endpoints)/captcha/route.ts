import { NextRequest, NextResponse } from 'next/server';
import { Response } from '../../utils';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { recaptchaToken } = await req.json();

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const response = await fetch(verificationUrl, {
      method: 'POST',
    });

    const data = await response.json();

    if (data.success) {
      return Response({ message: 'reCAPTCHA verified successfully' }, 200);
    } else {
      return Response(
        {
          message: 'reCAPTCHA verification failed',
          error: data['error-codes'],
        },
        400,
      );
    }
  } catch (error: any) {
    console.log(error);
    return Response({ message: error.message }, error.status);
  }
}
