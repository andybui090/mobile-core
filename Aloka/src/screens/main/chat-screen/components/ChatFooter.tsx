import { ICON_TYPE, IconX, ImageHelper } from '@/components';
import { ScreenWidth, conventUserNameChat, images, screenStyles } from '@/configs';
import { useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';

const ChatFooter = (props: any) => {
    const { isTyping, itemRoomId, showMessReply, typeMessage, textCoppy, userNameCoppy, height, handleShowReply, checkisPaste, handleChosseUserTab, setCheckisPaste, setTextMessages, item, checkTypingBot, nameBot, checkErrorRoom, listOwner } = props;
    const styles = useStyles();
      const { firebaseConfig } = useAppSelector(state => state.globalReducer);

    const {
        theme: { colors },
    } = useTheme();
    const { t } = useTranslation();

    const convertUser = (text: any) => {
        if (text === '[User deleted]') {
            text = t('communityChat.user.delete');
        } else {
            text = text;
        }
        if (listOwner === 'Admin') {
            return text + ` ${t('communityChat.chat.isTyping')}...`;;
        } else if (listOwner === 'Owner') {
            return text + ` ${t('communityChat.chat.isTyping')}...`;;
        } else {
            return conventUserNameChat(listOwner, text, firebaseConfig.isReviewApp, item.is_name) + ` ${t('communityChat.chat.isTyping')}...`;
        }
    }

    const renderErrorImage = () => {
        return <Image source={images.global.no_avatar} style={screenStyles.box30} resizeMode="contain" />;
    };

    if (checkTypingBot && !checkErrorRoom) {
        return <View style={[styles.wrapperTyping, { paddingHorizontal: 13, width: ScreenWidth / 1.2 }]}>
            <Row start>
                <Text style={styles.TextStyle}>{`${nameBot} ${t('communityChat.chat.isTyping')}...`}</Text>
                <View style={{ bottom: 7 }}>
                </View>
            </Row>
        </View>
    }
    if (isTyping?.data?.status === 'true' && !checkErrorRoom) {
        return (
            <View style={[styles.wrapperTyping, { paddingHorizontal: 13, width: ScreenWidth / 1.2 }]}>
                <Row start>
                    {itemRoomId === isTyping?.data?.room_id ? (
                        <Text style={styles.TextStyle}>
                            {convertUser(isTyping?.data.full_name)}
                            {/* {`${isTyping?.data.full_name} ${t('communityChat.chat.isTyping')}...`} */}
                        </Text>
                    ) : null}
                    <View style={{ bottom: 7 }}>
                    </View>
                </Row>
            </View>
        );
    } else if (showMessReply) {
        return (
            <>
                <View style={{ backgroundColor: '#F2F4F7', height: 52, borderRadius: 10, top: height > 0 ? 0 : 10 }}>
                    <Row between style={{ paddingHorizontal: 13 }}>
                        <Row start style={{ width: '90%' }}>
                            <View style={{ height: 44, width: 3, backgroundColor: '#0080F6', }} />
                            {typeMessage === 'image' ? (
                                <>
                                    <View style={styles.imgRepLy}>
                                        <ImageHelper source={{ uri: textCoppy }} renderErrorImage={renderErrorImage} />
                                    </View>
                                    <View style={screenStyles.pH10}>
                                        <View style={screenStyles.pV4}>
                                            <CText h4 w500 color={colors.c101828}>{conventUserNameChat(listOwner, userNameCoppy, firebaseConfig.isReviewApp, item.is_name)}</CText>
                                        </View>
                                        <CText numberOfLines={1} color={'#CCCCCC'} >{t('communityChat.home.lastMessageImage')}</CText>
                                    </View>
                                </>
                            ) :
                                <>
                                    {typeMessage === 'video' ? (
                                        <>
                                            <View style={styles.imgRepLy}>
                                                <Video
                                                    style={[screenStyles.fillParent]}
                                                    source={{ uri: textCoppy }}
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
                                            <View style={screenStyles.pH10}>
                                                <View style={screenStyles.pV4}>
                                                    <CText h4 w500 color={colors.c101828}>{conventUserNameChat(listOwner, userNameCoppy, firebaseConfig.isReviewApp, item.is_name)}</CText>
                                                </View>
                                                <CText numberOfLines={1} color={'#CCCCCC'} >{t('communityChat.home.lastMessageVideo')}</CText>
                                            </View>
                                        </>
                                    ) :
                                        <>
                                            {typeMessage === 'media' ? (
                                                <View style={screenStyles.pH10}>
                                                    <View style={screenStyles.pV4}>
                                                        <CText h4 w500 color={colors.c101828}>{conventUserNameChat(listOwner, userNameCoppy, firebaseConfig.isReviewApp, item.is_name)}</CText>
                                                    </View>
                                                    <CText numberOfLines={1} color={'#CCCCCC'} >{t('communityChat.listPin.imgVideo')}</CText>
                                                </View>
                                            ) :
                                                <>
                                                    {typeMessage === 'voice' ? (
                                                        <View style={screenStyles.pH10}>
                                                            <View style={screenStyles.pV4}>
                                                                <CText h4 w500 color={colors.c101828}>{conventUserNameChat(listOwner, userNameCoppy, firebaseConfig.isReviewApp, item.is_name)}</CText>
                                                            </View>
                                                            <CText numberOfLines={1} color={'#CCCCCC'} >{t('communityChat.home.lastMessageVoice')}</CText>
                                                        </View>
                                                    ) :
                                                        <>
                                                            {typeMessage === 'file' ? (
                                                                <View style={screenStyles.pH10}>
                                                                    <View style={screenStyles.pV4}>
                                                                        <CText h4 w500 color={colors.c101828}>{conventUserNameChat(listOwner, userNameCoppy, firebaseConfig.isReviewApp, item.is_name)}</CText>
                                                                    </View>
                                                                    <CText numberOfLines={1} color={'#CCCCCC'} >{'[File]'}</CText>
                                                                </View>
                                                            ) :
                                                                <View style={screenStyles.pH10}>
                                                                    <View style={screenStyles.pV4}>
                                                                        <CText h4 w500 color={colors.c101828}>{conventUserNameChat(listOwner, userNameCoppy, firebaseConfig.isReviewApp, item.is_name)}</CText>
                                                                    </View>
                                                                    {textCoppy.includes('idTag') ? (
                                                                        <CText numberOfLines={1} h46 color='#667085'>{JSON.parse(textCoppy).content}</CText>
                                                                    ) :
                                                                        <CText numberOfLines={1} h46 color='#667085'>{textCoppy}</CText>
                                                                    }
                                                                </View>
                                                            }
                                                        </>

                                                    }
                                                </>
                                            }
                                        </>
                                    }
                                </>
                            }
                        </Row>
                        <TouchableOpacity onPress={() => handleShowReply()} style={{ height: 52, width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                            <IconX origin={ICON_TYPE.ICONICONS} name={'close'} size={22} color={colors.c98A2B3} />
                        </TouchableOpacity>
                    </Row>
                </View>
                <View style={{ paddingTop: height > 0 ? 0 : 10 }} />
            </>
        )
    } if (checkisPaste) {
        return (
            <>
                <Row style={{ backgroundColor: '#F2F4F7', height: 52, borderRadius: 10 }}>
                    {textCoppy.includes('mp4') ? (
                        <View style={styles.imgCoppy}>
                            <Video
                                style={[screenStyles.fillParent]}
                                source={{ uri: textCoppy }}
                                controls={false}
                                paused={true}
                                muted={true}
                                repeat={false}
                                volume={0.0}
                                fullscreen={false}
                                playWhenInactive={false}
                                playInBackground={false}
                                disableFocus={true}
                                ignoreSilentSwitch={"ignore"}
                            />
                        </View>
                    ) :
                        <View style={styles.imgCoppy}>
                            <ImageHelper source={{ uri: textCoppy }} renderErrorImage={renderErrorImage} />
                        </View>
                    }

                    <TouchableOpacity onPress={() => { setCheckisPaste(false); setTextMessages('') }} style={{ height: 52, width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                        <IconX origin={ICON_TYPE.ICONICONS} name={'close'} size={22} color={colors.c98A2B3} />
                    </TouchableOpacity>
                </Row>
                <View style={{ paddingTop: 0 }} />
            </>
        )
    } else {
        return <>
            <View style={{ paddingTop: 10 }} />
        </>
    }
}

export default ChatFooter;
const useStyles = makeStyles(({ colors }) => ({
    wrapperTyping: {
        opacity: 0.5,
        marginBottom: 10,
    },
    txtTyping: {
        marginLeft: 30,
    },
    TextStyle: {
        fontStyle: 'italic',
        fontSize: 13,
        color: colors.c1D2939
        //line-through is the trick
    },

    imgRepLy: {
        width: 42,
        height: 42,
        overflow: 'hidden',
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: 10,
        borderColor: colors.cF2F4F7,
        backgroundColor: colors.cEAECF0,
    },

    imgAvarta40: {
        width: 40,
        height: 40,
        overflow: 'hidden',
        borderWidth: 1,
        borderRadius: 20,
        marginLeft: 10,
        borderColor: colors.cF2F4F7,
        backgroundColor: colors.cEAECF0,
    },
    imgCoppy: {
        width: 52,
        height: 52,
        overflow: 'hidden',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.cF2F4F7,
        backgroundColor: colors.cEAECF0,
    },
    viewChatFooter: { position: 'absolute', zIndex: 100, height: 36, paddingStart: 8, justifyContent: 'center', borderColor: colors.black },

}));