'use client';

import { ConnectMercadoPago } from '@/app/(app)/components/mercadoPago';
import { useAuth } from '@/app/provider/authContext';
import { Button, DatePicker, Divider, Form, Input } from 'antd';

const { Item } = Form;

export default function ProfilePage() {
  const [form] = Form.useForm();
  const { user, updateUser } = useAuth();

  return (
    <div>
      <Form
        layout="vertical"
        initialValues={{
          name: user?.name || user?.defaultName,
          birthday: user?.birthday,
        }}
        form={form}
        onFinish={updateUser}
      >
        <Item label="Nombre" name="name">
          <Input />
        </Item>
        <Item label="Cumpleaños" name="birthday">
          <DatePicker format="DD/MM/YYYY  " />
        </Item>

        <Item>
          <Button>Guardar</Button>
        </Item>
      </Form>

      <Divider>Mercado Pago</Divider>

      <ConnectMercadoPago />
    </div>
  );
}
