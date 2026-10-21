import { APILoading, ImageHelper, Toast } from '@/components';
import { images, isIOS, keyExtractor, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import socketService from '@/socketio';
import { CButton, CEmptyData, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, FlatList, Image, Linking, Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import { DetailPin } from './detailPin';
import axios from 'axios';
import Config from 'react-native-config';
import { mainRoute } from '@/constants/route_key';


export const ModalListPin = ({ isVisible, hideModal, listPin, idMessText, itemRoomId, onSendPinMessage, handleOnIndex, navigation }: any) => {
    const {
        theme: { colors },
    } = useTheme();
    const { t } = useTranslation();
    const { user } = useContext(AppContext);
    const toastEl = useRef<any>(null);

    const styles = useStyles();

    const [apiLoading, setApiLoading] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [itemDetail, setItemDetail] = useState({});


    const [offset, setOffset] = useState(100);
    const [refreshing, setRefreshing] = useState(false);
    const [onEndReached, setOnEndReached] = useState(true);
    const [finalLoad, setFinalLoad] = useState(false);

    //ACTION
    const onRefresh = () => {
        setOffset(0);
        setRefreshing(true);
    };

    const handleLoadMore = () => {
        // if (finalLoad && onEndReached) {
        const _offset = offset + 100;
        setOffset(_offset);
        // }
    };

    const _renderLoadingFooter = () => {
        return !finalLoad && !onEndReached ? (
            <Row style={screenStyles.mT5}>
                <ActivityIndicator size="small" color={colors.primary} />
            </Row>
        ) : null;
    };

    const showAlertDeletePin = (item: any) => {
        let text = '';
        if(item.type === 'image'){
            text = t('communityChat.home.lastMessageImage');
        } else if (item.type === 'file'){
            text = t('communityChat.home.lastMessageFile');
        } else if (item.type === 'voice'){
            text = t('communityChat.home.lastMessageVoice');
        } else if (item.type === 'video'){
            text = t('communityChat.home.lastMessageVideo');
        } else if (item.type === 'media'){
            text = t('communityChat.listPin.imgVideo');
        }
        else{
            text = item.text;
        }
        Alert.alert(
            `${t('communityChat.listPin.deletePin')}`,
            `${t('communityChat.listPin.titledeletePinMessage')}`,
            [
                {
                    text: t('communityChat.listPin.reject'),
                    onPress: () => { },
                    style: 'default',
                },
                {
                    text: t('communityChat.listPin.deletePinMessage'),
                    onPress: () => { { socketService.emitPinMessage(item._id, itemRoomId, true); onSendPinMessage(text) }},
                    style: 'destructive',
                },
            ],
        );
    }

    const urlPattern = /(https?:\/\/[^\s]+)/g;

    const handleUri = (uri: any) => {
    hideModal();
    if (uri.includes('us/video/')) {
      let str = uri.match(/https:\/\/[^\s]+/)[0];
      let videoId = str.split('/').pop();
      if (videoId) {
        axios.get(`${Config.BASE_API_URL}/videos?fqin=id:${videoId}`)
        .then(response => {
          console.log(response.data);
          navigation.navigate(mainRoute.videoPlayStaticScreen, {
            firstIndex: 0,
            data: response.data.items ?? [],
            type: 'shareLink',
          });
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
          });
      }
    }else {
      const link = decodeURIComponent(uri).toLowerCase().match(urlPattern)?.toString();
      Linking.openURL(link ?? '')
    }
  }

    const renderErrorImage = () => {
        return <Image source={images.global.no_avatar} style={screenStyles.box30} resizeMode="contain" />;
    };

    //RENDER

    const renderItemImageShow = ({ item, index }: any) => {
        if(item.text === '{community.chat.recall}'){
            return null
        } else {
            return (
                <Pressable onPress={()=> handleOnIndex(item)}>
                <View style={[screenStyles.pH16, screenStyles.pV12, { width: '100%' }]}>
                    <Row between>
                        <View>
                            <Row start>
                                <View style={{ width: '15%' }}>
                                    <Row between>
                                        <Image source={images.community.icon_dotPin} style={screenStyles.box24} />
                                        <Image source={images.community.icon_pinchat} style={screenStyles.box24} />
                                    </Row>
                                </View>
                                <View style={{ width: '75%', left: 15 }}>
                                    {item.type === 'image' ? (
                                            <CText numberOfLines={2} color={colors.c101828} h5>{t('communityChat.home.lastMessageImage')}</CText>
                                    ) 
                                    :
                                    item.type === 'file' && item.text !== '' ? (
                                        <CText numberOfLines={2} color={colors.c101828} h5>{`${t('communityChat.home.lastMessageFile')} ${JSON.parse(item.text).filename}`}</CText>
                                        ) 
                                    : 
                                    item.type === 'file' && item.image !== '' ? (
                                        <CText numberOfLines={2} color={colors.c101828} h5>{`${t('communityChat.home.lastMessageFile')} ${JSON.parse(item.image).filename}`}</CText>
                                        ) 
                                    : 
                                    item.type === 'voice' ? (
                                        <CText numberOfLines={2} color={colors.c101828} h5>{t('communityChat.home.lastMessageVoice')}</CText>
                                        ) 
                                    : 
                                    item.type === 'video' ? (
                                        <CText numberOfLines={2} color={colors.c101828} h5>{t('communityChat.home.lastMessageVideo')}</CText>
                                        ) 
                                    : 
                                    item.type === 'media' ? (
                                        <CText numberOfLines={2} color={colors.c101828} h5>{t('communityChat.listPin.imgVideo')}</CText>
                                        ) 
                                    : 
                                    <View>
                                        {item?.text?.length > 50  ? (
                                                <CText numberOfLines={2} color={colors.c101828} h5>{`${item.text.substring(0, 50)}...`}
                                                <Pressable onPress={() => { setShowDetail(true), setItemDetail(item) }}>
                                                    <View style={{ top: 2 }}>
                                                        <CText color={colors.primary} numberOfLines={2} h5>{t('communityChat.listPin.seeMore')}</CText>
                                                    </View>
                                                </Pressable>
                                            </CText>
                                        ): <CText numberOfLines={2} color={colors.c101828} h5>{`${item.text}`}</CText>
                                        }
                                    </View>
                                    }
                                    <CText color={colors.c98A2B3} numberOfLines={1} h5>{`${t('communityChat.listPin.textMessage')} ${item.name}`}</CText>
                                </View>
                            </Row>
                        </View>
    
                        <View style={{ width: '10%', alignItems: 'flex-end' }}>
                            <Row>
                                {item.type === 'image' ? (
                                       item.image === undefined ? (
                                        <View style={styles.imgPin}>
                                        <ImageHelper source={{ uri: JSON.parse(item.text)[0].data }} renderErrorImage={renderErrorImage} />
                                        </View>
                                       ):  <View style={styles.imgPin}>
                                    <Image source={{uri:  JSON.parse(item.image)[0].data}} style={{width: 40, height: 40, borderRadius: 10}} />
                                    </View>
                                ) : 
                                <>
                                {item.type === 'video' ? (
                                    <View style={styles.imgPin}>
                                        <Video
                                        style={[screenStyles.fillParent]}
                                        source={{ uri:item.video !== undefined  ? item.video[0].image.uri :  JSON.parse(item.text)[0].data}}
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
                                ):null}
                                </>
                                }
                                <Pressable onPress={() => { showAlertDeletePin(item) }}>
                                    <Image source={images.community.icon_deletePin} style={screenStyles.box24} />
                                </Pressable>
                            </Row>
                        </View>
                    </Row>
                </View>
                </Pressable>
            )
        }
      
    };



    const renderBody = () => {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    contentContainerStyle={screenStyles.flexGrowBottom}
                    keyboardDismissMode="on-drag"
                    data={listPin}
                    extraData={listPin}
                    keyExtractor={keyExtractor}
                    renderItem={renderItemImageShow}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => {
                        return <CEmptyData />;
                    }}
                    scrollEventThrottle={isIOS ? 160 : 16}
                    onMomentumScrollBegin={() => {
                        setOnEndReached(false);
                    }}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.grey4} />}
                // ListFooterComponent={_renderLoadingFooter}
                />
                <View style={{ backgroundColor: 'white', bottom: 30, height: 60 }}>
                    <CButton title={t('communityChat.listPin.button')} onPress={hideModal}/>
                </View>
            </View>

        );
    };

    const renderContent = () => {
        return (
            <View style={screenStyles.wrapModalTop}>
                <View style={screenStyles.modalTopHeader}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={images.community.icon_listPin} style={screenStyles.box60} />
                        <View style={screenStyles.pV4}>
                            <CText w700 h3>{t('communityChat.listPin.title')}</CText>
                        </View>
                        <CText center h5>{t('communityChat.listPin.content')}</CText>
                    </View>
                </View>
                <Divider color={colors.cD0D5DD} width={1} />
                {renderBody()}
                {/* {renderButton()} */}
            </View>
        );
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={hideModal} style={screenStyles.containerModalTop}>
            {renderContent()}
            {apiLoading ? <APILoading showAlert={apiLoading} isLoadingAPI={apiLoading} /> : null}
            {showDetail &&
                <DetailPin
                    isVisible={showDetail}
                    hideModal={() => setShowDetail(false)}
                    itemDetail={itemDetail}
                    handleUri={handleUri}
                />

            }
            <Toast ref={toastEl} position={'center'} />
        </Modal>
    );
};

const useStyles = makeStyles(({ colors }) => ({
    chosseImgCheck: {
        position: 'absolute', top: 10, right: 10, zIndex: 100, backgroundColor: colors.primary, borderRadius: 20
    },
    bottomgoback: {
        height: 44, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 10, justifyContent: 'center', top: 16
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
 