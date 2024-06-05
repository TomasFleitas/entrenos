import { Form, FormInstance, Modal, Select, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './index.module.scss';
import { useAuth } from '@/app/provider/authContext';
import { avatarOptions, getStyleCost } from '@/app/api/utils/const';
import { MoneyCircleIcon } from '../icons';
import { UserAvatar } from '../userAvatar';

type Props = {
  open: boolean;
  form: FormInstance<any>;
  onCancel: () => void;
  onOk: () => void;
};

export const AvatarAdvances = ({ open, form, onCancel, onOk }: Props) => {
  const { user } = useAuth();
  const defautlStyle = user?.avatar?.avatarStyle;
  const [avatarStyle, setAvatarStyle] = useState(defautlStyle);
  const seed = Form.useWatch('seed', form);

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
                  {!!option.cost && (
                    <div>
                      <MoneyCircleIcon fill="green" width={18} height={18} />
                      <b>{option.cost}</b>
                    </div>
                  )}
                  {option.label}
                </div>
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <div className={style.center}>
        <UserAvatar
          type="profile"
          avatarStyle={avatarStyle}
          name={user?.name || user?.defaultName}
          seed={seed}
        />
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
