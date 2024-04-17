export const IS_LOGGED = false;

export const AMOUNTS_OPTIONS = (
  process.env.NEXT_PUBLIC_AMOUNTS_TO_DONATE || '50|100|200'
)
  .split('|')
  .map(Number);
