import { IconX } from '@/components';
import { screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

interface MenuItemProps {
  label: string;
  iconName: any;
  iconType: any;
  iconBg?: any;
  iconColor?: any;
  onPress?: (item: any) => void;
  isBorderBottom?: boolean;
}

const useStyles = makeStyles(({ colors }) => ({
  wrapper: {
    borderRadius: 4,
    padding: 4,
    minWidth: 25,
    minHeight: 25,
    alignItems: 'center' as const,
  },
}));

const MenuItem = (props: MenuItemProps) => {
  const styles = useStyles();
  const {
    label,
    iconName,
    iconType,
    iconBg,
    iconColor,
    onPress,
    isBorderBottom = false,
  } = props;
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[screenStyles.rowBettween, screenStyles.pH16]}
    >
      <Row start>
        <View
          style={[
            {
              backgroundColor: iconBg,
            },
            styles.wrapper,
          ]}
        >
          <IconX name={iconName} type={iconType} size={20} color={iconColor} />
        </View>
      </Row>
      <Row
        between
        style={[
          screenStyles.flex1,
          screenStyles.mL16,
          isBorderBottom ? screenStyles.bottomLine : {},
          screenStyles.pV14,
        ]}
      >
        <CText h5 w400 color={colors.c344054}>
          {t(label)}
        </CText>
        <IconX
          name={'chevron-right' as any}
          type={'octicons'}
          color={colors.c98A2B3}
          size={24}
        />
      </Row>
    </TouchableOpacity>
  );
};

export default MenuItem;