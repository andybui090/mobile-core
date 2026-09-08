import { ICON_TYPE, IconX } from '@/components';
import { screenStyles } from '@/configs';
import { spacings } from '@/theme';
import { CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import useStyles from './styles';

interface RenderItemProps {
  title: string;
  nameAlias?: string;
  titleColor?: string;
  onPress?: () => void;
  nameIcon?: string;
  typeIcon?: string;
  iconBg?: string;
  leftRowChill?: () => React.ReactElement;
  isHideBottom?: boolean;
  customIconLeft?: () => React.ReactElement;
}

export const RenderItem = (props: RenderItemProps) => {
  const styles = useStyles();
  const {
    title,
    nameAlias,
    onPress,
    titleColor,
    nameIcon,
    typeIcon,
    iconBg,
    leftRowChill,
    isHideBottom,
    customIconLeft,
  } = props;
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const _renderChill = () => {
    if (leftRowChill) {
      return leftRowChill();
    }
    return null;
  };

  const _renderLeftIcon = () => {
    if (customIconLeft) {
      return customIconLeft();
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[screenStyles.rowBettween, { marginTop: 16 }]}
    >
      {nameIcon && (
        <View
          style={{
            backgroundColor: iconBg,
            borderRadius: 6,
            padding: 4,
            marginRight: spacings.md,
            marginBottom: spacings.md,
            minWidth: 28,
            minHeight: 28,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconX
            name={nameIcon as any}
            type={(typeIcon as any) || 'ionicons'}
            color={colors.white}
            size={16}
          />
        </View>
      )}
      {_renderLeftIcon()}
      <Row
        between
        style={!isHideBottom ? styles.rowContainer : styles.rowContainer2}
      >
        <CText h5 style={{ color: titleColor || colors.c101828 || '#101828' }}>
          {t(title) || nameAlias || title}
        </CText>
        {!leftRowChill && (
          <IconX
            name={'chevron-forward'}
            type={ICON_TYPE.IONICONS}
            color={colors.c98A2B3 || '#98A2B3'}
            size={20}
          />
        )}
        {_renderChill()}
      </Row>
    </TouchableOpacity>
  );
};

export default RenderItem;
