import { fonts } from '@/configs';
import { useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import AwesomeAlert from './AwesomeAlert';

type APILoadingProps = {
  showAlert: boolean;
  isLoadingAPI?: boolean;
  isSuccess?: boolean;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  hideAlert?: () => void;
  onConfirmPressed?: () => void;
  isShowProgress?: boolean;
  showCancelButton?: boolean;
  progressColor?: string;
};

export const APILoading = (props: APILoadingProps) => {
  const { t } = useTranslation();
  const { theme: { colors } } = useTheme();
  const {
    showAlert = false,
    isLoadingAPI = false,
    isSuccess = false,
    title = 'Cập Nhật Thông Tin',
    message = 'Yêu cầu của bạn đã được xử lý thành công',
    cancelText = 'Bỏ qua',
    confirmText = 'Đồng ý',
    hideAlert = () => { },
    onConfirmPressed = () => { },
    isShowProgress = false,
    showCancelButton = false,
    progressColor = colors.primary
  } = props;

  if (isShowProgress) {
    return (
      <AwesomeAlert
        show={showAlert}
        showProgress={true}
        progressColor={progressColor ? progressColor : colors.primary}
        title={title}
        message={message}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={false}
        cancelText={''}
        confirmText={''}
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => { }}
        onConfirmPressed={() => { }}
        contentContainerStyle={{
          opacity: 0.9,
        }}
        titleStyle={{
          fontFamily: fonts.inter,
          fontSize: 16,
          fontWeight: '500',
          color: colors.c101828,
        }}
        messageStyle={{
          fontFamily: fonts.inter,
          fontSize: 14,
          color: '#4F4F4F',
        }}
        cancelButtonTextStyle={{
          fontFamily: fonts.inter,
        }}
        confirmButtonStyle={{
          backgroundColor: colors.primary,
        }}
      />
    );
  } else if (isLoadingAPI) {
    return (
      <AwesomeAlert
        show={showAlert}
        showProgress={true}
        progressColor={progressColor ? progressColor : colors.primary}
        title={''}
        message={t("common.processing", "Processing...")}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={false}
        cancelText={''}
        confirmText={''}
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => { }}
        onConfirmPressed={() => { }}
        contentContainerStyle={{
          opacity: 0.9,
          backgroundColor: colors.background
        }}
        titleStyle={{
          fontFamily: fonts.inter,
        }}
        messageStyle={{
          fontFamily: fonts.inter,
          fontSize: 12,
          fontWeight: 400,
          color: colors.c101828,
          marginTop: 10,
        }}
        cancelButtonTextStyle={{
          fontFamily: fonts.inter,
        }}
        confirmButtonStyle={{
          backgroundColor: colors.primary,
        }}
        progressSize={'small'}
      />
    );
  } else if (isSuccess) {
    return (
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        progressColor={progressColor ? progressColor : colors.primary}
        title={title}
        message={message}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={showCancelButton}
        showConfirmButton={true}
        cancelText={cancelText}
        confirmText={confirmText}
        confirmButtonColor="#DD6B55"
        onCancelPressed={hideAlert}
        onConfirmPressed={onConfirmPressed}
        contentContainerStyle={{
          opacity: 0.95,
        }}
        titleStyle={{
          fontFamily: fonts.inter,
        }}
        messageStyle={{
          fontFamily: fonts.inter,
        }}
        cancelButtonTextStyle={{
          fontFamily: fonts.inter,
        }}
        confirmButtonStyle={{
          backgroundColor: colors.primary,
          paddingHorizontal: 24,
        }}
      />
    );
  }
  return null;
};