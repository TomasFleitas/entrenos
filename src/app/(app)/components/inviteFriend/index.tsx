import { useAuth } from '@/app/provider/authContext';
import { Button } from 'antd';
import { useState } from 'react';
import style from './index.module.scss';

export const InviteFriend = () => {
  const { user } = useAuth();
  const [linkCopied, setLinkCopied] = useState(false);

  const generateInvitationLink = () => {
    return `https://entrenos.app?invitedBy=${user?.uid}`;
  };

  const handleCopyLink = () => {
    const invitationLink = generateInvitationLink();

    navigator.clipboard
      .writeText(invitationLink)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      })
      .catch(() => {
        alert('Error al copiar link');
      });
  };

  return (
    <div className={style.invite}>
      <Button type="default" shape="round" onClick={handleCopyLink}>
        {linkCopied ? 'Link copiado!' : 'Copiar Link!'}
      </Button>
      {linkCopied && <p>Pega el link donde tu quieras!</p>}
    </div>
  );
};
