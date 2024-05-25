'use client';

import { createAvatar } from '@dicebear/core';
import { Avatar } from 'antd';
import style from './index.module.scss';
import { avatarCollections } from '@/utils/const';

type Props = {
  seed?: string;
  avatarStyle?: string;
  type?: 'common' | 'big';
};

export const UserAvatar = ({
  avatarStyle,
  type = 'common',
  ...rest
}: Props) => (
  <Avatar
    className={`${style.avatar} ${style[type]}`}
    src={createAvatar(
      avatarCollections?.[avatarStyle || 'lorelei'],
      rest,
    ).toDataUriSync()}
  />
);
