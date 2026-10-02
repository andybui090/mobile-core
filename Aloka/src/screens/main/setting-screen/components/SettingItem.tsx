import { IconX } from '@/components';
import { screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

interface SettingItemProps {
  label: string;
  iconName?: any;
  iconType?: any;
  iconBg?: any;
  iconColor?: any;
  titleColor?:any;
  onPress?: (item: any) => void;
  isBorderBottom?: boolean;
  leftRowChill?: () => React.ReactElement;
  customIconLeft?: () => React.ReactElement;
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

const SettingItem = (props: SettingItemProps) => {
  const styles = useStyles();
  const {
    label,
    iconName,
    iconType,
    iconBg,
    iconColor,
    titleColor,
    onPress,
    isBorderBottom = false,
    leftRowChill,
    customIconLeft,
  } = props;
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const renderChill = () => {
    if (leftRowChill) {
      return leftRowChill();
    }
  };

  const renderLeftIcon = () => {
    if (customIconLeft) {
      return customIconLeft();
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[screenStyles.rowBettween, screenStyles.pH16]}
    >
      {!customIconLeft && <Row start>
        <View
          style={[
            {
              backgroundColor: iconBg,
            },
            styles.wrapper,
          ]}
        >
          <IconX name={iconName} type={iconType} size={20} color={iconColor ?? 'white'} />
        </View>
      </Row>}
      {renderLeftIcon()}
      <Row
        between
        style={[
          screenStyles.flex1,
          screenStyles.mL16,
          isBorderBottom ? screenStyles.bottomLine : {},
          screenStyles.pV14,
        ]}
      >
        <CText h5 w400 color={titleColor ?? colors.c344054}>
          {t(label)}
        </CText>
        {!leftRowChill && (
          <IconX
            name={'chevron-right' as any}
            type={'octicons'}
            color={colors.c98A2B3}
            size={24}
          />
        )}
        {renderChill()}
      </Row>
    </TouchableOpacity>
  );
};

export default SettingItem;
