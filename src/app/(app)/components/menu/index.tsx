import { useUserPreference } from '@/app/provider/userPreference';
import { Button, Drawer } from 'antd';
import React from 'react';
import style from './index.module.scss';
import { useAuth } from '@/app/provider/authContext';
import {
  LogoutOutlined,
  HomeOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

export const Menu = () => {
  const { signOut } = useAuth();
  const {
    openMenu,
    preferences: { isOpenMenu },
  } = useUserPreference();

  return (
    <Drawer
      className={style.menu}
      open={isOpenMenu}
      placement="right"
      onClose={() => openMenu(false)}
    >
      <div className={style.list}>
        <Link href={'/home'}>
          <HomeOutlined /> Home
        </Link>
        <Link href={'/donations'}>
          <UnorderedListOutlined />
          Donaciones recibidas
        </Link>
        <Link href={'/profile'}>
          <UserOutlined />
          Perfil
        </Link>
      </div>
      <div>
        <Button danger type="text" onClick={signOut}>
          <LogoutOutlined />
          Cerrar Sesión
        </Button>
      </div>
    </Drawer>
  );
};
