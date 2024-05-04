import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { User } from 'firebase/auth';

export type TDonation = {
  donor: {
    name: string;
    avatar: User['avatar'];
  };
  recipient: {
    name: string;
    avatar: User['avatar'];
  };
  timestamp: Date;
  amount: number;
};

const mapStringToDate = (donations: TDonation[]) => {
  donations.forEach(
    (donation) => (donation['timestamp'] = new Date(donation.timestamp as any)),
  );
};

const sortDonations = (donations: TDonation[]) => {
  return donations.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
};

export const useDonationWatch = () => {
  const [donations, setDonations] = useState<TDonation[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/donations`, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('recentDonations', (recentDonations: TDonation[]) => {
      mapStringToDate(recentDonations);
      setDonations(sortDonations(recentDonations));
    });

    socket.on('newDonation', (donation: TDonation) => {
      mapStringToDate([donation]);
      setDonations((prevDonations: TDonation[]) =>
        sortDonations([donation, ...prevDonations.slice(0, 9)]),
      );
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { connected, donations };
};
