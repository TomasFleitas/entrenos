import { createAvatar } from '@dicebear/core';
import { Avatar } from 'antd';
import style from './index.module.scss';
import { avatarCollections } from '../avatarAdvances';

type Props = {
  seed?: string;
  avatarStyle?: string;
};

export const UserAvatar = ({ avatarStyle, ...rest }: Props) => (
  <Avatar
    className={style.avatar}
    src={createAvatar(
      avatarCollections?.[avatarStyle || 'lorelei'],
      rest,
    ).toDataUriSync()}
  />
);
