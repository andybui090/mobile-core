import {IconType, IconX} from '@/components';
import {getBottomSpace, ifIphoneX, screenStyles} from '@/configs';
import {CText, Row} from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useTheme} from '@rneui/themed';
import {useCallback, useMemo} from 'react';
import {Pressable} from 'react-native';

export const ModalMenuPkgV2 = ({
  t,
  bottomSheetRef,
  itemMenu,
  onEditPackage,
  onSharePackage,
  onDismiss,
}: any) => {
  const snapPoints = useMemo(() => {
    const baseHeight = 100;
    const isShowBtn = !!itemMenu?.isOwner;
    return [baseHeight + (isShowBtn ? 44 : 0)];
  }, [itemMenu?.description, itemMenu?.isOwner]);

  const {
    theme: {colors},
  } = useTheme();

  const onActionChange = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={onActionChange}
      enablePanDownToClose
      onDismiss={onDismiss}
      handleIndicatorStyle={{
        backgroundColor: colors.cD0D5DD,
      }}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          onPress={onDismiss}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}>
      <BottomSheetView
        style={{
          paddingHorizontal: 20,
          paddingBottom: getBottomSpace() + ifIphoneX(-15, 0),
        }}>
        {itemMenu?.isOwner ? (
          <Pressable
            onPress={() => onEditPackage(itemMenu)}
            style={screenStyles.pV12}>
            <Row start>
              <IconX
                name={'edit'}
                type={IconType.ANT_DESIGN}
                color={colors.c475467}
                size={20}
              />
              <CText w500 h56 color={colors.c475467} style={screenStyles.mL10}>
                {t('package.edit')}
              </CText>
            </Row>
          </Pressable>
        ) : null}
        <Pressable
          onPress={() => onSharePackage(itemMenu)}
          style={screenStyles.pV12}>
          <Row start>
            <IconX
              type={IconType.IONICONS}
              name={'share-social-outline'}
              size={20}
              color={colors.c475467}
            />
            <CText w500 h56 color={colors.c475467} style={screenStyles.mL10}>
              {t('common.share')}
            </CText>
          </Row>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
