import {
  Form,
  FormInstance,
  Modal,
  Select,
  Input,
  Avatar as AntAvatar,
} from 'antd';
import React, { useEffect, useState } from 'react';
import style from './index.module.scss';
import {
  lorelei,
  adventurer,
  adventurerNeutral,
  avataaars,
  avataaarsNeutral,
  bigEars,
  bigEarsNeutral,
  bigSmile,
  bottts,
  botttsNeutral,
  croodles,
  croodlesNeutral,
  funEmoji,
  icons,
  identicon,
  loreleiNeutral,
  micah,
  miniavs,
  openPeeps,
  personas,
  pixelArt,
  pixelArtNeutral,
  shapes,
  thumbs,
} from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { useAuth } from '@/app/provider/authContext';

type Props = {
  open: boolean;
  form: FormInstance<any>;
  onCancel: () => void;
  onOk: () => void;
};

const avatarOptions = [
  { label: 'Lorelei', value: 'lorelei' },
  { label: 'Adventurer', value: 'adventurer' },
  { label: 'Adventurer Neutral', value: 'adventurerNeutral' },
  { label: 'Avataaars', value: 'avataaars' },
  { label: 'Avataaars Neutral', value: 'avataaarsNeutral' },
  { label: 'Big Ears', value: 'bigEars' },
  { label: 'Big Ears Neutral', value: 'bigEarsNeutral' },
  { label: 'Big Smile', value: 'bigSmile' },
  { label: 'Bottts', value: 'bottts' },
  { label: 'Bottts Neutral', value: 'botttsNeutral' },
  { label: 'Croodles', value: 'croodles' },
  { label: 'Croodles Neutral', value: 'croodlesNeutral' },
  { label: 'Fun Emoji', value: 'funEmoji' },
  { label: 'Icons', value: 'icons' },
  { label: 'Identicon', value: 'identicon' },
  { label: 'Lorelei Neutral', value: 'loreleiNeutral' },
  { label: 'Micah', value: 'micah' },
  { label: 'Miniavs', value: 'miniavs' },
  { label: 'Open Peeps', value: 'openPeeps' },
  { label: 'Personas', value: 'personas' },
  { label: 'Pixel Art', value: 'pixelArt' },
  { label: 'Pixel Art Neutral', value: 'pixelArtNeutral' },
  { label: 'Shapes', value: 'shapes' },
  { label: 'Thumbs', value: 'thumbs' },
];

export const avatarCollections: { [key: string]: any } = {
  lorelei,
  adventurer,
  adventurerNeutral,
  avataaars,
  avataaarsNeutral,
  bigEars,
  bigEarsNeutral,
  bigSmile,
  bottts,
  botttsNeutral,
  croodles,
  croodlesNeutral,
  funEmoji,
  icons,
  identicon,
  loreleiNeutral,
  micah,
  miniavs,
  openPeeps,
  personas,
  pixelArt,
  pixelArtNeutral,
  shapes,
  thumbs,
};

export const AvatarAdvances = ({ open, form, onCancel, onOk }: Props) => {
  const { user } = useAuth();
  const defautlStyle = user?.avatar?.avatarStyle || 'lorelei';
  const [avatarStyle, setAvatarStyle] = useState(defautlStyle);
  const seed = Form.useWatch('seed', form);

  const uri = createAvatar(avatarCollections?.[avatarStyle], {
    seed,
  }).toDataUriSync();

  useEffect(() => {
    open && form.setFieldsValue({ avatarStyle });
    !open && setAvatarStyle(defautlStyle);
  }, [avatarStyle, form, open]);

  return (
    <Modal title="Editar Avatar" open={open} onOk={onOk} onCancel={onCancel}>
      <div className={style.avatar}>
        <AntAvatar shape="circle" src={uri} />
      </div>
      <Form.Item name="avatarStyle" label="Estilo">
        <Select
          className={style.select}
          onChange={(value) => setAvatarStyle(value)}
        >
          {avatarOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="seed"
        label="Clave"
        help="La clave genera un valor único para tu avatar."
      >
        <Input maxLength={80} showCount />
      </Form.Item>
    </Modal>
  );
};
