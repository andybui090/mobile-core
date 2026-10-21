import { ICON_TYPE, IconX } from '@/components';
import { ScreenHeight, screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { ScreenWidth, isIOS } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
// import AutoHeightImage from 'react-native-auto-height-image';
import Modal from 'react-native-modal';
import BWVideoPlayer from './BWVideoPlayer';
import AutoHeightImage from 'react-native-auto-height-image';


export const MediaDetail = ({ isVisible, hideModal, itemModal }: any) => {
    //a5e01b34-bf52-498f-8830-5fee6a3d0cff
    const {
        theme: { colors },
    } = useTheme();

    const styles = useStyles();

    //ACTION

    //RENDER
    const renderBody = () => {
        let check = isIOS ? 'video' : 'video/mp4'
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {itemModal.node.type === check ?
                    <BWVideoPlayer
                        video={{ uri: itemModal?.node?.image.uri }}
                        resizeMode={'center'}
                        thumbnail={{ uri: itemModal?.node?.image.uri }}
                        pauseOnPress={true}
                        autoplay
                        videoHeight={ScreenHeight - 50}
                        videoWidth={ScreenWidth}
                    /> :
                    <AutoHeightImage
                        width={ScreenWidth}
                        source={{ uri: itemModal?.node?.image.uri }}
                    />
                }
                <>
                </>
            </View>

        );
    };

    const renderContent = () => {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'black',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
            }}>
                <View style={{ position: 'absolute', paddingHorizontal: 20, paddingTop: 90, zIndex: 100 }}>
                    <Row between>
                        <View style={styles.closeIcon}>
                            <Pressable hitSlop={screenStyles.hitSlop} onPress={() => hideModal()}>

                                <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={colors.white} size={20} />

                            </Pressable>
                        </View>
                        <CText center h4 w600 color={colors.black}>
                            {''}
                        </CText>
                        <Pressable>
                            <CText center h4 w600 color={colors.black}>
                                {''}
                            </CText>
                        </Pressable>
                    </Row>
                </View>
                {/* <Divider color={colors.cD0D5DD} width={1} /> */}
                {renderBody()}
                {/* {renderButton()} */}
            </View>
        );
    };

    return (
        <Modal animationIn={'zoomIn'} animationOut={"zoomOut"} isVisible={isVisible} onBackdropPress={hideModal} style={screenStyles.modalFullScreen}>
            {renderContent()}
        </Modal>
    );
};

const useStyles = makeStyles(({ colors }) => ({
    chosseImgCheck: {
        position: 'absolute', top: 10, right: 10, zIndex: 100, backgroundColor: colors.primary, borderRadius: 20
    },
    bottomgoback: {
        position: 'absolute', bottom: 80, right: 30, zIndex: 100
    },
    choose: {
        position: 'absolute', bottom: 105, left: 30, zIndex: 100
    },
    chooseText: {
        position: 'absolute', bottom: 75, left: 80, zIndex: 100
    },
    shadowGoback: {
        borderRadius: 20, ...screenStyles.shadow, overflow: 'hidden',
    },
    iconBack: { left: 10, top: 9, position: 'absolute', zIndex: 100 },
    totalChosse: { position: 'absolute', zIndex: 300, right: 0, top: -10, backgroundColor: 'red', width: 20, height: 20, borderRadius: 15, borderWidth: 1, borderColor: colors.white },
    view40: {
        height: 40,
        width: 40
    },
    backgroundbottom: { position: 'absolute', bottom: 0, backgroundColor: 'black', width: ScreenWidth, height: 100, opacity: 0.5 },
    closeIcon: {
        ...screenStyles.box36,
        ...screenStyles.centerWrap,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
}));
