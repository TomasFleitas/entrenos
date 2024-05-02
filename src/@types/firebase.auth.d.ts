import 'firebase/auth';
declare module 'firebase/auth' {
  export interface User {
    mercadoPago?: {
      access_token: string;
      expires_in: number;
      user_id: 303538474;
      refresh_token: string;
      public_key: string;
    };
    mercadoPagoAccount?: MercadoPagoAccountDetail ;
    avatar?: {
      seed?: string;
    };
    uid: string;
    createdAt: string;
    email: string;
    defaultName?: string | null;
    birthday?: Date;
    name: string;
    score: number;
    donations: {
      amount: number;
      timestamp: Date;
    }[];
    updatedAt: string;
  }
}
