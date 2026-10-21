import { APILoading, ToggleSwitch } from '@/components';
import { screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { makeStyles, normalize, useTheme } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';

export const TitleLiveChat = ({ isVisible, hideModal, handleSubmit }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();
  const inputRef = useRef<any>(null);

  const styles = useStyles();

  const [valueNameGroup, onChangeText] = useState('');

  const [apiLoading, setApiLoading] = useState(false);
  const [isEnabledPushNoti, setiseIsEnabledPushNoti] = useState<boolean>(false);
  const [isShowNoty, setIsShowNoty] = useState(0);


  useEffect(() => {
    const processAPIListRoom = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    processAPIListRoom();
  }, []);

      const handlePushNotify = () => {
        setiseIsEnabledPushNoti(!isEnabledPushNoti);
        if(isEnabledPushNoti){
            setIsShowNoty(0);
        }else {
            setIsShowNoty(1);
        }
    }

  const renderInput = () => {
    return (
      <View style={[screenStyles.pH24, screenStyles.pV12, { alignItems: 'center' }]}>
        <View style={{ paddingVertical: 13 }}>
          <TextInput
            ref={inputRef}
            onChangeText={text => onChangeText(text)}
            numberOfLines={1}
            value={valueNameGroup}
            placeholder={t('communityChat.CreateGroup.Name')}
            placeholderTextColor={colors.c667085}
            style={{ paddingTop: 5, paddingHorizontal: 13 }}
          />
        </View>
      </View>
    );
  };


  return (
    <Modal
      testID={'modal'}
      isVisible={isVisible}
      backdropOpacity={0.5}
      style={styles.view}>
      <View
        style={[
          styles.viewContainPopup1,
          {
            overflow: 'hidden',
            borderRadius: 5,
          },
        ]}>
        <View style={{ alignItems: 'center' }}>
          {renderInput()}
                          <Row between style={{paddingBottom: 20}}>
                              <Row>
                                  <View style={{ }}>
                                      <CText h5 color={colors.c667085}>{t('communityChat.CreateGroup.pushNoti')}</CText>
                                  </View>
                              </Row>
                              <View style={screenStyles.mL15}>
                                  <ToggleSwitch
                                      size="small"
                                      isOn={isEnabledPushNoti}
                                      onToggle={handlePushNotify}
                                      onColor={colors.primary}
                                      offColor={colors.c98A2B3}
                                  />
                              </View>
                          </Row>
        </View>
        <Row center>
          <Pressable onPress={() => hideModal()} style={{ width: '50%', alignItems: 'center', borderWidth: 1, borderColor: colors.cEAECF0, paddingVertical: 10 }}>
            <CText w500 color={colors.c101828} h5>{t('communityChat.editRoom.cancel')}</CText>
          </Pressable>
          <Pressable onPress={() => handleSubmit(valueNameGroup, isShowNoty)} style={{ width: '50%', alignItems: 'center', borderWidth: 1, borderColor: colors.cEAECF0, paddingVertical: 10 }}>
            <CText w500 color={valueNameGroup !== '' ? colors.primary : colors.cEAECF0} h5>{t('communityChat.editRoom.save')}</CText>

          </Pressable>
          
        </Row>

      </View>
      {apiLoading ? <APILoading showAlert={apiLoading} isLoadingAPI={apiLoading} /> : null}
    </Modal>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  ...screenStyles,
  view: {
    justifyContent: 'center',
    margin: 0,
    paddingHorizontal: 60,
  },
  viewContainPopup: {
    backgroundColor: colors.cFCFCFD,
    display: 'flex',
    width: '100%',
    top: -40,
  },
  viewContainPopup1: {
    backgroundColor: 'white',
    display: 'flex',
    width: '100%',
    paddingTop: normalize(10),
    top: - 100,
  },
}));