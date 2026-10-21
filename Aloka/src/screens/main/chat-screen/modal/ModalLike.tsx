import { ImageHelper } from '@/components';
import { images, screenStyles, ScreenWidth } from '@/configs';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import { Row } from '@/utils';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Platform, TouchableOpacity, View } from 'react-native';

const ModalLike = (props: any) => {
  const {
    showModalLike,
    hideModal,
    itemChoose,
    yOffset,
    onLikePost,
    xOffset,
    listLikeEmoji,
    handleUnlike,
    idMessageLikeEmoji,
    typeMessage,
    checkUser,
    arrLikeEmoji,
    user,
    textEmoji,
    textReplyEmoji,
    scrollViewRef,
  } = props;
  const [height] = useKeyboardHeight();

  const [idSelect, setIdSelect] = useState(0);
  const [idHover, setIdHover] = useState(0);
  const [imageLayouts, setImageLayouts] = useState({});
  const [checkShowUnLike, setCheckShowUnLike] = useState(false);

  useEffect(() => {
    converntUnlike();
  }, [arrLikeEmoji]);

  const converntUnlike = () => {
    if (arrLikeEmoji !== undefined) {
      let arr = [...arrLikeEmoji];
      const relsult = arr.some((item: any) => item.user_id === user.id);
      setCheckShowUnLike(relsult);
    }
  };

  function extractAndValidateURI(string: any) {
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = string.toLowerCase().match(urlPattern);
    if (urls) {
      for (let url of urls) {
        try {
          new URL(url);
          return true;
        } catch (e) {
          continue;
        }
      }
    }
    return false;
  }

  const converntShowModalSmallLeft = (type: any) => {
    if (
      ((type === 'text' && textReplyEmoji !== null) || type === undefined) &&
      extractAndValidateURI(textEmoji)
    ) {
      if (checkShowUnLike) {
        return 30;
      } else {
        return 10;
      }
    } else if (
      ((type === 'text' && textReplyEmoji === null) || type === undefined) &&
      !extractAndValidateURI(textEmoji)
    ) {
      if (checkShowUnLike) {
        return 30;
      } else {
        return -10;
      }
    } else if (type === 'file') {
      if (checkShowUnLike) {
        return ScreenWidth / 2 - 88;
      } else {
        return ScreenWidth / 3 - 58;
      }
    } else if (type === 'voice') {
      if (checkShowUnLike) {
        return ScreenWidth / 2.4 - 10;
      } else {
        return ScreenWidth / 3.3;
      }
    } else {
      if (checkShowUnLike) {
        return 30;
      } else {
        return -5;
      }
    }
  };

  const converntShowModalBigLeft = (type: any) => {
    if (
      ((type === 'text' && textReplyEmoji !== null) || type === undefined) &&
      extractAndValidateURI(textEmoji)
    ) {
      if (checkShowUnLike) {
        return 20;
      } else {
        return -20;
      }
    } else if (
      ((type === 'text' && textReplyEmoji === null) || type === undefined) &&
      !extractAndValidateURI(textEmoji)
    ) {
      if (checkShowUnLike) {
        return 20;
      } else {
        return -20;
      }
    } else if (type === 'file') {
      if (checkShowUnLike) {
        return ScreenWidth / 2 - 98;
      } else {
        return ScreenWidth / 3 - 68;
      }
    } else if (type === 'voice') {
      if (checkShowUnLike) {
        return ScreenWidth / 2.4 - 15;
      } else {
        return ScreenWidth / 3.3 - 10;
      }
    } else {
      if (checkShowUnLike) {
        return 20;
      } else {
        return -20;
      }
    }
  };

  const converntShowModalBigRight = (type: any) => {
    if (type === 'text' || type === undefined) {
      if (checkShowUnLike) {
        return 30;
      } else {
        return 70;
      }
    } else if (type === 'file') {
      if (checkShowUnLike) {
        return ScreenWidth / 2 - 78;
      } else {
        return ScreenWidth / 2 - 38;
      }
    } else if (type === 'voice') {
      if (checkShowUnLike) {
        return ScreenWidth / 2.3 - 10;
      } else {
        return ScreenWidth / 2;
      }
    } else {
      if (checkShowUnLike) {
        return 30;
      } else {
        return 70;
      }
    }
  };

  const converntShowModalSmallRight = (type: any) => {
    if (type === 'text' || type === undefined) {
      if (checkShowUnLike) {
        return 40;
      } else {
        return 80;
      }
    } else if (type === 'file') {
      if (checkShowUnLike) {
        return ScreenWidth / 2 - 88;
      } else {
        return ScreenWidth / 2 - 48;
      }
    } else if (type === 'voice') {
      if (checkShowUnLike) {
        return ScreenWidth / 2.4 - 10;
      } else {
        return ScreenWidth / 2.1;
      }
    } else {
      if (checkShowUnLike) {
        return 40;
      } else {
        return 80;
      }
    }
  };

  const getImgLike = (likePos: any) => {
    let src = likePos.icon;
    return src;
  };

  const _renderNumberLike = (item: any, index: any) => {
    let src = getImgLike(item);
    return (
      <TouchableOpacity
        key={index}
        style={{
          marginTop: idHover === item ? 5 : 12,
          bottom: 5,
        }}
        onPress={() => {
          onLikePost(item.id, idMessageLikeEmoji);
          hideModal();
        }}
        // onLayout={e => onLayoutLike(e, item)}
      >
        <View style={screenStyles.box24}>
          <ImageHelper
            // style={{width: 22, height: 22, marginHorizontal: 4,}}
            source={{ uri: item.icon }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={showModalLike}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={hideModal}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={hideModal}
          style={{
            flex: 1,
            backgroundColor: 'black',
            opacity: 0.1,
          }}
        ></TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            right: checkUser ? 70 : 10,
            top: yOffset - 65,
            zIndex: 1,
          }}
        >
          <Row>
            <View
              style={{
                width: 220,
                backgroundColor: 'white',
                flexWrap: 'wrap',
                margin: 5,
                borderRadius: 20,
                paddingHorizontal: 5,
              }}
            >
              <Row around>
                {listLikeEmoji.map((item: any, index: any) =>
                  _renderNumberLike(item, index),
                )}
              </Row>
            </View>
            {checkShowUnLike ? (
              <TouchableOpacity onPress={handleUnlike}>
                <Image
                  source={images.community.icon_unLike}
                  style={screenStyles.box40}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : null}
          </Row>
        </View>
      </View>
    </Modal>
  );
};

ModalLike.defaultProps = {
  showModalLike: false,
  hideModal: () => {},
  itemChoose: {},
  yOffset: 0,
  onLikePost: () => {},
};

export default ModalLike;
