'use client';

import React from 'react';
import style from './index.module.scss';
import { Button } from 'antd';
import { useUserPreference } from '@/app/provider/userPreference';
import { MenuOutlined } from '@ant-design/icons';
import { useAuth } from '@/app/provider/authContext';
import Link from 'next/link';

export const Header = () => {
  const { isLogged, user } = useAuth();
  const { openMenu } = useUserPreference();

  return (
    <div className={style['header']}>
      <Link href="/">Logo</Link>
      {isLogged && (
        <>
          <h4>{user?.score?.toFixed(2) || 0.0}</h4>
          <Button
            type="text"
            onClick={() => openMenu(true)}
            icon={<MenuOutlined />}
          />
        </>
      )}
    </div>
  );
};
