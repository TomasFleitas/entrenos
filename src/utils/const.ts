import {
  lorelei,
  adventurer,
  adventurerNeutral,
  avataaars,
  avataaarsNeutral,
  bigEars,
  bigEarsNeutral,
  bigSmile,
  bottts,
  botttsNeutral,
  croodles,
  croodlesNeutral,
  funEmoji,
  icons,
  identicon,
  loreleiNeutral,
  micah,
  miniavs,
  openPeeps,
  personas,
  pixelArt,
  pixelArtNeutral,
  shapes,
  thumbs,
} from '@dicebear/collection';

export const NEXT_PUBLIC_MERCADO_PAGO_CALLBACK =
  process.env.NEXT_PUBLIC_MERCADO_PAGO_CALLBACK;
export const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const NEXT_PUBLIC_AMOUNTS_TO_DONATE =
  process.env.NEXT_PUBLIC_AMOUNTS_TO_DONATE;
export const NEXT_PUBLIC_MERCADO_PAGO_APP_ID =
  process.env.NEXT_PUBLIC_MERCADO_PAGO_APP_ID;
export const NEXT_PUBLIC_RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
export const NEXT_PUBLIC_FIREBASE_PUSH_NOTIFICATION =
  process.env.NEXT_PUBLIC_FIREBASE_PUSH_NOTIFICATION;
export const NEXT_PUBLIC_FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
export const NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
export const NEXT_PUBLIC_FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
export const NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
export const NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
export const NEXT_PUBLIC_FIREBASE_APP_ID =
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
export const NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export const AMOUNTS_OPTIONS = (
  process.env.NEXT_PUBLIC_AMOUNTS_TO_DONATE || '50|100|200'
)
  .split('|')
  .map(Number);

export const avatarCollections: { [key: string]: any } = {
  lorelei,
  adventurer,
  adventurerNeutral,
  avataaars,
  avataaarsNeutral,
  bigEars,
  bigEarsNeutral,
  bigSmile,
  bottts,
  botttsNeutral,
  croodles,
  croodlesNeutral,
  funEmoji,
  icons,
  identicon,
  loreleiNeutral,
  micah,
  miniavs,
  openPeeps,
  personas,
  pixelArt,
  pixelArtNeutral,
  shapes,
  thumbs,
};
