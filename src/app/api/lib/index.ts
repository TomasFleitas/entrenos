import { DonationsModel, UsersModel } from '@/app/(app)/mongo';
import zlib from 'zlib';
import {
  COMMON_ALGORITHM_FIRST_PART,
  COMMON_ALGORITHM_SECOND_PART,
  COMMON_ALGORITHM_SECOND_THIRD,
  DONATE_SLOTS,
  getAfterThan,
  oneHourAgo,
} from '../utils/const';
import crypto from 'crypto';

export const comprimirString = async (inputString: string): Promise<string> => {
  const buffer = Buffer.from(inputString, 'utf-8');
  return await new Promise((resolve, reject) => {
    zlib.deflate(buffer, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
};

export const descomprimirString = async (inputHex: string): Promise<string> => {
  const buffer = Buffer.from(inputHex, 'hex');
  return await new Promise((resolve, reject) => {
    zlib.inflate(buffer, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('utf-8'));
      }
    });
  });
};

export const getSimpleUserToDonate = async (uid: string) => {
  const user = await UsersModel.aggregate([
    {
      $match: {
        uid: { $ne: uid }, 
        'mercadoPago.access_token': { $exists: true }, 
      },
    },
    {
      $sample: { size: 1 }, 
    },
  ]);

  return user.length > 0 ? user[0] : null; 
};


export const getUserToDonate = async (uid: string, exludeAlreadySent = false) =>
  await UsersModel.aggregate([
    {
      $match: {
        uid: { $ne: uid },
        'mercadoPago.access_token': {
          $exists: true,
        },
        $or: [
          { lastDonationAt: { $exists: false } },
          {
            lastDonationAt: {
              $gt: getAfterThan,
            },
          },
        ],
      },
    },
    ...((!exludeAlreadySent && [
      {
        $lookup: {
          from: DonationsModel.collection.name,
          let: { recipient_id: '$uid' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$recipientId', '$$recipient_id'] },
                    { $eq: ['$donorId', uid] },
                    { $gt: ['$timestamp', oneHourAgo] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: 'recentDonations',
        },
      },
      {
        $match: {
          recentDonations: { $eq: [] },
        },
      },
    ]) ||
      []),
    ...COMMON_ALGORITHM_FIRST_PART(DonationsModel.collection.name),
    ...COMMON_ALGORITHM_SECOND_PART(),
    ...COMMON_ALGORITHM_SECOND_THIRD(true),
    {
      $sort: { score: -1 },
    },
    { $limit: DONATE_SLOTS },
  ]);

export function generateRandomColor() {
  let color;
  do {
    const randomBytes = crypto.randomBytes(3);
    color = `#${randomBytes.toString('hex')}`;
  } while (isLightColor(color));
  return color;
}

function isLightColor(color: string) {
  // Extract RGB values from the hex color
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // Calculate brightness using the luminance formula
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if the brightness is higher than a certain threshold (e.g., 0.7)
  return brightness > 0.7;
}
