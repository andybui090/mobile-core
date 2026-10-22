import {
    ScreenWidth,
    images
} from '@/configs';
import { useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { MessageModal } from '../../modal/MessageModal';

const FileSelect = (props: any) => {
    const { list = [], onDetailFile, checkUser, itemRoomId, idMessage, onDeleteMessage,
        onRecallMessage, handleShowModalText, titleName,
        userId, checkDeleteMess, isPin, checkLoading } = props;
    const [listFile, setListFile] = useState<any>({});
    const [showMessModal, setShowMessModal] = useState<boolean>(false);
    const { appBgChat } = useAppSelector(state => state.communityReducer);

    useEffect(() => {
        if (!checkLoading) {
            if (list.includes("filename")) {
                setListFile(JSON.parse(list));
            } else {
                setListFile([])
            }
        }
    }, []);

    const handleFileFetail = () => {
        onDetailFile(listFile.data)
    }

    const handleFileContentType = (name: any) => {
        switch (name) {
            case 'pdf':
                return images.community.file_pdf
            case 'doc':
                return images.community.file_doc
            case 'docx':
                return images.community.file_docx
            case 'xls':
                return images.community.file_xsl
            case 'xlsx':
                return images.community.file_xsl
            default:
                return images.community.file_pdf
        }
    };

    const handleFileColorNameFile = (color: any) => {
        switch (color) {
            case 1:
                return '#98A2B3'
            case 2:
                return '#FFFFFF'
            case 3:
                return '#FFFFFF'
            default:
                return '#98A2B3'
        }
    };

    const handleFileColorType = (color: any) => {
        switch (color) {
            case 1:
                return '#101828'
            case 2:
                return '#FFFFFF'
            case 3:
                return '#FFFFFF'
            default:
                return '#101828'
        }
    };


    const showModalMess = () => {
        setShowMessModal(true)
    }

    const handleDeleteMess = () => {
        onDeleteMessage(itemRoomId, idMessage);
    }

    const handleRecallMess = () => {
        onRecallMessage(itemRoomId, idMessage);
    }

    if (listFile.filename !== '') {
        return (
            <Pressable onPress={() => { handleFileFetail() }}
                onLongPress={() => handleShowModalText(idMessage, listFile, titleName, userId, checkDeleteMess, isPin, 'file')} >
                <View style={{
                    width: ScreenWidth / 2 - 18, height: 80,
                    borderRadius: 10, paddingHorizontal: 13,
                    backgroundColor: checkUser ? appBgChat.bgRightColor : appBgChat.bgLeftColor, justifyContent: 'center'
                }}>
                    <Row start >
                        <Image source={handleFileContentType(listFile?.filename?.split('.').pop())} style={{ height: 40, width: 36 }} />
                        <View style={{ paddingHorizontal: 7, width: ScreenWidth / 3 - 10 }}>
                            <CText h46 numberOfLines={1} color={handleFileColorNameFile(appBgChat.id)}>{listFile.filename}</CText>
                            <View style={{ paddingVertical: 2 }} />
                            <CText h46 color={handleFileColorType(appBgChat.id)}>{listFile?.filename?.split('.').pop().toUpperCase()}</CText>
                        </View>
                    </Row>
                </View>
                {showMessModal &&
                    <MessageModal
                        isVisible={showMessModal}
                        hideModal={() => setShowMessModal(false)}
                        handleDeleteMess={handleDeleteMess}
                        handleRecallMess={handleRecallMess}
                        checkUser={checkUser}
                    />
                }
            </Pressable>
        )
    }
}


export default FileSelect;
