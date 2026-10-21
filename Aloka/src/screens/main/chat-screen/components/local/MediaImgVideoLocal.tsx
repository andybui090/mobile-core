// import {
//   ScreenWidth,
//   screenStyles
// } from '@/configs';
// import { Row } from '@/utils';
// import React, { useEffect, useState } from 'react';
// import { Image, Pressable, View } from 'react-native';
// // import BWVideoPlayer from './BWVideoPlayer';
// import { ICON_TYPE, IconX } from '@/components';
// import * as Progress from 'react-native-progress';
// import Video from 'react-native-video';

// const MediaImgVideoLocal = (props: any) => {
//   const { list = [], onDetailImgVideo, idMessage, handleShowModalText, titleName, userId, checkDeleteMess, isPin, uriCdn } = props;
//   const [listMediaCdn, setListMediaCdn] = useState<any[]>([]);

//   const [ListMedia, setListMedia] = useState<any[]>(list);

//   useEffect(() => {
//     if(uriCdn !== undefined){
//       if(uriCdn.includes('{"filename"')){
//         if(uriCdn !== '{community.chat.recall}'){
//           setListMediaCdn(JSON.parse(uriCdn));
//         }
//       }
//       if(list.length > 2){
//         let arr = [...ListMedia]
//         const sortedArray = arr.sort((x, y) => {
//           if (x.type === 'video' && y.type !== 'video') {
//             return -1;
//           } else if (x.type !== 'video' && y.type === 'video') {
//             return 1;
//           } else {
//             return 0;
//           }
//         });
//         for(let i = 0; i < sortedArray.length; i++){
//           sortedArray[i].image = JSON.parse(uriCdn)[i];
//           sortedArray[i].image.uri = JSON.parse(uriCdn)[i].data;
//           sortedArray[i].isLoading = true;
//         }
//         setListMedia(sortedArray)
//       }
//     }
//   }, [uriCdn]);
  
//   const handleDetaiImg = (item: any, type: any) => {
//     onDetailImgVideo(item, type)
//   }

//   //RENDER
//   const _renderItem = (item: any) => {
//     return (
//       <View>
//         <View style={{ width: ScreenWidth / 2.5 + 2, height: 200 }}>
//           {list[0].image.uri === item ? (
//             list[0].type === 'image' ? (
//               <Image source={{ uri: item }} style={{ width: ScreenWidth / 2.5 + 2, height: 200, borderRadius: 10 }} />
//             ) :
//               <View style={{
//                 width: ScreenWidth / 2.5 + 2,
//                 height: 200,
//                 overflow: 'hidden',
//                 borderRadius: 10,
//               }}>
//                 {list[0].isLoading === true ? (
//                   <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
//                     <IconX origin={ICON_TYPE.MATERIAL_ICONS} name={'play-arrow'} size={40} color={'white'} />
//                   </View>) : null}
//                   {list[0].isLoading === false ? (
//                   <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
//               <Progress.Circle size={50} borderWidth={3} color='white' indeterminate={true} />
//               </View>) : null}
//                 <Video
//                   style={[screenStyles.fillParent, { borderRadius: 10 }]}
//                   source={{ uri: item }}
//                   controls={false}
//                   paused={true}
//                   muted={true}
//                   repeat={false}
//                   volume={0.0}
//                   fullscreen={false}
//                   playWhenInactive={false}
//                   useTextureView={false}
//                   playInBackground={false}
//                   disableFocus={true}
//                   ignoreSilentSwitch={"ignore"}
//                 />
//               </View>
//             // </View>
//           ) :
//             list[1].type !== 'video' ? (
//               <Image source={{ uri: item }} style={{ width: ScreenWidth / 2.5 + 2, height: 200, borderRadius: 10 }} />
//             ) :
//               <View style={{
//                 width: ScreenWidth / 2.5 + 2,
//                 height: 200,
//                 overflow: 'hidden',
//                 borderRadius: 10,
//               }}>
//                 {list[1].isLoading === true ? (
//                   <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
//                     <IconX origin={ICON_TYPE.MATERIAL_ICONS} name={'play-arrow'} size={40} color={'white'} />
//                   </View>) : null}
//                   {list[0].isLoading === false ? (
//                   <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
//               <Progress.Circle size={50} borderWidth={3} color='white' indeterminate={true} />
//               </View>) : null}
//                 <Video
//                   style={[screenStyles.fillParent, { borderRadius: 10 }]}
//                   source={{ uri: item }}
//                   controls={false}
//                   paused={true}
//                   muted={true}
//                   repeat={false}
//                   volume={0.0}
//                   fullscreen={false}
//                   playWhenInactive={false}
//                   useTextureView={false}
//                   playInBackground={false}
//                   disableFocus={true}
//                   ignoreSilentSwitch={"ignore"}
//                 />
//               </View>
//           }
//         </View>
//       </View>
//     );
//   }
//   const renderItemImage = (item: any, index: any) => {
//     return (
//       <Pressable key={index} onLongPress={() => handleShowModalText(idMessage, item.image, titleName, userId, checkDeleteMess, isPin, 'media')} onPress={() => handleDetaiImg(item.image.uri, item.type)} style={{ borderRadius: 10, overflow: 'hidden' }}>
//         {item.type === 'image' ? (
//           <Row style={{ width: ScreenWidth / 3.8 , margin: 1 }}>
//             <Image source={{ uri: item.image.uri }} style={{ width: ScreenWidth / 3.8 , height: 100, borderRadius: 10 }} />
//           </Row>
//         ) :
//           <>
//             <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 2000, width: ScreenWidth / 4.5, height: 100 }}>
//               <View />
//               {item.isLoading === false ? (
//                 <Progress.Circle size={50} borderWidth={3} color='white' indeterminate={true} />
//               ) : null}
//             </View>
//             <View style={{ width: ScreenWidth / 3.8 , margin: 1, borderRadius: 10 }}>
//               <View style={{
//                 width: ScreenWidth / 3.8 ,
//                 height: 100,
//                 overflow: 'hidden',
//                 borderRadius: 10,
//               }}>
//                 {item.isLoading === true ? (
//                   <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
//                     <IconX origin={ICON_TYPE.MATERIAL_ICONS} name={'play-arrow'} size={40} color={'white'} />
//                   </View>) : null}
//                 <Video
//                   style={[screenStyles.fillParent, { borderRadius: 10 }]}
//                   source={{ uri: item.image.uri }}
//                   controls={false}
//                   paused={true}
//                   muted={true}
//                   repeat={false}
//                   volume={0.0}
//                   fullscreen={false}
//                   playWhenInactive={false}
//                   useTextureView={false}
//                   playInBackground={false}
//                   disableFocus={true}
//                   ignoreSilentSwitch={"ignore"}
//                 />
//               </View>
//             </View>
//           </>
//         }
//       </Pressable>
//     );
//   }

//   if (list.length === 2) {
//     return (
//       <View
//         style={{
//           flexDirection: 'row',
//           width: ScreenWidth / 1.2 - 10,
//           borderRadius: 10,
//           overflow: 'hidden'
//         }}>
//         <Pressable onLongPress={() => handleShowModalText(idMessage, listMediaCdn[0], titleName, userId, checkDeleteMess, isPin, 'media')} onPress={() => handleDetaiImg(list[0].image.uri, list[0].type)} >
//           {_renderItem(
//             list[0].image.uri,
//           )}
//         </Pressable>
//         <View style={{ backgroundColor: 'white', width: 2 }} />
//         <Pressable onLongPress={() => handleShowModalText(idMessage, listMediaCdn[1], titleName, userId, checkDeleteMess, isPin, 'media')} onPress={() => handleDetaiImg(list[1].image.uri, list[1].type)}>
//           {_renderItem(
//             list[1].image.uri,
//           )}
//         </Pressable>
//       </View>
//     )
//   } else {
//     return (
//       <>
//         {list.length > 0 ?
//           <Row start style={{ width: ScreenWidth / 1.2 - 10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
//             {ListMedia?.map((item: any, index: any) => renderItemImage(item, index))}
//           </Row>
//           : null}
//       </>
//     )
//   }



// }


// export default MediaImgVideoLocal;
