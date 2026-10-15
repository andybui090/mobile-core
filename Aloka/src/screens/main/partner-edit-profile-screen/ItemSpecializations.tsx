import { IconType, IconX, ImageHelper } from '@/components';
import { ScreenWidth, images, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import { spacings } from '@/theme/spacings';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { Image, Pressable, View } from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  box: {
    width: ScreenWidth / 2 - 30,
    marginTop: 10,
    marginLeft: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cEAECF0,
    padding: spacings.sm,
  },
  iconWrap: {
    ...screenStyles.bR8,
  },
}));

const ItemSpecializations = ({
  item,
  index,
  onPressItem,
  listItemChoose,
  specializationArrOld,
  isChangeSpecialization,
  onPressKycInfo,
}: any) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { user } = useContext(AppContext);

  const checkActive = (id: number) => {
    let isActive = false;
    for (let i = 0; i < listItemChoose.length; i++) {
      if (id === listItemChoose[i].id) {
        isActive = true;
        break;
      }
    }
    return isActive;
  };

  const checkOldActive = (id: number) => {
    let isActive = false;
    for (let i = 0; i < specializationArrOld.length; i++) {
      if (id === specializationArrOld[i].id) {
        isActive = true;
        break;
      }
    }
    return isActive;
  };

  const renderErrorImage = () => {
    return (
      <IconX
        type={IconType.IONICONS}
        name={'medkit-outline'}
        size={24}
        color={colors.c667085}
      />
    );
  };

  const { code, created_at, icon, name, parent_id, status, updated_at, id } =
    item;
  const isActive = checkActive(id);
  const isActiveOld = checkOldActive(id);
  return (
    <Pressable
      style={[
        styles.box,
        isActive && { borderColor: colors.primary },
        (index == 0 || index == 1) && { marginTop: 0 },
      ]}
      onPress={() => onPressItem(item)}
    >
      <View style={styles.iconWrap}>
        <View style={[screenStyles.box40, screenStyles.overflowHidden]}>
          <ImageHelper
            source={{ uri: icon }}
            resizeMode={'contain'}
            renderErrorImage={renderErrorImage}
          />
        </View>
      </View>
      <CText
        h6
        color={colors.c344054}
        style={screenStyles.mT8}
        numberOfLines={1}
      >
        {name || 'NAN'}
      </CText>
      {isActive && (
        <View style={{ position: 'absolute', right: 8, top: 8 }}>
          <IconX
            type={IconType.MATERIAL_DESIGN_ICONS}
            name={'checkbox-marked-circle'}
            size={24}
            color={colors.primary}
          />
        </View>
      )}
      {isActiveOld && isChangeSpecialization && (
        <View style={{ position: 'absolute', right: 8, bottom: 8 }}>
          <Pressable hitSlop={screenStyles.hitSlop20} onPress={onPressKycInfo}>
            <Image
              source={
                user.personalization?.status == 2
                  ? images.global.kyc_2
                  : images.global.kyc_0
              }
              style={screenStyles.box16}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

export default ItemSpecializations;
