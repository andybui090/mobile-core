import { IconType, IconX } from '@/components';
import { getBottomSpace, ifIphoneX, screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { makeStyles, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { Pressable } from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0,
  },
}));

export const BottomSheetMenu = ({
  t,
  bottomSheetRef,
  onShareChannel,
  onReportChannel,
}: any) => {
  const [snapPoints] = useState([150, 150]);

  const {
    theme: { colors },
  } = useTheme();

  const styles = useStyles();

  return (
    <BottomSheetModal
      onDismiss={() => bottomSheetRef.current?.close()}
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: colors.cD0D5DD,
      }}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          onPress={() => bottomSheetRef.current?.close()}
          disappearsOnIndex={1}
          appearsOnIndex={2}
        />
      )}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: 20,
          paddingBottom: getBottomSpace() + ifIphoneX(-15, 0),
        }}
      >
        <Pressable onPress={onShareChannel} style={styles.line}>
          <Row start style={screenStyles.pV14}>
            <IconX
              name={'share-a'}
              type={IconType.FONTISTO}
              color={colors.c98A2B3}
              size={18}
            />
            <CText h5 w500 color={colors.c33353A} style={screenStyles.mL10}>
              {t('common.share', 'Share')}
            </CText>
          </Row>
        </Pressable>
        <Pressable onPress={onReportChannel}>
          <Row start style={screenStyles.pV14}>
            <IconX
              name={'report-problem'}
              type={IconType.MATERIAL_ICONS}
              color={colors.c98A2B3}
              size={20}
            />
            <CText h5 w500 color={colors.c33353A} style={screenStyles.mL10}>
              {t('common.report', 'Report')}
            </CText>
          </Row>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
