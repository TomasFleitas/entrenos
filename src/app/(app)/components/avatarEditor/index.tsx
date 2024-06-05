import { Form, FormInstance, Input } from 'antd';
import style from './index.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { AvatarAdvances } from '../avatarAdvances';
import { useAuth } from '@/app/provider/authContext';

import { getStyleCost } from '@/app/api/utils/const';
import { UserAvatar } from '../userAvatar';

const { Item } = Form;

type Props = {
  form: FormInstance;
};

export const AvatarEditor = ({ form }: Props) => {
  const { user } = useAuth();
  const seed = Form.useWatch('seed', form);
  const avatarStyle = Form.useWatch('avatarStyle', form);
  const [openAdvances, setAdvances] = useState(false);

  const innerAvatarStyle = avatarStyle || form.getFieldValue('avatarStyle');

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
      <div className={style.center}>
        <UserAvatar
          type="profile"
          avatarStyle={innerAvatarStyle}
          name={user?.name || user?.defaultName}
          seed={seed}
        />
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
          disabled={
            getStyleCost(avatarStyle || user?.avatar?.avatarStyle) >
            (user?.coins ?? 0)
          }
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
