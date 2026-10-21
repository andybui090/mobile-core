import { getBottomSpace, ifIphoneX, images, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import { CText, Row } from '@/utils';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { makeStyles, useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { Image, Pressable } from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0,
  },
}));

export const BottomSheetAction = ({
  t,
  bottomSheetRef,
  snapPoints,
  onActionChange,
  onReportNewsfeed,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { user } = useContext(AppContext);

  const styles = useStyles();

  return (
    <BottomSheetModal
      onDismiss={() => bottomSheetRef.current?.close()}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={onActionChange}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: colors.cD0D5DD,
      }}
      backdropComponent={props => (
        <BottomSheetBackdrop {...props} onPress={() => bottomSheetRef.current?.close()} appearsOnIndex={1} />
      )}>
      <BottomSheetView
        style={{
          paddingHorizontal: 20,
          paddingBottom: getBottomSpace() + ifIphoneX(-15, 0),
        }}>
        <Pressable onPress={() => onReportNewsfeed()}>
          <Row start style={screenStyles.pV12}>
            <Image source={images.global.report} style={{ width: 22, height: 22 }} resizeMode="contain" />
            <CText h5 w500 color={colors.c101828} style={screenStyles.mL10}>
              {t('common.report', 'Report')}
            </CText>
          </Row>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
