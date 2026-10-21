import { ScreenWidth, images, isIOS } from '@/configs';
import { useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { MessageModal } from '../../modal/MessageModal';
// import { MessageModal } from '../../../modal/MessageModal';

const FileLocal = (props: any) => {
  const {
    list = [],
    onDetailFile,
    itemRoomId,
    idMessage,
    checkUser,
    onDeleteMessage,
    onRecallMessage,
    handleShowModalText,
    titleName,
    userId,
    checkDeleteMess,
    isPin,
  } = props;
  const [showMessModal, setShowMessModal] = useState<boolean>(false);
  const { appBgChat } = useAppSelector(state => state.communityReducer);

  const handleFileFetail = () => {
    onDetailFile(list[0].src);
  };
  const handleFileContentType = (name: any) => {
    switch (name) {
      case 'pdf':
        return images.community.file_pdf;
      case 'doc':
        return images.community.file_doc;
      case 'docx':
        return images.community.file_docx;
      case 'xls':
        return images.community.file_xsl;
      case 'xlsx':
        return images.community.file_xsl;
      default:
        return images.community.file_pdf;
    }
  };

  const handleFileColorNameFile = (color: any) => {
    switch (color) {
      case 1:
        return '#98A2B3';
      case 2:
        return '#FFFFFF';
      case 3:
        return '#FFFFFF';
      default:
        return '#98A2B3';
    }
  };

  const handleFileColorType = (color: any) => {
    switch (color) {
      case 1:
        return '#101828';
      case 2:
        return '#FFFFFF';
      case 3:
        return '#FFFFFF';
      default:
        return '#101828';
    }
  };

  const showModalMess = () => {
    setShowMessModal(true);
  };

  const handleDeleteMess = () => {
    onDeleteMessage(itemRoomId, idMessage);
  };

  const handleRecallMess = () => {
    onRecallMessage(itemRoomId, idMessage);
  };
  return (
    <Pressable
      onPress={() => {
        handleFileFetail();
      }}
      onLongPress={() =>
        handleShowModalText(
          idMessage,
          list[0],
          titleName,
          userId,
          checkDeleteMess,
          isPin,
          'file',
        )
      }
    >
      <View
        style={{
          width: ScreenWidth / 2 - 18,
          height: 80,
          borderRadius: 10,
          paddingHorizontal: 13,
          backgroundColor: appBgChat.bgRightColor,
          justifyContent: 'center',
        }}
      >
        <Row start>
          <Image
            source={handleFileContentType(list[0]?.filename?.split('.').pop())}
            style={{ height: 40, width: 36 }}
          />
          <View
            style={{
              paddingHorizontal: 7,
              width: isIOS ? ScreenWidth / 3 - 10 : ScreenWidth / 4,
            }}
          >
            <CText
              numberOfLines={1}
              h46
              color={handleFileColorNameFile(appBgChat.id)}
            >
              {list[0].filename}
            </CText>
            <View style={{ paddingVertical: 2 }} />
            <CText h46 color={handleFileColorType(appBgChat.id)}>
              {list[0]?.filename?.split('.').pop().toUpperCase()}
            </CText>
          </View>
        </Row>
      </View>
      {showMessModal && (
        <MessageModal
          isVisible={showMessModal}
          hideModal={() => setShowMessModal(false)}
          handleDeleteMess={handleDeleteMess}
          handleRecallMess={handleRecallMess}
          itemRoomId={itemRoomId}
          checkUser={checkUser}
        />
      )}
    </Pressable>
  );
};

export default FileLocal;
