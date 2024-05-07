import style from './index.module.scss';
import { message } from 'antd';

export const NotificationPermission = () => {
  const handleEnableNotification = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        message.success('¡Notificaciones habilitadas!');
      } else {
        message.error('No se pudo habilitar las notificaciones.');
      }
    });
  };

  const handleDisableNotification = () => {
    message.info(
      'Puedes cambiar la configuración de notificaciones en la configuración de tu navegador.',
    );
  };

  return (
    <div className={style.configuration}>
      {('default' === Notification.permission && (
        <p>
          Las notificaciones están deshabilitadas.{' '}
          <a onClick={handleEnableNotification} style={{ cursor: 'pointer' }}>
            Haz click aquí
          </a>{' '}
          para habilitarlas.
        </p>
      )) ||
        ('denied' !== Notification.permission && (
          <p>
            Las notificaciones están habilitadas.{' '}
            <a
              onClick={handleDisableNotification}
              style={{ cursor: 'pointer' }}
            >
              Haz click aquí
            </a>{' '}
            para deshabilitarlas.
          </p>
        ))}
      {'denied' === Notification.permission && (
        <p>
          Las notificaciones están deshabilitadas.{' '}
          <span style={{ color: 'red' }}>
            Debes cambiar la configuración de notificaciones en el navegador.
          </span>
        </p>
      )}
    </div>
  );
};
