import {
  ScreenWidth
} from '@/configs';
import { Row } from '@/utils';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
// import AutoHeightImage from 'react-native-auto-height-image';

const ImgLocal = (props: any) => {
  const { listImages = [], onDetailImgVideo, itemRoomId, idMessage, onDeleteMessage, onRecallMessage, onCoppyMessage, handleShowModalText, titleName, userId, checkDeleteMess, isPin, uriCdn} = props;
  const [listImagesCdn, setListImagesCdn] = useState<any[]>([]);

  const [ListImg, setListImg] = useState<any[]>(listImages);

  useEffect(() => {
    if(uriCdn !== undefined){
      if(uriCdn.includes('{"filename"')){
        if(uriCdn !== '{community.chat.recall}'){
          setListImagesCdn(JSON.parse(uriCdn));
        }
      }
      if(listImages.length > 2){
        let arr = [...ListImg]
        for(let i = 0; i < arr.length; i++){
          arr[i].src = JSON.parse(uriCdn)[i].data;
          console.log('123')
        }
        setListImg(arr)
      }
    }
  }, [uriCdn]);
  
  const handleDetaiImg = (item: any, type: any) => {
    onDetailImgVideo(item, type)
  }

  const [showMessModal, setShowMessModal] = useState<boolean>(false);

  const handleDeleteMess = () => {
    onDeleteMessage(itemRoomId, idMessage);
  }

  const handleRecallMess = () => {
    onRecallMessage(itemRoomId, idMessage);
  }

  const handleCoppyMess = () => {
    onCoppyMessage();
  }

  const _renderItem = (item: any) => {
    return (
      <View>
        <View style={{ width: ScreenWidth / 2.4 - 5, height: 200 }}>
          {listImages[0].src === item ? (
            <Image source={{ uri: item }} style={{ width: ScreenWidth / 2.4 - 5, height: 200, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} />
          ) :
            <Image source={{ uri: item }} style={{ width: ScreenWidth / 2.4 - 5, height: 200, borderTopRightRadius: 10, borderBottomRightRadius: 10 }} />
          }
        </View>
      </View>
    );
  }
  const renderItemImage = (item: any, index: any) => {
    return (
      <Pressable key={index} onLongPress={() => handleShowModalText(idMessage, item.src, titleName, userId, checkDeleteMess, isPin, 'image')} onPress={() => handleDetaiImg(item.src, item.type)}>
        <View style={{ width: ScreenWidth / 3.8 + 2, margin: 1 }}>
          <Image source={{ uri: item.src }} style={{ width: ScreenWidth / 3.8 + 2, height: 100, borderRadius: 10 }} />
        </View>
      </Pressable>
    );
  }
  if (listImages.length === 1) {
    return (
      <View
        style={{ width: ScreenWidth / 1.3 + 20 }}>
        <Pressable
          onPress={() => handleDetaiImg(listImages[0].src, listImages[0].type)} onLongPress={() => handleShowModalText(idMessage, listImagesCdn[0]?.data, titleName, userId, checkDeleteMess, isPin, 'image')} >
          {/* <AutoHeightImage
            width={ScreenWidth / 1.3 + 20}
            source={{ uri: listImages[0].src }}
            resizeMode={'cover'}
            borderRadius={10}
          /> */}
        </Pressable>
      </View>
    )
  } else if (listImages.length === 2) {
    return (
      <View
        style={{
          // flex: 1,
          flexDirection: 'row',
          // backgroundColor: 'white',
          width: ScreenWidth / 1.3 + 20,
        }}>
        <Pressable onLongPress={() => handleShowModalText(idMessage, listImagesCdn[0]?.data, titleName, userId, checkDeleteMess, isPin, 'image')} onPress={() => handleDetaiImg(listImages[0].src, listImages[0].type)}>
          {_renderItem(
            listImages[0].src,
          )}
        </Pressable>
        <View style={{ backgroundColor: 'white', width: 2 }} />
        <Pressable onLongPress={() => handleShowModalText(idMessage, listImagesCdn[1]?.data, titleName, userId, checkDeleteMess, isPin, 'image')} onPress={() => handleDetaiImg(listImages[1].src, listImages[1].type)}>
          {_renderItem(
            listImages[1].src,
          )}
        </Pressable>
      </View>
    )
  } else {
    return (
      <>
        <Row start style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', }}>
          {ListImg.map((item: any, index: any) => renderItemImage(item, index))}
        </Row>
      </>
    )
  }

}


export default ImgLocal;
