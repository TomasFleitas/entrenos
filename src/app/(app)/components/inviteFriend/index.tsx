import { Button } from 'antd';
import { useState } from 'react';
import style from './index.module.scss';
import { WhatsAppOutlined } from '@ant-design/icons';
import axiosInstance from '@/services';
import { useAuth } from '@/app/provider/authContext';
import { CopyIcon } from '../icons';

export const InviteFriend = () => {
  const { user } = useAuth();
  const [getting, setGetting] = useState(false);
  const [whatsapp, sentWhatsapp] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const generateInvitationLink = async () => {
    setGetting(true);
    const { code } = (await axiosInstance.get('/api/user/code')).data;
    setGetting(false);
    return `${window.location.origin}/invite?friend=${code}`;
  };

  const handleCopyLink = async () => {
    const invitationLink = await generateInvitationLink();

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

  const sendWhatsapp = async () => {
    sentWhatsapp(true);
    const { code } = (await axiosInstance.get('/api/user/code')).data;
    sentWhatsapp(false);
    window.location.href = `https://wa.me/?text=${encodeURIComponent(
      `${window.location.origin}/invite?friend=${code}`,
    )}`;
  };

  return (
    <div className={style.invite}>
      {user?.inviter?.name && (
        <p className={style.invited}>
          Invitado por: <b>{user.inviter?.name}</b>
        </p>
      )}
      <div className={style.buttons}>
        <Button
          loading={getting}
          type="default"
          shape="round"
          icon={<CopyIcon fill='#00000'/>}
          onClick={handleCopyLink}
        />
        <Button
          onClick={sendWhatsapp}
          loading={whatsapp}
          type="default"
          shape="round"
          icon={<WhatsAppOutlined />}
        />
      </div>

      {linkCopied && (
        <p className={style.link}>Pega el link donde tu quieras!</p>
      )}
    </div>
  );
};
