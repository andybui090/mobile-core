// import { ICON_TYPE, IconX } from '@/components';
// import { ScreenWidth, calculateNumberViewLike, images, isIOS, kFormatter, keyExtractor, screenStyles } from '@/configs';
// import { CText, Row } from '@/utils';
// import { makeStyles, useTheme } from '@rneui/themed';
// import React, { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { FlatList, Image, Pressable, View } from 'react-native';
// import VideoPlayer from './video-player';

// const useStyles = makeStyles(({ colors }) => ({
//   bgTrending: {
//     width: ScreenWidth / 3.5 - 5,
//     height: (ScreenWidth / 3.5) * 1.3,
//     borderRadius: 4,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: colors.cEAECF0,
//     marginHorizontal: 5,
//   },
//   iconPlay: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     ...screenStyles.centerWrap,
//     flexDirection: 'row',
//   },
//   seeMore: {
//     width: ScreenWidth / 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: (ScreenWidth / 3.5) * 1.3,
//   },
// }));

// export const Outstanding: React.FC<any> = props => {
//   const { listData, isPlayTop, onPressItem, onSeeMoreVideo } = props;
//   const {
//     theme: { colors },
//   } = useTheme();
//   const styles = useStyles();
//   const { t } = useTranslation();
//   const flatRef = useRef<any>(null);

//   //Quan ly trang thai play, pause 5s 1 lan theo thu tu
//   const [idPlay, setIdPlay] = useState<number>(-1);

//   const [arrVisible, setArrVisible] = useState<any>([{ item: { id: -2 } }]);

//   const viewConfigRef = useRef({
//     minimumViewTime: 1500,
//     viewAreaCoveragePercentThreshold: 30,
//   });

//   //Phuong thuc 2 de giam thieu su dung bo nho
//   useEffect(() => {
//     if (arrVisible.length) {
//       setIdPlay(arrVisible[0].item.id);
//     }
//   }, [arrVisible]);

//   //ACTION
//   const renderItemFooter = () => {
//     return (
//       <Pressable onPress={onSeeMoreVideo}>
//         <View style={styles.seeMore}>
//           <IconX
//             style={screenStyles.mB10}
//             origin={ICON_TYPE.FONTAWESOME6}
//             name={'circle-chevron-right'}
//             size={24}
//             color={colors.cD0D5DD}
//           />
//           <CText h56 color={colors.c667085}>
//             {t('common.seeMore', 'See more')}
//           </CText>
//         </View>
//       </Pressable>
//     );
//   };

//   const handlePlayNext = (id: number) => {
//     if (arrVisible && arrVisible.length > 0) {
//       for (let i = 0; i < arrVisible.length; i++) {
//         if (id == arrVisible[i].item.id) {
//           if (i < arrVisible.length - 1) {
//             setIdPlay(arrVisible[i + 1].item.id);
//           } else {
//             setIdPlay(arrVisible[0].item.id);
//           }
//           break;
//         }
//       }
//     }
//   };

//   const renderItemTrending = ({ item, index }: any) => {
//     if (index < 5) {
//       const { link_cover, statistics, link_video, vt_view } = item;
//       const isPlay = isPlayTop && idPlay == item.id;
//       const numberView = calculateNumberViewLike(statistics?.view, vt_view);
//       return (
//         <Pressable style={styles.bgTrending} onPress={() => onPressItem(item, index)}>
//           <VideoPlayer
//             URI={link_video}
//             isPlay={isPlay}
//             posterURI={link_cover}
//             playNext={() => handlePlayNext(item.id)}
//           />
//           <View style={styles.iconPlay}>
//             <Image source={images.home.ico_play} style={screenStyles.box10} resizeMode="contain" />
//             <CText h7 color={colors.white} style={screenStyles.mL5}>
//               {kFormatter(numberView)}
//             </CText>
//           </View>
//         </Pressable>
//       );
//     } else if (index == 5) {
//       return renderItemFooter();
//     }
//     return null;
//   };

//   const onViewRef = useRef((viewableItems: any) => {
//     if (viewableItems) {
//       if (viewableItems?.viewableItems) {
//         setArrVisible(viewableItems?.viewableItems || []);
//       }
//     }
//   });

//   const getItemLayout = (data: any, index: number) => {
//     return { length: ScreenWidth / 3.5 - 5, offset: (ScreenWidth / 3.5 - 5) * index, index };
//   };

//   const renderList = () => {
//     return (
//       <FlatList
//         ref={flatRef}
//         contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH5]}
//         data={listData}
//         extraData={listData}
//         keyExtractor={keyExtractor}
//         renderItem={renderItemTrending}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         scrollEventThrottle={isIOS ? 160 : 16}
//         viewabilityConfig={viewConfigRef.current}
//         onViewableItemsChanged={onViewRef.current}
//         getItemLayout={getItemLayout}
//         scrollsToTop={false}
//       />
//     );
//   };

//   return (
//     <>
//       <View style={[screenStyles.pH12, screenStyles.pV12]}>
//         <CText h5 w600 color={colors.c101828} style={screenStyles.mL5}>
//           {'Video'}
//         </CText>
//       </View>
//       <Row start>{renderList()}</Row>
//     </>
//   );
// };
