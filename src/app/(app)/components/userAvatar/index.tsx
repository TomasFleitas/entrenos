'use client';

import { createAvatar } from '@dicebear/core';
import { Avatar } from 'antd';
import style from './index.module.scss';
import { avatarCollections } from '@/utils/const';

type Props = {
  seed?: string;
  avatarStyle?: string;
  type?: 'common' | 'big';
  direction?: 'right' | 'left';
};

export const UserAvatar = ({
  avatarStyle,
  direction,
  type = 'common',
  ...rest
}: Props) => {
  const innerAvatarStyle = avatarStyle || 'lorelei';

  const flip =
    innerAvatarStyle === 'lorelei'
      ? direction !== 'right'
      : direction === 'right';

  return (
    <Avatar
      className={`${style.avatar} ${style[type]}`}
      src={createAvatar(avatarCollections?.[innerAvatarStyle], {
        ...rest,
        flip,
      }).toDataUriSync()}
    />
  );
};
