import { ICON_TYPE, IconX, Toast } from '@/components';
import { screenStyles, ScreenWidth, showToast } from '@/configs';
import { AppContext } from '@/contexts';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CLoading, CText, Row } from '@/utils';
import { Clipboard } from '@react-native-clipboard/clipboard/dist/Clipboard';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import Config from 'react-native-config';
import Modal from 'react-native-modal';
import { ShareMessage } from './shareMessage';
import RNQRGenerator from 'rn-qr-generator';
import { typeLoading } from '@/utils/CLoading';

const ModalInviteLink = ({ isVisible, hideModal, itemRoomId, isOnlyView }: any) => {
    const {
        theme: { colors },
    } = useTheme();
    const { t } = useTranslation();
    const { user } = useContext(AppContext);
    const qrCodeRef = useRef<any>(null);
    const toastEl = useRef<any>(null);

    const dispatch = useAppDispatch();

    const [showShareMess, setShowShareMess] = useState<boolean>(false);

    // const _url = `${Config.SHARE_WEB_URL}/rooms?id=${itemRoomId}&from=${user.id}`;
    const _url = `${Config.SHARE_WEB_URL}/dl?room_id=${itemRoomId}&from_id=${user.id}&source=inapp&campaign=inapp`;

    const { socketmessage } = useAppSelector(state => state.socketioReducer);

    const [qrCodeImg, setQRCodeImg] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initQRImage = () => {
            RNQRGenerator.generate({
                value: _url,
                height: 200,
                width: 200,
                correctionLevel: 'M',
                // base64: true
            })
                .then(response => {
                    const { uri, width, height, base64 } = response;
                    setQRCodeImg(uri);
                    setIsLoading(false);
                })
                .catch(error => { setIsLoading(false); console.log('Cannot create QR code', error) });
        }
        initQRImage();
    }, []);


    useEffect(() => {
        const processAPIListRoom = () => {
            const { loading, data, error } = socketmessage;
            if (!loading) {
                if (data) {
                    showToast(toastEl, t('communityChat.setting.handleShareInviteLink'), 2000);
                } else if (error) {
                }
            }
        };
        processAPIListRoom();
    }, [socketmessage]);

    // console.log("🚀 ~ ModalInviteLink ~ _url:", _url)
    const handleCopy = () => {
        Clipboard.setString(_url);
        showToast(toastEl, t('communityChat.setting.handleCoppyInviteLink'), 2000);
    }

    const handleShareLink = () => {
        if (!isOnlyView) {
            setShowShareMess(true);
        }
    }

    const renderContent = () => {
        return (
            <View style={screenStyles.wrapModalTop}>
                <View style={screenStyles.modalTopHeader}>
                    <Row between>
                        <Pressable onPress={() => hideModal()}>
                            <IconX style={{ top: 2, left: 2 }} name={'close'} origin={ICON_TYPE.ICONICONS} color={colors.black} size={24} />
                        </Pressable>
                        <CText center h4 w600 color={colors.c101828}>
                            {t("communityChat.setting.titleInviteLink")}
                        </CText>
                        <Pressable>
                            <IconX style={{ top: 2, left: 2 }} name={'close'} origin={ICON_TYPE.ICONICONS} color={colors.white} size={24} />
                        </Pressable>
                    </Row>
                </View>
                <Divider color={colors.cD0D5DD} width={1} />
                <View style={{
                    padding: 20,
                    marginTop: 40,
                    alignItems: 'center',
                    width: "100%",
                    height: 220,
                    justifyContent: 'center'
                }}>
                    {isLoading ? <CLoading loadingSize={typeLoading.small} /> : <Image source={{ uri: qrCodeImg }} style={{
                        width: 200,
                        height: 200,
                    }} />}
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: ScreenWidth / 1.2 }}>
                        <CText center h46 color={colors.c101828}>
                            {t("communityChat.setting.contentInviteLink")}
                        </CText>
                        <CText center h46 color={colors.c101828}>
                            {t("communityChat.setting.contenLineInviteLink")}
                        </CText>
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <View style={{ width: ScreenWidth / 1.4, paddingVertical: 10, backgroundColor: colors.cD0F0FF, borderRadius: 10 }}>
                            <CText center h46 color={colors.primary}>
                                {_url}
                            </CText>
                        </View>
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <View style={{ width: ScreenWidth / 1.4 }}>
                            <Row around>
                                <Pressable onPress={handleCopy} style={{ alignItems: 'center', paddingVertical: 10 }}>
                                    <IconX name={'copy'} origin={ICON_TYPE.FONT_AWESOME5} color={colors.primary} size={24} />
                                    <CText style={{ paddingVertical: 5 }} center h46 color={colors.c101828}>
                                        {t('communityChat.setting.coppyInviteLink')}
                                    </CText>
                                </Pressable>
                                <Pressable onPress={handleShareLink} style={{ alignItems: 'center', paddingVertical: 10, opacity: isOnlyView ? 0.5 : 1 }}>
                                    <IconX name={'share-a'} origin={ICON_TYPE.FONTISTO} color={colors.primary} size={24} />
                                    <CText style={{ paddingVertical: 5 }} center h46 color={colors.c101828}>
                                        {t('communityChat.setting.shareInviteLink')}
                                    </CText>
                                </Pressable>
                            </Row>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <Modal
            isVisible={isVisible} onBackdropPress={hideModal} style={screenStyles.containerModalTop}>
            {renderContent()}
            {showShareMess &&
                <ShareMessage
                    isVisible={showShareMess}
                    hideModal={() => setShowShareMess(false)}
                    textCoppy={_url}
                    itemRoomId={itemRoomId}
                    typeMessage={'text'}
                />
            }
            <Toast ref={toastEl} position={'bottom'} />
        </Modal>
    )
}

export default ModalInviteLink;

