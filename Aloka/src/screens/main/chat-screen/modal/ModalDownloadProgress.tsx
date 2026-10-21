import { ICON_TYPE, IconX } from '@/components';
import { ScreenHeight, getStatusBarHeight, ifIphoneX } from '@/configs';
import { spacings } from '@/theme';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

const useStyles = makeStyles(({ colors }) => ({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: spacings.md,
  },
  wrapper: {
    marginTop: ScreenHeight / 2,
    borderRadius: 16,
    backgroundColor: colors.c101828,
    marginBottom: getStatusBarHeight() + ifIphoneX(20, 30),
    paddingVertical: 14,
  },
  bgProgress: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.grey1,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
}));

type Props = {
  isVisible: boolean;
  progress?: any;
  onClose: () => void;
};

export const ModalDownloadProgress = ({ isVisible, progress, onClose }: Props) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <RNModal isVisible={isVisible} coverScreen={true} style={[styles.container]} onBackdropPress={onClose}>
      <SafeAreaView style={[styles.wrapper]}>
        <Row between style={{ paddingHorizontal: spacings.sm }}>
          <Row>
            {progress > 0 ? (
              <>
                <View style={styles.bgProgress}>
                  <CText h6 color={colors.white}>
                    {progress}
                  </CText>
                </View>
                <CText color={colors.white}> {t('video.downloading', 'dowloading...')}</CText>
              </>
            ) : (
              <>
                <IconX origin={ICON_TYPE.MATERIAL_COMMUNITY} name={'check-circle'} size={24} color={colors.c12B76A} />
                <CText color={colors.white}> {t('communityChat.detailFile.success', 'downloaded')}</CText>
              </>
            )}
          </Row>
          <TouchableOpacity onPress={onClose}>
            <IconX origin={ICON_TYPE.ANT_ICON} name={'close'} size={24} color={colors.white} />
          </TouchableOpacity>
        </Row>
      </SafeAreaView>
    </RNModal>
  );
};
