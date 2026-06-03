// import {screenStyles} from '@/configs';
// import {mainRoute} from '@/constants/route_key';
// import {navigate2} from '@/navigation/RootNavigation';
// import {CText} from '@/utils';
// import {useTheme} from '@rneui/themed';
// import React, {useEffect, useState} from 'react';
// import {
//   LayoutAnimation,
//   Linking,
//   NativeSyntheticEvent,
//   Platform,
//   Pressable,
//   StyleSheet,
//   TextLayoutEventData,
//   UIManager,
//   View,
// } from 'react-native';

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// // Regex cho URL và Hashtag
// const urlRegex = /https?:\/\/[^\s]+/;
// const hashtagRegex = /#[\p{L}\p{N}._]+/gu;

// interface AnimatedReadMoreProps {
//   text: string;
//   numberOfLines?: number;
//   seeMoreText: string;
//   seeLessText: string;
//   isSearchHashtag?: boolean;
//   txtColor?: string;
//   seeStyle?: object;
//   onHyperLink?: (url: string) => void;
// }

// // Custom animation
// const customAnimation = {
//   duration: 300,
//   create: {
//     type: LayoutAnimation.Types.easeInEaseOut,
//     property: LayoutAnimation.Properties.opacity,
//   },
//   update: {
//     type: LayoutAnimation.Types.easeInEaseOut,
//     property: LayoutAnimation.Properties.scaleY,
//   },
//   delete: {
//     type: LayoutAnimation.Types.easeInEaseOut,
//     property: LayoutAnimation.Properties.opacity,
//   },
// };

// const AnimatedReadMore: React.FC<AnimatedReadMoreProps> = ({
//   text,
//   txtColor,
//   numberOfLines = 3,
//   seeMoreText,
//   seeStyle = {},
//   seeLessText,
//   isSearchHashtag,
//   onHyperLink,
// }) => {
//   const {
//     theme: {colors},
//   } = useTheme();

//   const [showFullText, setShowFullText] = useState(false);
//   const [isOverflowing, setIsOverflowing] = useState(false);
//   const [measured, setMeasured] = useState(false);

//   useEffect(() => {
//     setMeasured(false);
//     setIsOverflowing(false);
//     setShowFullText(false);
//   }, [text]);

//   const onTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
//     if (!measured) {
//       if (e.nativeEvent.lines.length > numberOfLines) {
//         setIsOverflowing(true);
//       }
//       setMeasured(true);
//     }
//   };

//   const toggleText = () => {
//     LayoutAnimation.configureNext(customAnimation);
//     setShowFullText(!showFullText);
//   };

//   const cleanMultilineText = (text: string) => {
//     return (
//       text
//         .replace(/\n+/g, '\n') // Thay thế nhiều dấu xuống dòng thành 1 dòng xuống
//         .replace(/\n/g, '\n\n') // Chỉ chừa lại 1 dòng trống giữa các đoạn
//         // .replace(/\s*\n\s*/g, ' ')  // Loại bỏ khoảng trắng thừa trước và sau mỗi dấu xuống dòng
//         .trim()
//     ); // Loại bỏ khoảng trắng đầu và cuối của văn bản
//   };

//   const handlePressHashTag = (txt: string) => {
//     if (isSearchHashtag) {
//       navigate2(mainRoute.searchScreen, {hashTag: txt});
//     }
//   };

//   const handleOpenLink = (url: string) => {
//     if (typeof onHyperLink === 'function') {
//       return onHyperLink(url);
//     } else {
//       const str = url.replace(/\%5D$|\]$/i, '');
//       Linking.canOpenURL(str).then(() => {
//         Linking.openURL(str);
//       });
//     }
//   };

//   const parseTextWithLinksAndHashtag = (txt: string) => {
//     if (txt && txt !== '') {
//       const text = cleanMultilineText(txt);
//       // Tách chuỗi thành từng phần nhỏ: URLs, Hashtags, và các đoạn văn bản thường
//       const regex = new RegExp(
//         `(${urlRegex.source})|(${hashtagRegex.source})`,
//         'g',
//       );
//       const parts: string[] = text.split(regex);

//       return parts.map((part: string, index: number) => {
//         if (!part || part === '') return null;
//         // Nếu là URL
//         if (urlRegex.test(part)) {
//           return (
//             <CText
//               key={index}
//               onPress={() => handleOpenLink(part)}
//               h5
//               w500
//               style={{color: colors.primary}}>
//               {part}
//             </CText>
//           );
//         }
//         // Nếu là Hashtag
//         if (hashtagRegex.test(part)) {
//           return (
//             <CText
//               h5
//               key={index}
//               onPress={() => handlePressHashTag(part)}
//               style={{color: colors.primary}}>
//               {part}
//             </CText>
//           );
//         }
//         // Văn bản thường
//         return (
//           <CText h5 key={index} style={{color: txtColor ?? colors.c101828}}>
//             {part}
//           </CText>
//         );
//       });
//     }
//   };

//   return (
//     <View>
//       {/* Real visible text */}
//       <CText
//         h5
//         numberOfLines={showFullText ? undefined : numberOfLines}
//         color={txtColor ?? colors.c101828}>
//         {parseTextWithLinksAndHashtag(text)}
//       </CText>
//       {/* Hidden measurement text */}
//       {!measured && (
//         <CText
//           h5
//           style={styles.hidden}
//           color={txtColor ?? colors.c101828}
//           onTextLayout={onTextLayout}
//           numberOfLines={undefined}>
//           {text}
//         </CText>
//       )}

//       {isOverflowing && (
//         <Pressable onPress={toggleText} style={screenStyles.mT3}>
//           <CText h5 w500 color={'#2E90FA'} style={seeStyle}>
//             {showFullText ? seeLessText : seeMoreText}
//           </CText>
//         </Pressable>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   hidden: {
//     position: 'absolute',
//     opacity: 0,
//     zIndex: -1,
//     height: 0,
//   },
// });

// export default AnimatedReadMore;
