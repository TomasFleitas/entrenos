import * as admin from 'firebase-admin';
import serviceAccount from './service-account.json';
import { NextRequest } from 'next/server';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const validateToken = async (req: NextRequest) => {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    throw {
      message: 'Authentication token not provided',
      status: 401,
    };
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    return decodedToken.uid;
  } catch (error) {
    throw {
      message: 'Invalid or expired token.',
      statu: 403,
    };
  }
};

export default admin;
