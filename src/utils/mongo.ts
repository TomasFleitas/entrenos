import { DonationsModel } from '@/app/(app)/mongo';

export const getFirstLastDonations = async () => {
  const resp = await DonationsModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'donorId',
        foreignField: 'uid',
        as: 'donorDetails',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'recipientId',
        foreignField: 'uid',
        as: 'recipientDetails',
      },
    },
    {
      $addFields: {
        donor: { $arrayElemAt: ['$donorDetails', 0] },
        recipient: { $arrayElemAt: ['$recipientDetails', 0] },
      },
    },
    {
      $sort: { timestamp: 1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        'donor.name': 1,
        'donor.defaultName': 1,
        'donor.email': 1,
        'recipient.name': 1,
        'recipient.defaultName': 1,
        'recipient.email': 1,
        donorId: 1,
        recipientId: 1,
        amount: 1,
        paymentId: 1,
        timestamp: 1,
      },
    },
  ]);

  return resp?.map(({ donor, recipient, timestamp, amount }: any) => ({
    donor: { name: donor.name || donor.defaultName },
    recipient: { name: recipient.name || recipient.defaultName },
    timestamp,
    amount,
  }));
};
