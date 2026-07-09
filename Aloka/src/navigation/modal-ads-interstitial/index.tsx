// import { ICON_TYPE, IconX, Wrapper } from '@/components';
// import { getStatusBarHeight, screenStyles } from '@/configs';
// import { Row } from '@/utils';
// import { makeStyles, useTheme } from '@rneui/themed';
// import { useState } from 'react';
// import { Pressable, View } from 'react-native';
// import Modal from 'react-native-modal';
// import { BannerAds, NativeAdcanced } from './admod';

// export const ModalAdsInterstitial = ({ isVisible, hideModal, adMod }: any) => {
//     const {
//         theme: { colors },
//     } = useTheme();

//     const styles = useStyles();

//     const [isLoaded, setIsLoaded] = useState(false);

//     //ACTION
//     const handleLoadedSuccess = () => {
//         setIsLoaded(true);
//     }

//     //RENDER
//     const renderBody = () => {
//         if (adMod.type == 'video') {
//             return (
//                 <View style={{ flex: 1, justifyContent: 'center' }}>
//                     <NativeAdcanced adUnitID={adMod.code || ''} callBackFailed={hideModal} callBackLoaded={handleLoadedSuccess} />
//                 </View>
//             )
//         } else if (adMod.type == 'banner') {
//             return (
//                 <View style={{ flex: 1, justifyContent: 'center' }}>
//                     <BannerAds adUnitID={adMod.code || ''} callBackFailed={hideModal} callBackLoaded={handleLoadedSuccess} />
//                 </View>
//             )
//         }
//         return null;
//     };

//     const renderContent = () => {
//         return (
//             <View style={{
//                 flex: 1,
//                 backgroundColor: colors.c1D2939,
//                 borderTopLeftRadius: 16,
//                 borderTopRightRadius: 16,
//             }}>
//                 {isLoaded && <View style={{ position: 'absolute', paddingHorizontal: 20, top: getStatusBarHeight() + 80, zIndex: 1 }}>
//                     <Row between>
//                         <View style={styles.closeIcon}>
//                             <Pressable hitSlop={screenStyles.hitSlop} onPress={() => hideModal()}>
//                                 <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={colors.white} size={20} />
//                             </Pressable>
//                         </View>
//                     </Row>
//                 </View>}
//                 {renderBody()}
//             </View>
//         );
//     };

//     return (
//         <Modal animationIn={'zoomIn'} animationOut={"zoomOut"} isVisible={isVisible} onBackdropPress={hideModal}
//             style={[screenStyles.modalFullScreen, !isLoaded && { height: 0, width: 0 }]}
//             backdropOpacity={!isLoaded ? 0 : 0.2} >
//             <Wrapper>
//                 {renderContent()}
//             </Wrapper>
//         </Modal>
//     );
// };

// const useStyles = makeStyles(({ colors }) => ({
//     closeIcon: {
//         ...screenStyles.box36,
//         ...screenStyles.centerWrap,
//         borderRadius: 18,
//         backgroundColor: 'rgba(0, 0, 0, 1)',
//     },
// }));
