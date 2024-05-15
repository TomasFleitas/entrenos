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
