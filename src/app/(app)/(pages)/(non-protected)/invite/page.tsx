import { redirect } from 'next/navigation';
import { LoginButton } from '../../../components/loginButton';
import style from './index.module.scss';
import { APP_BASE_URL, getCheapest } from '@/app/api/utils/const';
import { UserAvatar } from '@/app/(app)/components/userAvatar';
import { User } from 'firebase/auth';
import { createAvatar } from '@dicebear/core';
import { avatarCollections } from '@/utils/const';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Metadata function to dynamically set the page metadata
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const friendId = searchParams?.friend as string;

  if (!friendId) {
    return {
      title: 'EntreNos',
      description: '',
    };
  }

  const friendData = await fetch(`${APP_BASE_URL}/api/get-friend/${friendId}`)
    .then((res) => res.json())
    .catch(() => {
      return {
        title: 'EntreNos',
        description: '',
      };
    });

  const friend = friendData.friend;

  if (!friend) {
    return {
      title: 'EntreNos',
      description: '',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  const { avatarStyle, ...rest } = friend?.avatar || {};

  const avatarUri = createAvatar(
    avatarCollections?.[avatarStyle || getCheapest()?.value],
    rest,
  ).toDataUriSync();

  return {
    title: `Invitación de ${friend.name}`,
    description: `${friend.name} te invita a unirte a nuestra comunidad. ¡Únete ahora y descubre todo lo que tenemos para ofrecer!`,
    openGraph: {
      images: [avatarUri, ...previousImages],
    },
    icons: {
      icon: avatarUri,
    },
  };
}

export default async function InvitePage({ searchParams }: any) {
  const friend = searchParams?.friend;

  if (!friend) {
    redirect('/');
  }

  let userFriend: User | null = null;

  try {
    const response = await fetch(`${APP_BASE_URL}/api/get-friend/${friend}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    userFriend = data.friend;
  } catch (error) {
    console.error('Failed to fetch friend data:', error);
    redirect('/');
  }

  if (!userFriend) {
    redirect('/');
  }

  return (
    <div className={style.invite}>
      <UserAvatar {...userFriend.avatar} type="big" />
      <p className={style.text}>
        <b>{userFriend.name}</b> te invita a unirte a nuestra comunidad.
      </p>
      <LoginButton onlyButton />
    </div>
  );
}
