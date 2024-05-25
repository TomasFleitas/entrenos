import { createAvatar } from '@dicebear/core';
import { Avatar, Form, FormInstance, Input } from 'antd';
import style from './index.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { AvatarAdvances } from '../avatarAdvances';
import { useAuth } from '@/app/provider/authContext';
import { avatarCollections } from '@/utils/const';

const { Item } = Form;

type Props = {
  form: FormInstance;
};

export const AvatarEditor = ({ form }: Props) => {
  const { user } = useAuth();
  const seed = Form.useWatch('seed', form);
  const avatarStyle = Form.useWatch('avatarStyle', form);
  const [openAdvances, setAdvances] = useState(false);

  const uri = createAvatar(
    avatarCollections?.[
      avatarStyle || form.getFieldValue('avatarStyle') || 'lorelei'
    ],
    {
      seed,
    },
  ).toDataUriSync();

  const handleOnCancel = () => {
    setAdvances(false);
    form.setFieldsValue(user?.avatar);
  };

  const handleOnOk = () => {
    setAdvances(false);
  };

  const setOpenEdit = () => {
    setAdvances(true);
    form.setFieldsValue(user?.avatar);
  };

  return (
    <>
      <div className={style.avatar}>
        <Avatar shape="circle" src={uri} />
      </div>

      <Item
        style={{ width: 300 }}
        label="Clave"
        help="La clave genera un valor único para tu avatar."
        name="seed"
      >
        <Input
          maxLength={80}
          showCount
          addonAfter={<EditOutlined onClick={setOpenEdit} />}
        />
      </Item>
      <AvatarAdvances
        form={form}
        onOk={handleOnOk}
        open={openAdvances}
        onCancel={handleOnCancel}
      />
    </>
  );
};
