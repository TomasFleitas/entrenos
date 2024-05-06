'use client';

import React from 'react';
import style from './index.module.scss';
import { Button, Tooltip } from 'antd';
import { useUserPreference } from '@/app/provider/userPreference';
import { MenuOutlined } from '@ant-design/icons';
import { useAuth } from '@/app/provider/authContext';

import { Logo } from '@/app/components/logo';
import { HelpIcon } from '../icons';

export const Header = () => {
  const { isLogged, user } = useAuth();
  const { openMenu } = useUserPreference();

  return (
    <div className={style['header']}>
      <Logo />
      {isLogged && (
        <>
          <Tooltip
            arrow={false}
            className={style.points}
            zIndex={3}
            trigger={['click']}
            title="Este valor refleja la probabilidad de recibir una colaboración de otra persona; cuanto mayor sea, más posibilidades hay."
          >
            <h4>{user?.score?.toFixed(2) || 0.0}</h4>
            <HelpIcon />
          </Tooltip>

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
