import { IconX } from '@/components';
import { screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageSource, TouchableOpacity, View } from 'react-native';

interface MenuItemProps {
  label: string;
  des: string;
  imgSrc: ImageSource;
  onPress?: (item: any) => void;
  isBorderBottom?: boolean;
  leftRowChill?: () => React.ReactElement;
}

const MenuItem = (props: MenuItemProps) => {
  const {
    label,
    des,
    imgSrc,
    onPress,
    isBorderBottom = false,
    leftRowChill,
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

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[screenStyles.rowBettween, 
    //   screenStyles.pH16
    ]}
    >
      <Row start>
        <Image
          source={imgSrc}
          style={screenStyles.box34}
          resizeMode="contain"
        />
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
        <View style={screenStyles.flex1}>
          <CText h5 w500 color={colors.c101828}>
            {t(label)}
          </CText>
          <CText h5 w400 color={colors.c344054}>
            {t(des)}
          </CText>
        </View>
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

export default MenuItem;
