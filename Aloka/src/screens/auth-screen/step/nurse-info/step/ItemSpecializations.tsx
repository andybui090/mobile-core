import {IconType, IconX, ImageHelper} from '@/components';
import {ScreenWidth, screenStyles} from '@/configs';
import {spacings} from '@/theme/spacings';
import {CText} from '@/utils';
import {makeStyles, useTheme} from '@rneui/themed';
import {Pressable, View} from 'react-native';

const useStyles = makeStyles(({colors}) => ({
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
}: any) => {
  const styles = useStyles();
  const {
    theme: {colors},
  } = useTheme();

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

  const {code, created_at, icon, name, parent_id, status, updated_at, id} =
    item;
  const isActive = checkActive(id);
  return (
    <Pressable
      style={[
        styles.box,
        isActive && {borderColor: colors.primary},
        (index == 0 || index == 1) && {marginTop: 0},
      ]}
      onPress={() => onPressItem(item)}>
      <View style={styles.iconWrap}>
        <View style={[screenStyles.box40, screenStyles.overflowHidden]}>
          <ImageHelper source={{uri: icon}} resizeMode={'contain'} renderErrorImage={renderErrorImage}/>
        </View>
      </View>
      <CText
        h6
        color={colors.c344054}
        style={screenStyles.mT8}
        numberOfLines={1}>
        {name || 'NAN'}
      </CText>
      {isActive && (
        <View style={{position: 'absolute', right: 8, top: 8}}>
          <IconX
            type={IconType.MATERIAL_DESIGN_ICONS}
            name={'checkbox-marked-circle'}
            size={24}
            color={colors.primary}
          />
        </View>
      )}
    </Pressable>
  );
};

export default ItemSpecializations;
