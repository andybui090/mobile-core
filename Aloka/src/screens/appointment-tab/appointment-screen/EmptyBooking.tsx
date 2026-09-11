import { images } from '@/configs';
import { appointmentTabRoute } from '@/constants';
import { CText } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity } from 'react-native';

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  imgEmpty: {
    height: 136,
    width: 136,
    marginBottom: 16,
  },
}));

interface EmptyBookingProps {
  message?: string;
  onPress?: () => void;
}

const EmptyBooking: React.FC<EmptyBookingProps> = ({ message, onPress }) => {
  const navigation = useNavigation<any>();
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate(appointmentTabRoute.appointmentList || 'AppointmentList');
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.container}
    >
      <Image
        style={styles.imgEmpty}
        source={images.profile.ico_EmptyBooking}
        resizeMode="contain"
      />
      <CText h5 w600 color={colors.cAAAAAA || '#AAAAAA'}>
        {message ?? t('booking.noAppointment', 'Chưa có lịch hẹn')}
      </CText>
    </TouchableOpacity>
  );
};

export default EmptyBooking;
