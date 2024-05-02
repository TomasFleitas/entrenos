import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { Avatar } from 'antd';

const avatar = createAvatar(lorelei, {
  seed: 'pepe 2',
});

export const UserAvatar = async () => {
  const svg = avatar.toDataUriSync();
  return (
    <div>
      <Avatar src={svg} />
    </div>
  );
};
