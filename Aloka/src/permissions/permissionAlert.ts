import { t } from 'i18next';
import { Alert } from 'react-native';
import { openSettings } from 'react-native-permissions';

const showPermissionAlert = (title: string, message: string) => {
  Alert.alert(
    title,
    message,
    [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('permission.setting'),
        onPress: () => openSettings().catch(() => console.warn('Cannot open settings')),
      },
    ]
  );
};

export const showCameraPermissionAlert = () => {
  showPermissionAlert(
    t('permission.camera.title'),
    t('permission.camera.description'),
  );
};

export const showPhotoPermissionAlert = () =>
  showPermissionAlert(
    t('permission.photo.title'),
    t('permission.photo.description'),
  );

export const showPhotoVideoPermissionAlert = () =>
  showPermissionAlert(
    t('permission.media.title'),
    t('permission.media.description'),
  );

export const showDownloadPermissionAlert = () =>
  showPermissionAlert(
    t('permission.download.title'),
    t('permission.download.description'),
  );