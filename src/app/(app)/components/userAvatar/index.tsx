'use client';

import { createAvatar } from '@dicebear/core';
import { Avatar } from 'antd';
import style from './index.module.scss';
import { avatarCollections } from '@/utils/const';
import { getInitials } from '@/utils';

type Props = {
  seed?: string;
  avatarStyle?: string;
  name?: string | null;
  backgroundColor?: string;
  type?: 'common' | 'big' | 'profile';
  direction?: 'right' | 'left';
};

export const UserAvatar = ({
  avatarStyle,
  direction,
  backgroundColor,
  name,
  type = 'common',
  ...rest
}: Props) => {
  if (!avatarStyle || avatarStyle === 'default') {
    return (
      <Avatar
        style={{ backgroundColor }}
        className={`${style.avatar} ${style[type]}`}
      >
        {name && <div className={style.text}>{getInitials(name!)}</div>}
      </Avatar>
    );
  }

  const flip = ['lorelei'].includes(avatarStyle)
    ? direction !== 'right'
    : direction === 'right';

  return (
    <Avatar
      className={`${style.avatar} ${style[type]}`}
      src={createAvatar(avatarCollections?.[avatarStyle], {
        ...rest,
        flip,
      }).toDataUriSync()}
    />
  );
};
