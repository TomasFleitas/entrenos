import 'firebase/auth';

type Avatar = {
  seed?: string;
  avatarStyle?: string;
};
declare module 'firebase/auth' {
  export interface User {
    mercadoPago?: {
      access_token: string;
      expires_in: number;
      user_id: 303538474;
      refresh_token: string;
      public_key: string;
    };
    isFirstDonation: boolean;
    invitedBy?: string;
    hasDonatedToFriend?: boolean;
    mpConnected: boolean;
    inviter?: {
      name: string;
      avatar: Avatar;
    };
    mercadoPagoAccount?: MercadoPagoAccountDetail;
    avatar?: Avatar;
    uid: string;
    createdAt: string;
    email: string;
    defaultName?: string | null;
    birthday?: Date;
    coins?: number;
    name: string;
    score: number;
    donations: {
      amount: number;
      timestamp: Date;
    }[];
    updatedAt: string;
  }
}
