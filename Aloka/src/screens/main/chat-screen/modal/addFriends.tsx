import { screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import { CText, Row } from '@/utils';
import { Divider, makeStyles, normalize, useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import Modal from '@gadhiyamanan/react-native-modal';

export const AddFriendModal = ({ isVisible, hideModal, handleAppect, handleReject }: any) => {
    //a5e01b34-bf52-498f-8830-5fee6a3d0cff
    const {
        theme: { colors },
    } = useTheme();
    const { t } = useTranslation();
    const { currentLocation } = useContext(AppContext);

    const styles = useStyles();
    const { user } = useContext(AppContext);


    //RENDER
   

    return (
        <Modal
        testID={'modal'}
        isVisible={isVisible}
        onBackdropPress={hideModal}
        backdropOpacity={0.5}
        swipeDirection={['up', 'left', 'right', 'down']}
        style={styles.view}>
        <View
          style={[
            styles.viewContainPopup,
            {
              borderRadius: 10,
            //   paddingBottom: normalize(10),
            },
          ]}>
        <View >
          <Row style={{paddingVertical: 10}}>
              <CText h4 center style={{color: colors.c98A2B3}}>
                {t('communityChat.addfriend.waitting')}
              </CText>
          </Row>
          </View>
          <Divider color={colors.cD0D5DD} width={1} />
        <TouchableOpacity  onPress={handleAppect}>
          <Row style={{paddingVertical: 10}}>
              <CText h4 w500  center style={{color: colors.primary}}>
                {t('communityChat.contact.appect')}
              </CText>
          </Row>
          </TouchableOpacity>
          <Divider color={colors.cD0D5DD} width={1} />
          <TouchableOpacity  onPress={handleReject}>
          <Row style={{paddingVertical: 10}}>
              <CText h4 w500  center style={{color: colors.primary}}>
                {t('communityChat.contact.reject')}
              </CText>
          </Row>
          </TouchableOpacity>

        </View>
        <View
          style={[
            styles.viewContainPopup1,
            {
              borderRadius: 10,
              paddingBottom: normalize(5),
            },
          ]}>
          <View style={{width: '100%', paddingVertical: 2}}>
            <TouchableOpacity onPress={hideModal}>
              <CText h4 w700 center style={{color:  colors.primary}}>
                {'Huỷ'}
              </CText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
};

const useStyles = makeStyles(({ colors }) => ({
    ...screenStyles,
    view: {
      justifyContent: 'flex-end',
      margin: 0,
      paddingHorizontal: 10,
    },
    viewContainPopup: {
      backgroundColor: colors.cFCFCFD,
      display: 'flex',
      width: '100%',
    //   paddingTop: normalize(10),
      top: -40,
      // paddingHorizontal: normalize(15),
      // paddingBottom: normalize(20),
    },
    viewContainPopup1: {
      backgroundColor: 'white',
      display: 'flex',
      width: '100%',
      paddingTop: normalize(10),
      // paddingHorizontal: normalize(15),
      // paddingBottom: normalize(20),
      top: -30,
    },
}));
