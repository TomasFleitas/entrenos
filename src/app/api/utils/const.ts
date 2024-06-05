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

export const getCheapest = () => {
  if (!avatarOptions || avatarOptions.length === 0) return null;

  let cheapestAvatar = avatarOptions[0];

  for (let i = 1; i < avatarOptions.length; i++) {
    if (avatarOptions[i].cost < cheapestAvatar.cost) {
      cheapestAvatar = avatarOptions[i];
    }
  }

  return cheapestAvatar;
};

export const getStyleCost = (style?: string) => {
  if (!style) return 0;
  return avatarOptions?.find(({ value }) => value === style)?.cost || 0;
};

export const avatarOptions = [
  { label: 'Por defecto', value: 'default', cost: 0 },
  { label: 'Pixel Art', value: 'pixelArt', cost: 10 },
  { label: 'Shapes', value: 'shapes', cost: 10 },
  { label: 'Identicon', value: 'identicon', cost: 10 },
  { label: 'Croodles', value: 'croodles', cost: 10 },
  { label: 'Croodles Neutral', value: 'croodlesNeutral', cost: 10 },
  { label: 'Avataaars Neutral', value: 'avataaarsNeutral', cost: 30 },
  { label: 'Big Ears Neutral', value: 'bigEarsNeutral', cost: 30 },
  { label: 'Bottts Neutral', value: 'botttsNeutral', cost: 30 },
  { label: 'Thumbs', value: 'thumbs', cost: 30 },
  { label: 'Lorelei Neutral', value: 'loreleiNeutral', cost: 30 },
  { label: 'Icons', value: 'icons', cost: 30 },
  { label: 'Fun Emoji', value: 'funEmoji', cost: 30 },
  { label: 'Adventurer Neutral', value: 'adventurerNeutral', cost: 50 },
  { label: 'Big Ears', value: 'bigEars', cost: 50 },
  { label: 'Lorelei', value: 'lorelei', cost: 50 },
  { label: 'Avataaars', value: 'avataaars', cost: 50 },
  { label: 'Big Smile', value: 'bigSmile', cost: 50 },
  { label: 'Miniavs', value: 'miniavs', cost: 50 },
  { label: 'Personas', value: 'personas', cost: 50 },
  { label: 'Bottts', value: 'bottts', cost: 50 },
  { label: 'Micah', value: 'micah', cost: 100 },
  { label: 'Open Peeps', value: 'openPeeps', cost: 100 },
  { label: 'Adventurer', value: 'adventurer', cost: 100 },
];
