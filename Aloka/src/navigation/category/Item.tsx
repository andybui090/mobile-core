import {ICON_TYPE, IconX, ImageHelper} from '@/components';
import {ScreenWidth, checkActiveObjectInArr, screenStyles} from '@/configs';
import {spacings} from '@/theme/spacings';
import {CText, Row} from '@/utils';
import {Divider} from '@rneui/base';
import {makeStyles, useTheme} from '@rneui/themed';
import {useState} from 'react';
import {LayoutAnimation, Pressable, View} from 'react-native';

const useStyles = makeStyles(({colors}) => ({
  box: {
    width: ScreenWidth / 2 - 30,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cEAECF0,
    padding: spacings.sm,
  },
  iconWrap: {
    ...screenStyles.bR8,
  },
}));

const Item = ({item, onPressItem, listItemChoose}: any) => {
  const styles = useStyles();
  const {
    theme: {colors},
  } = useTheme();

  const [open, setOpen] = useState(true);
  const {name, children} = item;

  const hanlePressItem = () => {
    LayoutAnimation.easeInEaseOut();
    setOpen(!open);
  };

  const renderErrorImage = () => {
    return (
      <IconX
        origin={ICON_TYPE.ICONICONS}
        name={'medkit-outline'}
        size={24}
        color={colors.c667085}
      />
    );
  };

  const renderItemChild = (item: any, idx: number) => {
    const {icon, name, id} = item;
    const isActive = checkActiveObjectInArr(listItemChoose, 'id', id);
    return (
      <Pressable
        key={idx}
        style={[styles.box, isActive && {borderColor: colors.primary}]}
        onPress={() => onPressItem(item)}>
        <View style={styles.iconWrap}>
          <View style={[screenStyles.box40, screenStyles.overflowHidden]}>
            <ImageHelper
              source={{uri: icon}}
              isLogo
              sizeLogo={40}
              resizeMode={'contain'}
              renderErrorImage={renderErrorImage}
            />
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
              origin={ICON_TYPE.MATERIAL_COMMUNITY}
              name={'checkbox-marked-circle'}
              size={24}
              color={colors.primary}
            />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <>
      <View style={screenStyles.pV12}>
        <Pressable onPress={hanlePressItem} style={screenStyles.pH24}>
          <Row between>
            <CText h5 color={colors.primary}>
              {name}
            </CText>
            <IconX
              origin={ICON_TYPE.ICONICONS}
              name={open ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.c101828}
            />
          </Row>
        </Pressable>
        <View
          style={[
            screenStyles.pH24,
            screenStyles.rowWrap,
            screenStyles.justifyBetween,
          ]}>
          {open && children.map(renderItemChild)}
        </View>
      </View>
      <Divider color={colors.cEAECF0} width={1} />
    </>
  );
};

export default Item;
