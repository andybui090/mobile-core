import { screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { makeStyles, normalize, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

export const RemoveMember = ({ isVisible, hideModal, handleDeleteMember, checkTextDelete, handleChangeAdmin, itemMember }: any) => {
    //a5e01b34-bf52-498f-8830-5fee6a3d0cff
    const {
        theme: { colors },
    } = useTheme();
    const { t } = useTranslation();

    const styles = useStyles();
    
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
          {itemMember.role !== 'Admin' && 
          <>
          <TouchableOpacity  onPress={handleChangeAdmin}>
          <Row style={{paddingVertical: 10}}>
              <CText h4 w700  center style={{color: colors.primary}}>
                {t('communityChat.listMember.changeRole')}
              </CText>
          </Row>
          </TouchableOpacity>
          <View style={{borderWidth: 1, borderColor: colors.cEAECF0}}/>
          </>
          }
        <TouchableOpacity  onPress={handleDeleteMember}>
          <Row style={{paddingVertical: 10}}>
              <CText h4 w700  center style={{color: colors.cF04438}}>
                {checkTextDelete ? t('communityChat.listMember.removeFriend') : t('communityChat.listMember.removeMember')}
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
                {t('communityChat.mediaLocal.titleLeft')}
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
