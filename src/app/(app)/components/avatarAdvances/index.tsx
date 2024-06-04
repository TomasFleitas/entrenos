import {
  Form,
  FormInstance,
  Modal,
  Select,
  Input,
  Avatar as AntAvatar,
} from 'antd';
import React, { useEffect, useState } from 'react';
import style from './index.module.scss';

import { createAvatar } from '@dicebear/core';
import { useAuth } from '@/app/provider/authContext';
import { avatarCollections } from '@/utils/const';
import {
  avatarOptions,
  getCheapest,
  getStyleCost,
} from '@/app/api/utils/const';
import { MoneyCircleIcon } from '../icons';

type Props = {
  open: boolean;
  form: FormInstance<any>;
  onCancel: () => void;
  onOk: () => void;
};

export const AvatarAdvances = ({ open, form, onCancel, onOk }: Props) => {
  const { user } = useAuth();
  const defautlStyle = user?.avatar?.avatarStyle || getCheapest()?.value!;
  const [avatarStyle, setAvatarStyle] = useState(defautlStyle);
  const seed = Form.useWatch('seed', form);

  const uri = createAvatar(avatarCollections?.[avatarStyle], {
    seed,
  }).toDataUriSync();

  useEffect(() => {
    open && form.setFieldsValue({ avatarStyle });
    !open && setAvatarStyle(defautlStyle);
  }, [avatarStyle, form, open]);

  return (
    <Modal
      title={<div className={style.title}>Editar Avatar</div>}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form.Item name="avatarStyle" label="Estilo">
        <Select onChange={(value) => setAvatarStyle(value)}>
          {avatarOptions
            .sort((a, b) => a.cost - b.cost)
            .map((option) => (
              <Select.Option
                disabled={option.cost > (user?.coins ?? 0)}
                key={option.value}
                value={option.value}
              >
                <div className={style.option}>
                  <div>
                    <MoneyCircleIcon fill="green" width={18} height={18} />
                    <b>{option.cost}</b>
                  </div>
                  {option.label}
                </div>
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <div className={style.avatar}>
        <AntAvatar shape="circle" src={uri} />
      </div>
      <Form.Item
        name="seed"
        label="Clave"
        help="La clave genera un valor único para tu avatar."
      >
        <Input
          disabled={getStyleCost(avatarStyle) > (user?.coins ?? 0)}
          maxLength={80}
          showCount
        />
      </Form.Item>
    </Modal>
  );
};
