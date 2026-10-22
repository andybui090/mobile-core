import { CHeader, ImageHelper } from '@/components';
import { ScreenHeight, images, screenStyles } from '@/configs';
import { mainRoute } from '@/constants/route_key';
// import { formatDay } from '@/screens/course-tab/components/Util';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import axios from 'axios';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, Platform, Pressable, ScrollView, View } from 'react-native';
import Config from 'react-native-config';
import Modal from '@gadhiyamanan/react-native-modal';

const formatDay = (d: any) => {
  const timestamp = new Date(d).toLocaleDateString('vi-VN');
  return timestamp;
};

export const DetailPin = ({ isVisible, hideModal, itemDetail, handleUri }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const styles = useStyles();

  //ACTION
  function extractAndValidateURI(string: any) {
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = string.match(urlPattern);

    if (urls) {
      for (let url of urls) {
        try {
          new URL(url);
          return true;
        } catch (e) {
          continue;
        }
      }
    }
    return false;
  }
  const urlPattern = /(https?:\/\/[^\s]+)/g;


  //RENDER
  const renderErrorImage = () => {
    return <Image source={images.global.no_avatar} style={screenStyles.box30} resizeMode="contain" />;
  };

  const renderBody = () => {
    return (
      <View style={itemDetail.text.length > 1000 ? styles.viewPin : styles.viewPinScroll}>
        <ScrollView>
          <Row start>
            <View style={{ width: '90%', paddingTop: 10, paddingHorizontal: 7 }}>
              <Row start>
                <View style={styles.avatar40}>
                  <ImageHelper source={{ uri: itemDetail.avatar }} renderErrorImage={renderErrorImage} />
                </View>
                <View style={{ paddingHorizontal: 8 }}>
                  <CText h5 numberOfLines={1} w500 color={colors.black}>{itemDetail.name}
                    <CText h5 numberOfLines={1} w500 color={colors.c98A2B3}>{` ${t('communityChat.detailPin.pin')}`}</CText>
                  </CText>
                  <CText numberOfLines={1} color={colors.c98A2B3}>{formatDay(itemDetail.createdAt)}</CText>
                </View>
              </Row>
            </View>
          </Row>
          <View style={{ paddingVertical: 12, paddingHorizontal: 7 }}>
            {extractAndValidateURI(itemDetail.text) ? (
              <View >
                {/* <CText color={colors.primary}>{decodeURIComponent(itemDetail.text)}</CText> */}
                <CText h5 color={colors.black}>
                  {decodeURIComponent(itemDetail.text).toLowerCase().split(urlPattern)[0].trim()}
                  <Pressable onPress={() => handleUri(itemDetail.text)}>
                    <CText style={{ top: 3 }} h5 color={colors.primary}>
                      {` ${decodeURIComponent(itemDetail.text).toLowerCase().match(urlPattern)}`}
                    </CText>
                  </Pressable>
                  <CText h5 color={colors.black}>
                    {` ${decodeURIComponent(itemDetail.text).toLowerCase().split(urlPattern)[2].trim()}`}
                  </CText>
                </CText>
              </View>
            ) :
              <View style={{ paddingTop: 12 }}>
                <CText color={colors.c101828} h5>{itemDetail.text}</CText>
              </View>
            }

          </View>
        </ScrollView>
      </View>
    );
  };

  const renderImage = () => {
    return (
      <View style={{ alignItems: 'center', paddingTop: 60 }}>
        <Image source={images.community.detail_pin} style={{ width: 160, height: 128 }} />
        <View style={{ paddingHorizontal: 32 }}>
          <CText h5 center style={{}} color={colors.black}>{t('communityChat.detailPin.content')}</CText>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <CHeader
          leftComponentOnPress={hideModal}
          title={t('communityChat.detailPin.title')}
          isBorderBottom
          rightComponentDisable
        // rightComponent={renderRightHead()}
        />
        {renderBody()}
        {renderImage()}
      </View>
    );

  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={hideModal} style={screenStyles.modalFullScreen}>
      {renderContent()}

    </Modal>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  viewPin: { height: ScreenHeight / 2, top: 10, width: '95%', marginLeft: '2.5%', paddingStart: 8, borderRadius: 10, borderColor: colors.black, ...screenStyles.shadow },
  viewPinScroll: {
    top: 10, width: '95%', marginLeft: '2.5%', paddingStart: 8, borderRadius: 10, borderColor: colors.black, backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#C4C4C4',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  showListPin: { borderWidth: 1, borderColor: colors.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  avatar40: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
}));
