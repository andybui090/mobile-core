import { ScreenHeight, ScreenWidth, isIOS, screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { IconType, IconX, ImageHelper } from '@/components';
import { Blurhash } from 'react-native-blurhash';
import { createThumbnail } from 'react-native-create-thumbnail';
import Video from 'react-native-video';

const VideoSelect = (props: any) => {
  const {
    list = [],
    onDetailImgVideo,
    itemRoomId,
    checkUser,
    idMessage,
    onDeleteMessage,
    onRecallMessage,
    isFocusScreen,
    handleShowModalText,
    titleName,
    userId,
    checkDeleteMess,
    isPin,
  } = props;
  const [listVideo, setListImages] = useState<any[]>([]);
  const [listVideoLocal, setListImagesLocal] = useState<any[]>([]);

  const [converntVideoImg, setConverntVideoImg] = useState<any>('');
  const [converntVideoImg1, setConverntVideoImg1] = useState<any>('');
  const [checkVideoLink, setCheckVideoLink] = useState<boolean>(false);

  useEffect(() => {
    if (list.includes('{"filename"')) {
      if (list[0]?.image?.uri === undefined) {
        setListImages(JSON.parse(list));
        setListImagesLocal([]);
      } else {
        setListImages([]);
        setListImagesLocal(list);
      }
    } else if (
      list.includes('https://cdn-global.doctornetwork.us/videos-chat')
    ) {
      const regexPatternMonthYear = /\/(\d{4})\/(\d{2})\//;
      const matchMonthYear = list.match(regexPatternMonthYear);
      const regexPattern = new RegExp(
        `https://cdn-global\\.doctornetwork\\.us/videos-chat/${matchMonthYear[1]}/${matchMonthYear[2]}/e_[\\w-]+\\.mp4`,
      );
      let match = list.match(regexPattern);

      if (match) {
        let a = match[0];
        setListImages([{ data: a, filename: list, type: 'video' }]);
      } else {
        setListImages([]);
        console.log('No match found');
      }
      setListImagesLocal([]);
      setCheckVideoLink(true);
    } else if (list.includes('https://cdn-global.doctornetwork.us/videos')) {
      const regexPatternMonthYear = /\/(\d{4})\/(\d{2})\//;
      const matchMonthYear = list.match(regexPatternMonthYear);
      const regexPattern = new RegExp(
        `https://cdn-global\\.doctornetwork\\.us/videos/${matchMonthYear[1]}/${matchMonthYear[2]}/e_[\\w-]+\\.mp4`,
      );
      let match = list.match(regexPattern);
      if (match) {
        let a = match[0];
        setListImages([{ data: a, filename: list, type: 'video' }]);
      } else {
        setListImages([]);
        console.log('No match found');
      }
      setListImagesLocal([]);
      setCheckVideoLink(true);
    }
  }, []);

  useEffect(() => {
    let arr = [...listVideo];
    if (listVideo.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr.length === 1) {
          const normalizedPath = isIOS
            ? arr[0].data.replace('file://', '').replace(/#.*$/, '')
            : arr[0].data;
          createThumbnail({
            url: normalizedPath,
            timeStamp: 1000,
          })
            .then((res: any) => {
              setConverntVideoImg(res.path);
            })
            .catch((err: any) => console.log({ err }));
        } else if (arr.length === 2) {
          const normalizedPath = isIOS
            ? arr[0].data.replace('file://', '').replace(/#.*$/, '')
            : arr[0].data;
          createThumbnail({
            url: normalizedPath,
            timeStamp: 1000,
          })
            .then((res: any) => {
              setConverntVideoImg(res.path);
            })
            .catch((err: any) => console.log({ err }));
          const normalizedPath1 = isIOS
            ? arr[1].data.replace('file://', '').replace(/#.*$/, '')
            : arr[1].data;
          createThumbnail({
            url: normalizedPath1,
            timeStamp: 1000,
          })
            .then((res: any) => {
              setConverntVideoImg1(res.path);
            })
            .catch((err: any) => console.log({ err }));
        }
      }
    }
  }, [listVideo]);

  const handleDetailVideo = (item: any, type: any) => {
    onDetailImgVideo(item, type);
  };

  const _renderItem = (item: any) => {
    return (
      <View>
        <View
          style={{
            width: checkUser ? ScreenWidth / 2.4 - 10 : ScreenWidth / 2.6 - 3,
          }}
        >
          {listVideo[0].data === item ? (
            // <BWVideoPlayer
            //     video={{ uri: item }}
            //     resizeMode={'center'}
            //     thumbnail={{ uri: item }}
            //     pauseOnPress={true}
            //     autoplay
            //     // videoHeight={ScreenHeight - 50}
            //     videoWidth={ScreenWidth}
            //     paused={!isFocusScreen}
            // />
            <View
              style={{
                width: checkUser ? ScreenWidth / 2.4 : ScreenWidth / 2.6 - 3,
                height: ScreenHeight / 3,
                overflow: 'hidden',
                borderRadius: 10,
              }}
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
              <View style={[screenStyles.fillParent, { borderRadius: 10 }]}>
                {converntVideoImg && (
                  <ImageHelper source={{ uri: converntVideoImg }} />
                )}
              </View>
              {/* <Video
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
                                ignoreSilentSwitch={"ignore"}
                            /> */}
            </View>
          ) : (
            <View
              style={{
                width: checkUser ? ScreenWidth / 2.4 : ScreenWidth / 2.6,
                height: ScreenHeight / 3,
                overflow: 'hidden',
                borderRadius: 10,
              }}
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
              <View style={[screenStyles.fillParent, { borderRadius: 10 }]}>
                {converntVideoImg1 && (
                  <ImageHelper source={{ uri: converntVideoImg1 }} />
                )}
              </View>
              {/* <Video
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
                                ignoreSilentSwitch={"ignore"}
                            /> */}
            </View>
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
            'video',
          )
        }
        onPress={() => handleDetailVideo(item.data, item.type)}
      >
        <View
          style={{
            position: 'absolute',
            zIndex: 2000,
            width: checkUser ? ScreenWidth / 3.5 - 10 : ScreenWidth / 4,
            height: ScreenHeight / 5,
          }}
        >
          <CText></CText>
        </View>
        <View
          style={{
            width: checkUser ? ScreenWidth / 3.8 + 2 : ScreenWidth / 4,
            margin: 1,
          }}
        >
          {/* <BWVideoPlayer
                        video={{ uri: item.data }}
                        resizeMode={'center'}
                        thumbnail={{ uri: item.data }}
                        pauseOnPress={true}
                        autoplay
                        videoHeight={ScreenHeight - 50}
                        videoWidth={ScreenWidth}
                        paused={!isFocusScreen}
                    /> */}
          <View
            style={{
              width: checkUser ? ScreenWidth / 3.8 + 2 : ScreenWidth / 4,
              height: ScreenHeight / 5,
              overflow: 'hidden',
              borderRadius: 10,
            }}
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
            <Video
              style={[screenStyles.fillParent, { borderRadius: 10 }]}
              source={{ uri: item.data }}
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

  const _renderItemLocal = (item: any) => {
    return (
      <Pressable
        onLongPress={() =>
          handleShowModalText(
            idMessage,
            item,
            titleName,
            userId,
            checkDeleteMess,
            isPin,
            'video',
          )
        }
      >
        <View style={{ width: ScreenWidth / 3 }}>
          {listVideoLocal[0].src === item ? (
            <View
              style={{
                width: ScreenWidth / 3,
                height: ScreenHeight / 3,
                overflow: 'hidden',
                borderRadius: 10,
              }}
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
            // <BWVideoPlayer
            //     video={{ uri: item }}
            //     resizeMode={'center'}
            //     thumbnail={{ uri: item }}
            //     pauseOnPress={true}
            //     autoplay
            //     // videoHeight={ScreenHeight - 50}
            //     videoWidth={ScreenWidth}
            //     paused={!isFocusScreen}

            // />
            <View
              style={{
                width: ScreenWidth / 3,
                height: ScreenHeight / 3,
                overflow: 'hidden',
                borderRadius: 10,
              }}
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
      </Pressable>
    );
  };
  const renderItemImageLocal = (item: any, index: any) => {
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
            zIndex: 2000,
            width: ScreenWidth / 4 - 13,
            height: ScreenHeight / 5,
          }}
        >
          <CText></CText>
          {item.isLoading === false ? (
            <Blurhash
              blurhash={'LGFFaXYk^6#M@-5c,1J5@[or[Q6.'}
              decodeAsync={false}
              style={{
                position: 'absolute',
                zIndex: 1,
                width: ScreenWidth / 4 - 13,
                height: ScreenHeight / 5,
                left: 5,
              }}
              resizeMode="cover"
            />
          ) : null}
        </View>
        <View style={{ width: ScreenWidth / 4.5, margin: 1 }}>
          {/* <BWVideoPlayer
                        video={{ uri: item.image.uri }}
                        resizeMode={'center'}
                        thumbnail={{ uri: item.image.uri }}
                        pauseOnPress={true}
                        autoplay
                        videoHeight={ScreenHeight - 50}
                        videoWidth={ScreenWidth}
                        paused={!isFocusScreen}
                    /> */}
          <View
            style={{
              width: ScreenWidth / 4 - 13,
              height: ScreenHeight / 5,
              overflow: 'hidden',
              borderRadius: 10,
              left: 5,
            }}
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
    if (checkVideoLink) {
      return (
        <Pressable
          style={{ width: ScreenWidth / 1.3 - 2, paddingTop: 10 }}
          onLongPress={() =>
            handleShowModalText(
              idMessage,
              listVideo[0].data,
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'video',
            )
          }
          onPress={() =>
            handleDetailVideo(listVideo[0].data, listVideo[0].type)
          }
        >
          <View
            style={{
              position: 'absolute',
              zIndex: 2000,
              width: ScreenWidth / 1.7,
              height: ScreenHeight / 2,
            }}
          >
            <CText></CText>
          </View>
          <View
            style={{
              width: checkUser ? ScreenWidth / 1.3 - 2 : ScreenWidth / 1.4,
              height: 400,
              overflow: 'hidden',
              borderRadius: 10,
            }}
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
            <View style={[screenStyles.fillParent, { borderRadius: 10 }]}>
              {converntVideoImg && (
                <ImageHelper source={{ uri: converntVideoImg }} />
              )}
            </View>
          </View>
        </Pressable>
      );
    } else {
      return (
        <>
          <Pressable
            style={{
              width: checkUser ? ScreenWidth / 1.2 - 10 : ScreenWidth / 1.3 - 2,
            }}
            onLongPress={() =>
              handleShowModalText(
                idMessage,
                listVideo[0].data,
                titleName,
                userId,
                checkDeleteMess,
                isPin,
                'video',
              )
            }
            onPress={() =>
              handleDetailVideo(listVideo[0].data, listVideo[0].type)
            }
          >
            <View
              style={{
                position: 'absolute',
                zIndex: 2000,
                width: checkUser
                  ? ScreenWidth / 1.2 - 10
                  : ScreenWidth / 1.3 - 2,
                height: ScreenHeight / 2,
              }}
            >
              <CText></CText>
            </View>
            <View
              style={{
                width: checkUser
                  ? ScreenWidth / 1.2 - 10
                  : ScreenWidth / 1.3 - 2,
                height: 400,
                overflow: 'hidden',
                borderRadius: 10,
              }}
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
              <View style={[screenStyles.fillParent, { borderRadius: 10 }]}>
                {converntVideoImg && (
                  <ImageHelper source={{ uri: converntVideoImg }} />
                )}
              </View>
            </View>
          </Pressable>
        </>
      );
    }
  } else if (listVideo.length === 2) {
    return (
      <View
        style={{
          // flex: 1,
          flexDirection: 'row',
          // backgroundColor: 'white',5
          width: checkUser ? ScreenWidth / 1.2 - 10 : ScreenWidth / 1.3,
        }}
      >
        <Pressable
          onLongPress={() =>
            handleShowModalText(
              idMessage,
              listVideo[0].data,
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'video',
            )
          }
          onPress={() =>
            handleDetailVideo(listVideo[0].data, listVideo[0].type)
          }
        >
          <View
            style={{
              position: 'absolute',
              zIndex: 2000,
              width: checkUser
                ? ScreenWidth / 1.2 - 10
                : ScreenWidth / 1.5 - 15,
              height: ScreenHeight / 4,
            }}
          >
            <CText></CText>
          </View>
          {_renderItem(listVideo[0].data)}
        </Pressable>
        <View style={{ backgroundColor: 'white', width: 2 }} />
        <Pressable
          onLongPress={() =>
            handleShowModalText(
              idMessage,
              listVideo[1].data,
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'video',
            )
          }
          onPress={() =>
            handleDetailVideo(listVideo[1].data, listVideo[1].type)
          }
        >
          <View
            style={{
              position: 'absolute',
              zIndex: 2000,
              width: checkUser
                ? ScreenWidth / 1.2 - 10
                : ScreenWidth / 1.5 - 15,
              height: ScreenHeight / 4,
            }}
          >
            <CText></CText>
          </View>
          {_renderItem(listVideo[1].data)}
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
          {listVideo.map((item, index) => renderItemImage(item, index))}
        </Row>
      </>
    );
  }
};

export default VideoSelect;
