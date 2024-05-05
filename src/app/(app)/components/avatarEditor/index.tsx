import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { Avatar, Form, FormInstance, Input } from 'antd';
import style from './index.module.scss';

const { Item } = Form;

type Props = {
  form: FormInstance;
};

export const AvatarEditor = ({ form }: Props) => {
  const seed = Form.useWatch('seed', form);

  const uri = createAvatar(lorelei, {
    seed,
  }).toDataUriSync();

  return (
    <>
      <div className={style.avatar}>
        <Avatar shape="circle" src={uri} />
      </div>
      <Item style={{ width: 300 }} label="Clave" help="La clave genera un valor único para tu avatar." name="seed">
        <Input maxLength={80} showCount />
      </Item>
    </>
  );
};
