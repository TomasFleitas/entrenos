import { notification, Typography } from 'antd';
import { WarningOutlined, CheckOutlined } from '@ant-design/icons';

const defaultNotificationProps = {
  duration: 5,
  placement: 'centerBottom',
  style: { borderRadius: '10px', width: '355px' },
};

const { Text } = Typography;

const useNotify = () => {
  const openErrorNotify = (message: string) => {
    notification.error({
      ...defaultNotificationProps,
      message: <Text>{message}</Text>,
      style: { ...defaultNotificationProps.style },
      icon: <WarningOutlined style={{ color: '#FF4D4D' }} />,
    } as any);
  };

  const openSuccessNotify = (message: string) => {
    notification.success({
      ...defaultNotificationProps,
      message: <Text>{message}</Text>,
      style: { ...defaultNotificationProps.style },
      icon: <CheckOutlined style={{ color: '#02BF80' }} />,
    } as any);
  };

  return { openErrorNotify, openSuccessNotify };
};

export { useNotify };
