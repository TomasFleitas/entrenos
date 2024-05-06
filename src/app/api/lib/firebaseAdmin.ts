import * as admin from 'firebase-admin';
import serviceAccount from './service-account.json';
import { NextRequest } from 'next/server';
import { NotificationPayload } from 'firebase/messaging';

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
      status: 403,
    };
  }
};

export const sendNotification = async (
  tokens: string[],
  notification: NotificationPayload,
) => {
  const message = {
    tokens,
    notification: notification,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('Successfully sent messages:', response.successCount);
    if (response.failureCount > 0) {
      console.log(
        'Failed messages:',
        response.responses.filter((res) => !res.success),
      );
    }
  } catch (error) {
    console.log('Error sending messages:', error);
  }
};

export default admin;
