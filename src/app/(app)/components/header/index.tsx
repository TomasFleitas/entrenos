'use client';

import React from 'react';
import style from './index.module.scss';
import { Button, Tooltip } from 'antd';
import { useUserPreference } from '@/app/provider/userPreference';
import { MenuOutlined } from '@ant-design/icons';
import { useAuth } from '@/app/provider/authContext';

import { Logo } from '@/app/components/logo';
import { HelpEnchangeIcon, HelpIcon, MoneyCircleIcon } from '../icons';

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
            <HelpEnchangeIcon />
          </Tooltip>

          <Tooltip
            arrow={false}
            className={style.points}
            zIndex={3}
            trigger={['click']}
            title="Las 'coins' son una moneda virtual en nuestra aplicación, ganadas a través de colaboraciones. Úsalas para comprar y mejorar avatares, ¡mejorando tu experiencia de juego!"
          >
            <MoneyCircleIcon fill="green" width={24} height={24} />
            <h4>{user?.coins?.toFixed(1) || 0.0}</h4>
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
