import { IconType, IconX } from '@/components';
import { screenStyles } from '@/configs';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
}));

interface EmptyBookingProps {
  message?: string; // cho phép custom message nếu cần
}

export const EmptyBooking: React.FC<EmptyBookingProps> = ({ message }) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={[screenStyles.flex1Center, { justifyContent: 'center' }]}>
      <IconX
        type={IconType.IONICONS}
        name="calendar-outline"
        size={64}
        color="#D0D5DD"
      />
      <CText h5 w500 color={colors.cAAAAAA} style={screenStyles.mT10}>
        {message ?? t('booking.noAppointment', 'No appointment yet')}
      </CText>
    </View>
  );
};
