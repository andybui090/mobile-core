import { IconType, IconX } from '@/components';
import { ScreenHeight, ScreenWidth, screenStyles } from '@/configs';
import { Row } from '@/utils';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';

const VideoLocal = (props: any) => {
  const {
    listVideo = [],
    onDetailImgVideo,
    idMessage,
    handleShowModalText,
    titleName,
    userId,
    checkDeleteMess,
    isPin,
    uriCdn,
  } = props;
  const [listVideoCdn, setListVideoCdn] = useState<any[]>([]);

  const [ListVideo, setListVideo] = useState<any[]>(listVideo);

  useEffect(() => {
    if (uriCdn !== undefined) {
      if (uriCdn.includes('{"filename"')) {
        if (uriCdn !== '{community.chat.recall}') {
          setListVideoCdn(JSON.parse(uriCdn));
        }
      }
      if (listVideo.length > 2) {
        let arr = [...listVideo];
        for (let i = 0; i < arr.length; i++) {
          arr[i].src = JSON.parse(uriCdn)[i].data;
        }
        setListVideo(arr);
      }
    }
  }, [uriCdn]);

  const handleDetailVideo = (item: any, type: any) => {
    onDetailImgVideo(item, type);
  };

  const _renderItem = (item: any) => {
    return (
      <View style={{ width: ScreenWidth / 2.4 - 10 }}>
        {listVideo[0].src === item ? (
          <View
            style={{
              width: ScreenWidth / 2.4,
              height: ScreenHeight / 3,
              overflow: 'hidden',
              borderRadius: 10,
            }}
          >
            {listVideo[0].isLoading === true ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 100,
                }}
              >
                <IconX
                  type={IconType.MATERIAL_ICONS}
                  name={'play-arrow'}
                  size={40}
                  color={'white'}
                />
              </View>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 100,
                }}
              >
                <Progress.Circle
                  size={50}
                  borderWidth={3}
                  color="white"
                  indeterminate={true}
                />
              </View>
            )}
            <Video
              style={[screenStyles.fillParent, { borderRadius: 10 }]}
              source={{ uri: item }}
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
              ignoreSilentSwitch={'ignore'}
            />
          </View>
        ) : (
          <View
            style={{
              width: ScreenWidth / 2.4,
              height: ScreenHeight / 3,
              overflow: 'hidden',
              borderRadius: 10,
            }}
          >
            {listVideo[1].isLoading === true ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 100,
                }}
              >
                <IconX
                  type={IconType.MATERIAL_ICONS}
                  name={'play-arrow'}
                  size={40}
                  color={'white'}
                />
              </View>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 100,
                }}
              >
                <Progress.Circle
                  size={50}
                  borderWidth={3}
                  color="white"
                  indeterminate={true}
                />
              </View>
            )}
            <Video
              style={[screenStyles.fillParent, { borderRadius: 10 }]}
              source={{ uri: item }}
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
              ignoreSilentSwitch={'ignore'}
            />
          </View>
        )}
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
            item.image.uri,
            titleName,
            userId,
            checkDeleteMess,
            isPin,
            'video',
          )
        }
        onPress={() => handleDetailVideo(item.image.uri, item.type)}
        style={{ borderRadius: 10, overflow: 'hidden' }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            width: ScreenWidth / 4 - 13,
            height: ScreenHeight / 5,
          }}
        >
          <View />
          {item.isLoading === false ? (
            <Progress.Circle
              size={50}
              borderWidth={3}
              color="white"
              indeterminate={true}
            />
          ) : null}
        </View>
        <View style={{ width: ScreenWidth / 3.8 + 2, margin: 1 }}>
          <View
            style={{
              width: ScreenWidth / 3.8 + 2,
              height: ScreenHeight / 5,
              overflow: 'hidden',
              borderRadius: 10,
              left: 5,
            }}
          >
            {item.isLoading === true ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 100,
                }}
              >
                <IconX
                  type={IconType.MATERIAL_ICONS}
                  name={'play-arrow'}
                  size={40}
                  color={'white'}
                />
              </View>
            ) : null}
            <Video
              style={[screenStyles.fillParent, { borderRadius: 10 }]}
              source={{ uri: item.image.uri }}
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
              ignoreSilentSwitch={'ignore'}
            />
          </View>
        </View>
      </Pressable>
    );
  };
  if (listVideo.length === 1) {
    return (
      <Pressable
        onLongPress={() =>
          handleShowModalText(
            idMessage,
            listVideoCdn[0].data,
            titleName,
            userId,
            checkDeleteMess,
            isPin,
            'video',
          )
        }
        style={{
          width: ScreenWidth / 1.2 - 10,
          borderRadius: 10,
          overflow: 'hidden',
        }}
        onPress={() =>
          handleDetailVideo(listVideo[0].image.uri, listVideo[0].type)
        }
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            width: ScreenWidth / 1.2 - 10,
            height: ScreenHeight / 2,
          }}
        >
          <View />
          {listVideo[0].isLoading === false ? (
            <Progress.Circle
              size={50}
              borderWidth={3}
              color="white"
              indeterminate={true}
            />
          ) : null}
        </View>
        <View
          style={{
            width: ScreenWidth / 1.2 - 10,
            height: 400,
            overflow: 'hidden',
            borderRadius: 10,
          }}
        >
          {listVideo[0].isLoading === true ? (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 100,
              }}
            >
              <IconX
                type={IconType.MATERIAL_ICONS}
                name={'play-arrow'}
                size={40}
                color={'white'}
              />
            </View>
          ) : null}
          <Video
            style={[screenStyles.fillParent, { borderRadius: 10 }]}
            source={{ uri: listVideo[0].image.uri }}
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
            ignoreSilentSwitch={'ignore'}
          />
        </View>
      </Pressable>
    );
  } else if (listVideo.length === 2) {
    return (
      <View
        style={{
          // flex: 1,
          flexDirection: 'row',
          // backgroundColor: 'white',
          width: ScreenWidth / 1.2 - 10,
        }}
      >
        <Pressable
          onLongPress={() =>
            handleShowModalText(
              idMessage,
              listVideoCdn[0].data,
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'video',
            )
          }
          onPress={() =>
            handleDetailVideo(listVideo[0].image.uri, listVideo[0].type)
          }
        >
          {_renderItem(listVideo[0].image.uri)}
        </Pressable>
        <View style={{ backgroundColor: 'white', width: 2 }} />
        <Pressable
          onLongPress={() =>
            handleShowModalText(
              idMessage,
              listVideoCdn[1].data,
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'video',
            )
          }
          onPress={() =>
            handleDetailVideo(listVideo[1].image.uri, listVideo[1].type)
          }
        >
          {_renderItem(listVideo[1].image.uri)}
        </Pressable>
      </View>
    );
  } else {
    return (
      <>
        <Row
          start
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          {ListVideo.map((item: any, index: any) =>
            renderItemImage(item, index),
          )}
        </Row>
      </>
    );
  }
};

export default VideoLocal;
