import {IconType, IconX} from '@/components';
import {images, screenStyles} from '@/configs';
import {CButton, CText, Row} from '@/utils';
import {ScreenHeight} from '@rneui/base';
import {makeStyles, useTheme} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import {Image, Linking, Modal, Pressable, StyleSheet, View} from 'react-native';

const useStyles = makeStyles(({colors}) => ({
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0,
  },
  itemReport: {
    paddingVertical: 14,
    borderBottomColor: colors.cEAECF0,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  wrapHeader: {
    borderBottomColor: colors.cEAECF0,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
}));

export const ModalSheetSupport = ({
  isVisible,
  hideModal,
}: any) => {
  const {
    theme: {colors},
  } = useTheme();
  const styles = useStyles();
  const {t} = useTranslation();

  const handleChooseSupport = (index: number, value: string) => {
    try {
      if (index == 0) {
        Linking.openURL(`tel:${value}`);
      } else if (index == 1) {
        Linking.openURL(`mailto:${value}`);
      }
    } catch (error) {}
  };
  //RENDER
  const renderHeader = () => {
    return (
      <Row
        between
        style={[screenStyles.modalTopHeader, screenStyles.bottomLine]}>
        <Pressable onPress={hideModal}>
          <IconX
            type={IconType.IONICONS}
            name={'chevron-back'}
            color={colors.c667085}
            size={26}
          />
        </Pressable>
        <CText h4 w600 color={colors.c101828}>
          {t('appointment.contactSupportTitle', 'Liên hệ bộ phận CSKH')}
        </CText>
        <View style={{width: 24}} />
      </Row>
    );
  };

  const renderContent = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingTop: 16,
          maxHeight: ScreenHeight / 1.5,
        }}>
        <Row>
          <Image
            source={images.service.indicator}
            style={{width: 56, height: 6}}
            resizeMode="contain"
          />
        </Row>
        {renderHeader()}
        <Row between style={[screenStyles.pH24, screenStyles.pV12]}>
          <CText h5 color={colors.c344054} w500>
            {t(
              'carely.supportMsg',
              'Liên hệ qua số hotline hoặc gửi qua địa chỉ email sau để được tư vấn và xử lý vấn đề:',
            )}
          </CText>
        </Row>
        <Row start style={{paddingHorizontal: 24, paddingBottom: 12}}>
          <IconX
            type={IconType.ENTYPO}
            name={'dot-single'}
            size={22}
            color={colors.c667085}
          />
          <CText h5 color={colors.c667085}>
            {'Hotline:'}
          </CText>
          <Pressable onPress={() => handleChooseSupport(0, '02835264818')}>
            <CText
              h5
              color={colors.primary}
              style={[screenStyles.mL8, {flexShrink: 1}]}>
              {'028 3526 4818'}
            </CText>
          </Pressable>
        </Row>
        <Row start style={{paddingHorizontal: 24, paddingBottom: 12}}>
          <IconX
            type={IconType.ENTYPO}
            name={'dot-single'}
            size={22}
            color={colors.c667085}
          />
          <CText h5 color={colors.c667085}>
            {'Email:'}
          </CText>
          <Pressable onPress={() => handleChooseSupport(1, 'info@mcv.com.vn')}>
            <CText
              h5
              color={colors.primary}
              style={[screenStyles.mL8, {flexShrink: 1}]}>
              {'info@mcv.com.vn'}
            </CText>
          </Pressable>
        </Row>
        <CButton
          onPress={hideModal}
          title={t('carely.gotIt', 'Đã hiểu')}
          isBottom
          btnWidth={'90%'}
          disabledStyle={{backgroundColor: 'rgba(25,162,167, 0.8)'}}
          buttonStyle={{backgroundColor: colors.c19A2A7}}
        />
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={hideModal}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hideModal} />
        {renderContent()}
      </View>
    </Modal>
  );
};
