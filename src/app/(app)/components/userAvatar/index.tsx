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
}: Props) => (
  <Avatar
    className={`${style.avatar} ${style[type]}`}
    src={createAvatar(avatarCollections?.[avatarStyle || 'lorelei'], {
      ...rest,
      flip: direction === 'right',
    }).toDataUriSync()}
  />
);
