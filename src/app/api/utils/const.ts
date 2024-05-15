export const {
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONDO_DB_ID,
  MONGO_DB_NAME,
  RECAPTCHA_SECRET_KEY,
  DECAY_RATE: decayRate = '1',
  DAYS_TO_DECAY: daysToDecay = '30',
  DAYS_THRESHOLD: daysThreshold = '30',
  DONATE_SLOTS: donateSlots = '3',
  DONATION_TITLE = 'Colaboración',
  MERCADO_PAGO_WEBHOOK_NOTIFICATION_URL,
  MERCADO_PAGO_REDIRECT_URI_SUCCESS,
  MERCADO_PAGO_REDIRECT_URI,
  MERCADO_PAGO_WEBHOOK,
  MERCADO_PAGO_CLIENT_SECRET,
  MERCADO_PAGO_CLIENT_ID,
  MERCADO_PAGO_FEE_MODE = 'fixed',
  MERCADO_PAGO_FEE: mercadoPagoFee = '5',
  MERCADO_PAGO_WEBHOOK_SECRET,
  APP_BASE_URL,
  DONATION_EXCLUDE_INTERVAL_HOURS,
} = process.env;

export const DECAY_RATE = parseFloat(decayRate);
export const DAYS_TO_DECAY = parseInt(daysToDecay);
export const DAYS_THRESHOLD = parseInt(daysThreshold);
export const DONATE_SLOTS = parseInt(donateSlots);
export const MERCADO_PAGO_FEE = parseFloat(mercadoPagoFee);

export const getAfterThan = new Date(
  new Date().getTime() - DAYS_THRESHOLD * 86400000,
);

export const oneHourAgo = new Date(
  Date.now() -
    parseInt(DONATION_EXCLUDE_INTERVAL_HOURS || '1', 10) * 60 * 60 * 1000,
);

export const COMMON_ALGORITHM_FIRST_PART = (donationName: string) => [
  {
    $lookup: {
      from: donationName,
      let: { user_id: '$uid' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$donorId', '$$user_id'] },
                {
                  $gt: ['$timestamp', getAfterThan],
                },
              ],
            },
          },
        },
        { $project: { amount: 1, timestamp: 1 } },
      ],
      as: 'donations',
    },
  },
  {
    $unwind: {
      path: '$donations',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      'donations.decayedAmount': {
        $multiply: [
          '$donations.amount',
          {
            $pow: [
              Math.E,
              {
                $multiply: [
                  -DECAY_RATE,
                  {
                    $divide: [
                      { $subtract: [new Date(), '$donations.timestamp'] },
                      86400000 * DAYS_TO_DECAY,
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
];

export const COMMON_ALGORITHM_SECOND_PART = (extraData = {}) => [
  {
    $group: {
      _id: '$_id',
      uid: { $first: '$uid' },
      ...extraData,
      mercadoPago: { $first: '$mercadoPago' },
      totalDecayedDonations: { $sum: '$donations.decayedAmount' },
      lastDonationTime: { $max: '$donations.timestamp' },
    },
  },
];

export const COMMON_ALGORITHM_SECOND_THIRD = (isRandom = true) => [
  {
    $addFields: {
      timeSinceLastDonation: {
        $divide: [{ $subtract: [new Date(), '$lastDonationTime'] }, 86400000],
      },
    },
  },
  {
    $addFields: {
      score: {
        $multiply: [
          '$totalDecayedDonations',
          {
            $pow: [Math.E, { $multiply: [-0.1, '$timeSinceLastDonation'] }],
          },
          isRandom && { $rand: {} },
        ].filter(Boolean),
      },
    },
  },
];
