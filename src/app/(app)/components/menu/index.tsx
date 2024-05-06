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
        <Link onClick={() => openMenu(false)} href={'/home'}>
          <HomeOutlined /> Inicio
        </Link>
        <Link onClick={() => openMenu(false)} href={'/donations'}>
          <UnorderedListOutlined />
          Colaboraciones
        </Link>
        <Link onClick={() => openMenu(false)} href={'/profile'}>
          <UserOutlined />
          Perfil
        </Link>
      </div>
      <div>
        <Button icon={<LogoutOutlined />} danger type="text" onClick={signOut}>
          CERRAR SESIÓN
        </Button>
      </div>
    </Drawer>
  );
};
