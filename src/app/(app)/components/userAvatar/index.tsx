import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { Avatar } from 'antd';
import style from './index.module.scss';

type Props = {
  seed?: string;
};

export const UserAvatar = (param: Props) => (
  <Avatar
    className={style.avatar}
    src={createAvatar(lorelei, param).toDataUriSync()}
  />
);
