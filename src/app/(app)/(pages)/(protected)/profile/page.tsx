'use client';

import { ConnectMercadoPago } from '@/app/(app)/components/mercadoPago';
import { useAuth } from '@/app/provider/authContext';
import { Button, DatePicker, Divider, Form, Input } from 'antd';
import style from './index.module.scss';
import dayjs from 'dayjs';
import { AvatarEditor } from '@/app/(app)/components/avatarEditor';

const { Item } = Form;

export default function ProfilePage() {
  const [form] = Form.useForm();
  const { user, updateUser } = useAuth();

  return (
    <div className={style.profile}>
      <Form
        layout="vertical"
        initialValues={{
          name: user?.name || user?.defaultName,
          birthday: user?.birthday && dayjs(user?.birthday),
          seed: user?.avatar?.seed,
        }}
        form={form}
        onFinish={updateUser}
      >
        <AvatarEditor form={form} />
        <Divider>Datos personales</Divider>
        <Item style={{ width: 300 }} label="Nombre" name="name">
          <Input maxLength={80} />
        </Item>
        <Item label="Cumpleaños" name="birthday">
          <DatePicker format="DD/MM/YYYY  " />
        </Item>

        <Item>
          <Button
            type="default"
            shape="round"
            htmlType="submit"
            className={style.button}
          >
            ACTUALIZAR
          </Button>
        </Item>
        <Divider>MERCADO PAGO</Divider>
        <ConnectMercadoPago />
      </Form>
    </div>
  );
}
