import { CText, Row } from '@/utils';
import { Image, Platform, Pressable, View } from 'react-native';
// import BWVideoPlayer from './BWVideoPlayer';
import { ImageHelper } from '@/components';
import { images, screenStyles } from '@/configs';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import Video from 'react-native-video';

const MessagePin = (props: any) => {
  const { messagesPin, fileNameFNS, handleShowPin } = props;
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const renderErrorImage = () => {
    return <Image source={images.global.no_avatar} style={screenStyles.box30} resizeMode="contain" />;
  };

  return (
    <>
      {messagesPin.length > 0 ? (
        <View style={[styles.viewPin, styles.shadow]}>
          <Row start>
            <View style={{ width: '70%' }}>
              <Row start>
                <Image source={images.community.icon_pinchat} style={screenStyles.box24} />
                <View style={{ paddingHorizontal: 8 }}>
                  {messagesPin[0].type === 'image' ? (
                    <CText numberOfLines={1} w500 color={colors.black}>{t('communityChat.home.lastMessageImage')}</CText>
                  ) :
                    messagesPin[0].type === 'file' ? (
                      messagesPin[0].text === '' ?
                        <CText numberOfLines={1} w500 color={colors.black}>{`${t('communityChat.home.lastMessageFile')} ${fileNameFNS.split("/").pop()}`}</CText>
                        :
                        <CText numberOfLines={1} w500 color={colors.black}>{`${t('communityChat.home.lastMessageFile')} ${JSON.parse(messagesPin[0].text).filename}`}</CText>
                    ) :
                      messagesPin[0].type === 'voice' ? (
                        <CText numberOfLines={1} w500 color={colors.black}>{t('communityChat.home.lastMessageVoice')}</CText>
                      )
                        :
                        messagesPin[0].type === 'video' ? (
                          <CText numberOfLines={1} w500 color={colors.black}>{t('communityChat.home.lastMessageVideo')}</CText>
                        )
                          :
                          messagesPin[0].type === 'media' ? (
                            <CText numberOfLines={1} w500 color={colors.black}>{t('communityChat.listPin.imgVideo')}</CText>
                          )
                            :
                            <>
                            {messagesPin[0].text.includes('idTag') ? (
                            <CText numberOfLines={1} w500 color={colors.black}>{JSON.parse(messagesPin[0].text).content}</CText>
                            ):
                            <CText numberOfLines={1} w500 color={colors.black}>{messagesPin[0].text}</CText>
                            }
                            </>

                  }
                  <CText numberOfLines={1} color={colors.c98A2B3}>{messagesPin[0].name}</CText>
                </View>
              </Row>
            </View>
            <View style={{ width: '25%', alignItems: 'flex-end', left: 5 }}>
              <Row end>
                {messagesPin[0].type === 'image' ? (
                  messagesPin[0].image === undefined ?
                    <View style={styles.imgPin}>
                      <ImageHelper source={{ uri: JSON.parse(messagesPin[0].text)[0].data }} renderErrorImage={renderErrorImage} />
                    </View>
                    : <View style={styles.imgPin}>
                      <Image source={{ uri: JSON.parse(messagesPin[0].image)[0].data }} style={{ width: 40, height: 40, borderRadius: 10 }} />
                    </View>
                ) :
                  messagesPin[0].type === 'video' ? (
                    messagesPin[0]?.video === undefined ? (
                      <View style={styles.imgPin}>
                        <Video
                          style={[screenStyles.fillParent]}
                          source={{ uri: JSON.parse(messagesPin[0].text)[0].data }}
                          controls={false}
                          paused={true}
                          muted={true}
                          repeat={false}
                          volume={0.0}
                          fullscreen={false}
                          playWhenInactive={false}
                          useTextureView={false}
                          playInBackground={false}
                          disableFocus={true}
                          ignoreSilentSwitch={"ignore"}
                        />
                      </View>
                    ) : <View style={styles.imgPin}>
                      <Video
                        style={[screenStyles.fillParent]}
                        source={{ uri: JSON.parse(messagesPin[0]?.video)[0]?.data }}
                        controls={false}
                        paused={true}
                        muted={true}
                        repeat={false}
                        volume={0.0}
                        fullscreen={false}
                        playWhenInactive={false}
                        useTextureView={false}
                        playInBackground={false}
                        disableFocus={true}
                        ignoreSilentSwitch={"ignore"}
                      />
                    </View>

                  )
                    : null}
                <View style={{ height: 44, width: 1, backgroundColor: colors.c98A2B3, marginRight: 10 }} />
                <Pressable style={styles.showListPin} onPress={handleShowPin}>
                  <Row end>
                    <CText color={colors.primary}>{`+ ${messagesPin.length}`}</CText>
                    <View style={screenStyles.mL10}>
                      <Image source={images.community.icon_downPin} style={screenStyles.box16} />
                    </View>
                  </Row>
                </Pressable>
              </Row>
            </View>
          </Row>
        </View>
      ) : null}
    </>
  )
}

export default MessagePin;
const useStyles = makeStyles(({ colors }) => ({
  viewPin: { position: 'absolute', zIndex: 100, top: 2, height: 56, width: '95%', marginLeft: '2.5%', paddingStart: 8, justifyContent: 'center', borderRadius: 10, borderColor: colors.black, },
  showListPin: { borderWidth: 1, borderColor: colors.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  shadow: {
    backgroundColor: '#fff',
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
  imgPin: {
    width: 40,
    height: 40,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 10,
    right: 10,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
}));