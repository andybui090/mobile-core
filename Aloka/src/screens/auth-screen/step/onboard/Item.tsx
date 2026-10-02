import { IconType, IconX, ImageHelper } from '@/components';
import { screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { LayoutAnimation, Pressable, View } from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cEAECF0,
  },
}));

const Item = ({ item, onPressItem, itemChoose }: any) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const [open, setOpen] = useState(true);
  const { name, children } = item;

  const hanlePressItem = () => {
    LayoutAnimation.easeInEaseOut();
    setOpen(!open);
  };

  const renderItemChild = (itemChild: any, index: number) => {
    const { description, icon, id, name } = itemChild;
    const isActive = id === itemChoose.id;
    return (
      <Pressable
        key={index}
        style={screenStyles.mT12}
        onPress={() => onPressItem(itemChild, item)}
      >
        <Row start style={styles.container}>
          <View
            style={[
              screenStyles.box40,
              { borderRadius: 20, overflow: 'hidden' },
            ]}
          >
            <ImageHelper source={{ uri: icon }} />
          </View>
          <View style={[screenStyles.mL15, { flex: 1 }]}>
            <CText h3 w600 color={colors.c101828}>
              {name || ''}
            </CText>
            <CText h6 color={colors.c667085} style={[screenStyles.mT3]}>
              {description || ''}
            </CText>
          </View>
          {isActive && (
            <View style={{ position: 'absolute', right: 10, top: 10 }}>
              <IconX
                type={IconType.IONICONS}
                name={'checkmark-circle-outline'}
                size={24}
                color={colors.primary}
              />
            </View>
          )}
        </Row>
      </Pressable>
    );
  };

  return (
    <>
      <View style={screenStyles.pV14}>
        <Pressable onPress={hanlePressItem} style={screenStyles.pH24}>
          <Row between>
            <CText h5 color={colors.primary}>
              {name}
            </CText>
            <IconX
              type={IconType.FONTISTO}
              name={open ? 'angle-up' : 'angle-down'}
              size={14}
              color={colors.c101828}
            />
          </Row>
        </Pressable>
        {open && (
          <View style={screenStyles.pH24}>{children.map(renderItemChild)}</View>
        )}
      </View>
      <Divider color={colors.cEAECF0} width={1} />
    </>
  );
};

export default Item;
