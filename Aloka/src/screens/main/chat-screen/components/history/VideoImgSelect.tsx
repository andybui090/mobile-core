import { images, screenStyles, ScreenWidth } from '@/configs';
import { Row } from '@/utils';
import { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
// import AutoHeightImage from 'react-native-auto-height-image';

const VideoImgSelect = (props: any) => {
  const {
    list = [],
    onDetailImgVideo,
    itemRoomId,
    checkUser,
    idMessage,
    onDeleteMessage,
    onRecallMessage,
    handleShowModalText,
    titleName,
    userId,
    checkDeleteMess,
    isPin,
  } = props;
  const [listImages, setListImages] = useState<any[]>([]);
  const [showMessModal, setShowMessModal] = useState<boolean>(false);
  const [checkRecall, setCheckRecall] = useState<boolean>(false);

  useEffect(() => {
    if (list.includes('{"filename"')) {
      if (list !== '{community.chat.recall}') {
        setListImages(JSON.parse(list));
      } else {
        setCheckRecall(true);
        setListImages([
          {
            data: 'https://cdn-global.doctornetwork.us/messages/images/2024/05/7czs_nRtjOcw2GVjUL-a8.png',
            filename: 'recall.png',
            type: 'image',
          },
        ]);
      }
    }
  }, []);

  const handleDetaiImg = (item: any, type: any) => {
    onDetailImgVideo(item, type);
  };

  const handleDeleteMess = () => {
    onDeleteMessage(itemRoomId, idMessage);
  };

  const handleRecallMess = () => {
    onRecallMessage(itemRoomId, idMessage);
  };

  const hanldeshowModal = () => {
    setShowMessModal(true);
  };

  //RENDER
  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box30}
        resizeMode="contain"
      />
    );
  };

  const _renderItem = (item: any) => {
    return (
      <View>
        <View
          style={{
            width: checkUser ? ScreenWidth / 2.4 - 5 : ScreenWidth / 2.6 - 3,
            height: 200,
          }}
        >
          {listImages[0].data === item ? (
            <Image
              source={{ uri: item }}
              style={{
                width: checkUser
                  ? ScreenWidth / 2.4 - 5
                  : ScreenWidth / 2.6 - 3,
                height: 200,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            />
          ) : (
            <Image
              source={{ uri: item }}
              style={{
                width: checkUser
                  ? ScreenWidth / 2.4 - 5
                  : ScreenWidth / 2.6 - 3,
                height: 200,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}
            />
          )}
        </View>
      </View>
    );
  };
  const renderItemImage = (item: any, index: any) => {
    return (
      <Pressable
        key={index}
        onLongPress={() =>
          handleShowModalText(
            idMessage,
            item.data,
            titleName,
            userId,
            checkDeleteMess,
            isPin,
            'image',
          )
        }
        onPress={() => handleDetaiImg(item.data, item.type)}
      >
        <Row
          style={{
            width: checkUser ? ScreenWidth / 3.8 + 2 : ScreenWidth / 4,
            margin: 1,
          }}
        >
          <Image
            source={{ uri: item.data }}
            style={{
              width: checkUser ? ScreenWidth / 3.8 + 2 : ScreenWidth / 4,
              height: 100,
              borderRadius: 10,
            }}
          />
        </Row>
      </Pressable>
    );
  };

  if (listImages.length === 1) {
    return (
      <View
        style={{
          width: checkUser ? ScreenWidth / 1.3 + 20 : ScreenWidth / 1.3,
        }}
      >
        <Pressable
          style={{
            width: checkUser ? ScreenWidth / 1.3 + 20 : ScreenWidth / 1.3,
          }}
          onLongPress={() =>
            handleShowModalText(
              idMessage,
              listImages[0].data,
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'image',
            )
          }
          onPress={() => handleDetaiImg(listImages[0].data, listImages[0].type)}
        >
          {/* <AutoHeightImage
            width={checkUser ? ScreenWidth / 1.3 + 20 : ScreenWidth / 1.3}
            source={{ uri: listImages[0].data }}
            resizeMode={'cover'}
            borderRadius={10}
          /> */}
        </Pressable>
      </View>
    );
  } else if (listImages.length === 2) {
    return (
      <View
        style={{
          // flex: 1,
          flexDirection: 'row',
          // backgroundColor: 'white',
          width: checkUser ? ScreenWidth / 1.3 + 20 : ScreenWidth / 1.3,
          borderRadius: 10,
        }}
      >
        <Pressable
          onLongPress={() =>
            handleShowModalText(
              idMessage,
              listImages[0].data,
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'image',
            )
          }
          onPress={() => handleDetaiImg(listImages[0].data, listImages[0].type)}
        >
          {_renderItem(listImages[0].data)}
        </Pressable>
        <View style={{ backgroundColor: 'white', width: 2 }} />
        <Pressable
          onLongPress={() =>
            handleShowModalText(
              idMessage,
              listImages[1].data,
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'image',
            )
          }
          onPress={() => handleDetaiImg(listImages[1].data, listImages[1].type)}
        >
          {_renderItem(listImages[1].data)}
        </Pressable>
      </View>
    );
  } else {
    return (
      <>
        {listImages.length > 0 ? (
          <Row
            start
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {listImages?.map((item, index) => renderItemImage(item, index))}
          </Row>
        ) : null}
      </>
    );
  }
};

export default VideoImgSelect;
