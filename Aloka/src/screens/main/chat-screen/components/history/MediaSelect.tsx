import { IconType, IconX, ImageHelper } from '@/components';
import { ScreenWidth, images, screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { ScreenHeight } from '@rneui/base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { Blurhash } from 'react-native-blurhash';
import Video from 'react-native-video';

const MediaSelect = (props: any) => {
  const {
    list = [],
    onDetailImgVideo,
    itemRoomId,
    idMessage,
    checkUser,
    onDeleteMessage,
    onRecallMessage,
    isFocusScreen,
    handleShowModalText,
    titleName,
    userId,
    checkDeleteMess,
    isPin,
    checkLoading,
  } = props;
  const [listVideo, setListImages] = useState<any[]>([]);
  const [listVideoLocal, setListImagesLocal] = useState<any[]>([]);
  const [showMessModal, setShowMessModal] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (list === t('community.chat.recall')) {
      setListImages([]);
      setListImagesLocal([]);
    } else {
      if (list[0]?.image?.uri === undefined) {
        setListImages(JSON.parse(list));
        setListImagesLocal([]);
      } else {
        setListImages([]);
        setListImagesLocal(list);
      }
    }
  }, []);

  const handleDetailVideo = (item: any, type: any) => {
    onDetailImgVideo(item, type);
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
            width: checkUser ? ScreenWidth / 2.5 + 2 : ScreenWidth / 2.6 - 5,
            height: 200,
            borderRadius: 10,
          }}
        >
          {listVideo[0].data === item ? (
            listVideo[0].type === 'image' ? (
              <ImageHelper
                source={{ uri: item }}
                renderErrorImage={renderErrorImage}
                imageStyle={{
                  width: checkUser ? ScreenWidth / 2.5 + 2 : ScreenWidth / 2.6,
                  height: 200,
                  borderRadius: 10,
                }}
              />
            ) : (
              <View
                style={{
                  width: checkUser ? ScreenWidth / 2.5 + 2 : ScreenWidth / 2.6,
                  height: 200,
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
                  resizeMode="cover"
                />
              </View>
            )
          ) : listVideo[1].type !== 'video' ? (
            <ImageHelper
              source={{ uri: item }}
              renderErrorImage={renderErrorImage}
              imageStyle={{
                width: checkUser ? ScreenWidth / 2.5 + 2 : ScreenWidth / 2.6,
                height: 200,
                borderRadius: 10,
              }}
            />
          ) : (
            <View
              style={{
                width: checkUser ? ScreenWidth / 2.5 + 2 : ScreenWidth / 2.6,
                height: 200,
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
                resizeMode="cover"
              />
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
            item,
            titleName,
            userId,
            checkDeleteMess,
            isPin,
            'media',
          )
        }
        onPress={() => handleDetailVideo(item.data, item.type)}
      >
        {item.type === 'image' ? (
          <Row
            style={{
              width: checkUser ? ScreenWidth / 3.8 : ScreenWidth / 4,
              margin: 1,
            }}
          >
            <ImageHelper
              source={{ uri: item.data }}
              renderErrorImage={renderErrorImage}
              imageStyle={{
                width: checkUser ? ScreenWidth / 3.8 : ScreenWidth / 4,
                height: 100,
                borderRadius: 10,
              }}
            />
          </Row>
        ) : (
          <>
            <View
              style={{
                position: 'absolute',
                zIndex: 2000,
                width: checkUser ? ScreenWidth / 4.5 : ScreenWidth / 4,
                height: 100,
              }}
            >
              <CText></CText>
            </View>
            <View
              style={{
                width: checkUser ? ScreenWidth / 3.8 : ScreenWidth / 4,
                margin: 1,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  width: checkUser ? ScreenWidth / 3.8 : ScreenWidth / 4,
                  height: 100,
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
                  resizeMode="cover"
                />
              </View>
            </View>
          </>
        )}
      </Pressable>
    );
  };

  const _renderItemLocal = (item: any) => {
    return (
      <View>
        <View style={{ width: ScreenWidth / 3, height: 200 }}>
          {listVideoLocal[0].image.uri === item ? (
            listVideoLocal[0].type === 'image' ? (
              <Image
                source={{ uri: item }}
                style={{
                  width: ScreenWidth / 3,
                  height: 200,
                  borderRadius: 10,
                }}
              />
            ) : (
              <View
                style={{
                  width: ScreenWidth / 3,
                  height: 200,
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
                  resizeMode="cover"
                />
              </View>
            )
          ) : // </View>
          listVideoLocal[1].type !== 'video' ? (
            <Image
              source={{ uri: item }}
              style={{ width: ScreenWidth / 3, height: 200, borderRadius: 10 }}
            />
          ) : (
            <View
              style={{
                width: ScreenWidth / 3,
                height: 200,
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
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderItemImageLocal = (item: any, index: any) => {
    return (
      <Pressable
        key={index}
        onLongPress={() =>
          handleShowModalText(
            idMessage,
            item.image,
            titleName,
            userId,
            checkDeleteMess,
            isPin,
            'media',
          )
        }
        onPress={() => handleDetailVideo(item.image.uri, item.type)}
        style={{ borderRadius: 10, overflow: 'hidden' }}
      >
        {item.type === 'image' ? (
          <Row style={{ width: ScreenWidth / 4.5, margin: 1 }}>
            <Image
              source={{ uri: item.image.uri }}
              style={{
                width: ScreenWidth / 4.5,
                height: 100,
                borderRadius: 10,
              }}
            />
          </Row>
        ) : (
          <>
            <View
              style={{
                position: 'absolute',
                zIndex: 2000,
                width: ScreenWidth / 4.5,
                height: 100,
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
                    width: ScreenWidth / 4.5 + 1,
                    height: 105,
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              ) : null}
            </View>
            <View
              style={{ width: ScreenWidth / 4.5, margin: 1, borderRadius: 10 }}
            >
              <View
                style={{
                  width: ScreenWidth / 4.5,
                  height: 100,
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
                  resizeMode="cover"
                />
              </View>
            </View>
          </>
        )}
      </Pressable>
    );
  };

  if (listVideoLocal.length > 0) {
    if (listVideoLocal.length === 2) {
      return (
        <View
          style={{
            // flex: 1,
            flexDirection: 'row',
            // backgroundColor: 'white',
            width: ScreenWidth / 1.5,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <Pressable
            onLongPress={() =>
              handleShowModalText(
                idMessage,
                listVideoLocal[0].image,
                titleName,
                userId,
                checkDeleteMess,
                isPin,
                'media',
              )
            }
            onPress={() =>
              handleDetailVideo(
                listVideoLocal[0].image.uri,
                listVideoLocal[0].type,
              )
            }
          >
            <View
              style={{
                position: 'absolute',
                zIndex: 2000,
                width: ScreenWidth / 3,
                height: ScreenHeight / 5.5,
              }}
            >
              <CText></CText>
              {listVideoLocal[0].isLoading === false ? (
                <Blurhash
                  blurhash={'LGFFaXYk^6#M@-5c,1J5@[or[Q6.'}
                  decodeAsync={false}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    width: ScreenWidth / 3,
                    height: ScreenHeight / 5 + 15,
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              ) : null}
            </View>
            {_renderItemLocal(listVideoLocal[0].image.uri)}
          </Pressable>
          <View style={{ backgroundColor: 'white', width: 2 }} />
          <Pressable
            onLongPress={() =>
              handleShowModalText(
                idMessage,
                listVideoLocal[1].image,
                titleName,
                userId,
                checkDeleteMess,
                isPin,
                'media',
              )
            }
            onPress={() =>
              handleDetailVideo(
                listVideoLocal[1].image.uri,
                listVideoLocal[1].type,
              )
            }
          >
            <View
              style={{
                position: 'absolute',
                zIndex: 2000,
                width: ScreenWidth / 3,
                height: ScreenHeight / 5.5,
              }}
            >
              <CText></CText>
              {listVideoLocal[0].isLoading === false ? (
                <Blurhash
                  blurhash={'LGFFaXYk^6#M@-5c,1J5@[or[Q6.'}
                  decodeAsync={false}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    width: ScreenWidth / 3,
                    height: ScreenHeight / 5 + 15,
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              ) : null}
            </View>
            {_renderItemLocal(listVideoLocal[1].image.uri)}
          </Pressable>
        </View>
      );
    } else {
      return (
        <>
          {listVideoLocal.length > 0 ? (
            <Row
              start
              style={{
                width: ScreenWidth / 1.5 + 8,
                left: 5,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
              }}
            >
              {listVideoLocal?.map((item: any, index: any) =>
                renderItemImageLocal(item, index),
              )}
            </Row>
          ) : null}
        </>
      );
    }
  }

  if (listVideo.length === 2) {
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
              listVideo[0],
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'media',
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
              width: checkUser ? ScreenWidth / 2.5 : ScreenWidth / 2.6,
              height: ScreenHeight / 5.5,
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
              listVideo[1],
              titleName,
              userId,
              checkDeleteMess,
              isPin,
              'media',
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
              width: checkUser ? ScreenWidth / 3 : ScreenWidth / 2.6,
              height: ScreenHeight / 5.5,
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
        {checkUser ? (
          listVideo.length > 0 ? (
            <Row
              start
              style={{
                width: ScreenWidth / 1.2 - 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
              }}
            >
              {listVideo?.map((item: any, index: any) =>
                renderItemImage(item, index),
              )}
            </Row>
          ) : null
        ) : (
          <Row
            end
            style={{
              width: ScreenWidth / 1.3,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {listVideo?.map((item: any, index: any) =>
              renderItemImage(item, index),
            )}
          </Row>
        )}
      </>
    );
  }
};

export default MediaSelect;
