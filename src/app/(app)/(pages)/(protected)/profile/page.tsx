'use client';

import { ConnectMercadoPago } from '@/app/(app)/components/mercadoPago';
import { useAuth } from '@/app/provider/authContext';
import { Button, DatePicker, Divider, Form, Input } from 'antd';
import style from './index.module.scss';

const { Item } = Form;

export default function ProfilePage() {
  const [form] = Form.useForm();
  const { user, updateUser } = useAuth();

  return (
    <div className={style.profile}>
      <Divider>Perfil</Divider>
      <Form
        layout="vertical"
        initialValues={{
          name: user?.name || user?.defaultName,
          birthday: user?.birthday,
        }}
        form={form}
        onFinish={updateUser}
      >
        <Item style={{ width: 300 }} label="Nombre" name="name">
          <Input maxLength={80} />
        </Item>
        <Item label="Cumpleaños" name="birthday">
          <DatePicker format="DD/MM/YYYY  " />
        </Item>

        <Item>
          <Button htmlType='submit' className={style.button}>Actualizar</Button>
        </Item>
      </Form>

      <Divider>Mercado Pago</Divider>

      <ConnectMercadoPago />
    </div>
  );
}
