import { images, screenStyles } from '@/configs';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  imgEmpty: {
    height: 136,
    width: 136,
    marginBottom: 16,
  },
}));

interface EmptyBookingProps {
  message?: string; // cho phép custom message nếu cần
}

const EmptyBooking: React.FC<EmptyBookingProps> = ({ message }) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={[screenStyles.flex1Center, { justifyContent: 'center' }]}>
      <Image
        style={styles.imgEmpty}
        source={images.work.ico_empty_booking}
        resizeMode="contain"
      />
      <CText h5 w600 color={colors.cAAAAAA}>
        {message ?? t('booking.noAppointment', 'No appointment yet')}
      </CText>
    </View>
  );
};

export default EmptyBooking;
