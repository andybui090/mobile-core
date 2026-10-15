import {IconType, IconX} from '@/components';
import {images, screenStyles} from '@/configs';
import {CButton, CScrollView, CText, Row} from '@/utils';
import {ScreenHeight} from '@rneui/base';
import {makeStyles, useTheme} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import {Image, Modal, Pressable, StyleSheet, View} from 'react-native';

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

export const ModalSheetDetailJob = ({
  isVisible,
  hideModal,
  dataDetailPackage,
}: any) => {
  const {
    theme: {colors},
  } = useTheme();
  const styles = useStyles();
  const {t} = useTranslation();

  //RENDER

  const renderHeader = () => {
    // if (typeShow == 1) {
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
          {t('carely.serviceDetail', 'Chi tiết dịch vụ')}
        </CText>
        <View style={{width: 24}} />
      </Row>
    );
  };

  const renderOption = (value: string) => {
    return (
      <View
        style={{
          marginTop: 8,
          borderRadius: 4,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.cF9FAFB,
        }}>
        <Row start style={{alignItems: 'flex-start'}}>
          <View
            style={{
              width: 26,
              height: 26,
              overflow: 'hidden',
            }}>
            <Image
              source={images.service.ic_h}
              resizeMode="cover"
              style={screenStyles.fillParent}
            />
          </View>
          <CText
            h5
            color={colors.c33353A}
            style={[screenStyles.mL8, {flexShrink: 1}]}>
            {value}
          </CText>
        </Row>
      </View>
    );
  };

  const renderDetailJob = () => {
    const {option1, option2, option3, option4, option5} = dataDetailPackage;
    if (option1 || option2 || option3 || option4 || option5) {
      return (
        <CScrollView style={screenStyles.pH24}>
          <Row start>
            <CText h5 color={colors.c344054} w500>
              {t('carely.workDetail', 'Chi tiết công việc')}
            </CText>
          </Row>
          {option1 ? renderOption(option1) : null}
          {option2 ? renderOption(option2) : null}
          {option3 ? renderOption(option3) : null}
          {option4 ? renderOption(option4) : null}
          {option5 ? renderOption(option5) : null}
        </CScrollView>
      );
    }
  };

  const renderContent = () => {
    const {time_package, option1, option2, option3, option4, option5} =
      dataDetailPackage;
    const timeService = time_package ? time_package : 0;
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
            {t('carely.serviceDuration', 'Thời gian thực hiện dịch vụ')}
          </CText>
          <View
            style={{
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: '#ECFDF3',
            }}>
            <CText color={colors.c19A2A7} h5 w500>
              {timeService +
                ' ' +
                (timeService > 1 ? t('common.minutes') : t('common.minute'))}
            </CText>
          </View>
        </Row>
        {renderDetailJob()}
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
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0,0,0,0.7)'},
          ]}
          onPress={hideModal}
        />
        {renderContent()}
      </View>
    </Modal>
  );
};
