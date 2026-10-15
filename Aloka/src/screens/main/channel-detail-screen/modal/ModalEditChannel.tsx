import {
  CAreaContent,
  CInput,
  IconType,
  IconX,
  ImageHelper,
  Toast,
} from '@/components';
import {
  getStatusBarHeight,
  ifIphoneX,
  isEmptyArray,
  isIOS,
  screenStyles,
  ScreenWidth,
} from '@/configs';
import { thumnailSingleCropLauncher } from '@/permissions/laucher';
import { showPhotoLibraryDropThumnail } from '@/permissions/picker';
import {
  resetPackageChannel,
  updateChannel,
} from '@/redux/slices/channelSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CScrollView, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme, makeStyles } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Categories from './Categories';
import { ModalCategory } from './modal-categories';

type DataEditProps = {
  fileThumnail: any;
  channelName: string;
  description: string;
  thumnailPrefix: string;
  listCategoires: any;
  stringIdCategories: string;
};

const useStyles = makeStyles(({ colors }) => ({
  thumnailWrapper: {
    borderRadius: 8,
    borderColor: colors.cD0D5DD,
    backgroundColor: colors.cFCFCFD,
    borderWidth: 1,
    marginTop: 8,
    height: (ScreenWidth / 3.5) * 1.33,
    width: ScreenWidth / 3.5,
    overflow: 'hidden' as const,
  },
  thumImg: {
    width: '100%' as const,
    height: '100%' as const,
    borderRadius: 8,
    overflow: 'hidden' as const,
  },
  btnAddCategories: {
    ...screenStyles.mL16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end' as const,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  contentContainer: {
    width: '100%' as const,
    height: '87%' as const,
  },
}));

export const ModalEditChannel = ({
  isVisible,
  itemEdit,
  hideModal,
  onUpdateChannelSuccess,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const { dataUpdateChannel } = useAppSelector(state => state.channelReducer);

  const scrollRef = useRef<any>(null);

  const [errfileThumnail, setErrfileThumnail] = useState<string>('');

  const channelNameRef = useRef<any>(null);
  const [errChannelName, setErrChannelName] = useState<string>('');

  const [activeBtn, setActiveBtn] = useState(false);

  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const toastEl = useRef(null);
  const desEl = useRef<any>(null);
  const [errDes, setErrDes] = useState<string>('');

  const [dataEdit, setDataEdit] = useState<DataEditProps>({
    channelName: '',
    fileThumnail: { path: null },
    thumnailPrefix: '', // link cdn
    description: '',
    listCategoires: [],
    stringIdCategories: '',
  });

  const [showModalCategories, setShowModalCategories] = useState(false);

  useEffect(() => {
    const initDataEdit = () => {
      const { name, description, avatar } = itemEdit;
      setDataEdit((prev: DataEditProps) => ({
        ...prev,
        thumnailPrefix: avatar,
        channelName: name,
        description: description,
        fileThumnail: { path: itemEdit.avatar || null },
        listCategoires: itemEdit.categories || [],
        stringIdCategories: '',
      }));
    };
    if (itemEdit?.id) {
      initDataEdit();
    }
  }, [itemEdit]);

  useEffect(() => {
    const checkActiveBtn = () => {
      const { channelName, fileThumnail, description } = dataEdit;

      let valid = true;
      if (channelName.toString().trim() == '') {
        valid = false;
      }
      // Kiem tra tiep trang thai du lieu co thay doi khong
      let isChange = false;
      if (fileThumnail && fileThumnail.path !== itemEdit.avatar) {
        isChange = true;
      }
      if (channelName.toString().trim() !== itemEdit.name.toString().trim()) {
        isChange = true;
      }
      if (
        description.toString().trim() !==
        (itemEdit.description || '').toString().trim()
      ) {
        isChange = true;
      }
      // ✅ categories
      const oldCategories = (itemEdit.categories || [])
        .map((i: any) => i.id)
        .sort();
      const newCategories = (dataEdit.listCategoires || [])
        .map((i: any) => i.id)
        .sort();

      if (JSON.stringify(oldCategories) !== JSON.stringify(newCategories)) {
        isChange = true;
      }
      setActiveBtn(valid && isChange);
    };
    checkActiveBtn();
  }, [JSON.stringify(dataEdit), itemEdit]);

  const detectErrAPI = (errAPI: any) => {
    if (errAPI) {
      const { errors } = errAPI;
      if (!isEmptyArray(errors)) {
        for (let i = 0; i < errors.length; i++) {
          let item = errors[i];
          if (item.key) {
            switch (item.key) {
              case 'name':
                setErrChannelName(item.msg || 'please check again!');
                break;
              case 'des':
                setErrDes(item.msg || 'please check again!');
                break;
              case 'thumbnail.data':
                setErrfileThumnail(item.msg || 'please check again!');
                break;
              default:
                break;
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    const { loading, data, error } = dataUpdateChannel;
    if (!loading) {
      if (data) {
        setIsLoadingAPI(false);
        dispatch(resetPackageChannel());
        onUpdateChannelSuccess();
      } else if (error) {
        console.log('🚀 ~ ModalEditChannel ~ error:', error);
        detectErrAPI(error);
        setIsLoadingAPI(false);
        dispatch(resetPackageChannel());
      }
    }
  }, [dataUpdateChannel]);

  //ACTION
  const handleChangeChannelName = (value: string) => {
    setDataEdit((prev: DataEditProps) => ({ ...prev, channelName: value }));
    setErrChannelName('');
  };

  const handleSubmit = () => {
    if (isLoadingAPI) return;

    setIsLoadingAPI(true);
    const { channelName, description, fileThumnail, stringIdCategories } =
      dataEdit;
    let data: any = {
      id: itemEdit.id,
      name: channelName.toString().trim(),
      description: description.toString().trim(),
    };
    if (fileThumnail.path && fileThumnail.path != itemEdit.thumbnail) {
      data.avatar = fileThumnail.data;
    }
    if (stringIdCategories) {
      data.category_id = stringIdCategories;
    }
    setTimeout(() => {
      dispatch(updateChannel(data));
    }, 250);
  };

  const handleUploadThumnail = async () => {
    let checkPhoto: any = {};
    if (Platform.OS == 'android') {
      checkPhoto = await showPhotoLibraryDropThumnail();
    } else {
      checkPhoto = await thumnailSingleCropLauncher();
    }
    if (checkPhoto.isSuccess) {
      if (checkPhoto.imgRes) {
        setDataEdit({
          ...dataEdit,
          fileThumnail: checkPhoto.imgRes,
        });
        setErrfileThumnail('');
      }
    } else if (checkPhoto.msg) {
      console.log('🚀 ~ handlePhoto ~ checkPhoto.msg:', checkPhoto.msg);
    }
  };

  const handleChangeDes = (value: string) => {
    setDataEdit((prev: DataEditProps) => ({ ...prev, description: value }));
    setErrDes('');
  };

  const handleUpdateCategories = (
    listCategoires: any,
    strCategories: string,
  ) => {
    setDataEdit((prev: DataEditProps) => ({
      ...prev,
      listCategoires: listCategoires,
      stringIdCategories: strCategories || '',
    }));
    setShowModalCategories(false);
  };

  //RENDER
  const renderThumnail = () => {
    return (
      <>
        <CText h5 color={colors.c344054}>
          {t('package.thumnail', 'Thumbnail')}
        </CText>
        <Pressable
          style={[
            styles.thumnailWrapper,
            {
              borderStyle: dataEdit.fileThumnail.path ? 'solid' : 'dashed',
            },
          ]}
          onPress={handleUploadThumnail}
        >
          {dataEdit.fileThumnail.path || dataEdit.thumnailPrefix ? (
            <View style={styles.thumImg}>
              <ImageHelper
                source={{
                  uri:
                    dataEdit.fileThumnail.path || dataEdit.thumnailPrefix || '',
                }}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconX
                type={IconType.MATERIAL_DESIGN_ICONS}
                name="file-image-plus"
                size={32}
                color={colors.c98A2B3}
              />
              <CText h6 color={colors.c98A2B3} style={{ marginTop: 8 }}>
                {'3:4'}
              </CText>
            </View>
          )}
        </Pressable>
        {errfileThumnail && (
          <CText
            h5
            w400
            style={{
              marginVertical: 5,
              color: '#F04438',
              marginLeft: 5,
            }}
          >
            {errfileThumnail}
          </CText>
        )}
      </>
    );
  };

  const renderChannelName = () => {
    return (
      <CInput
        isRequire
        refChild={channelNameRef}
        value={dataEdit.channelName}
        onChange={handleChangeChannelName}
        errorText={errChannelName}
        label={t('channel.name', 'Tên kênh')}
        placeHolder={t('channel.name', 'Tên kênh')}
        returnKeyType={'next'}
        autoCapitalize={'words'}
        onSubmitEditing={() => desEl.current?.focus()}
        maxLength={124}
      />
    );
  };

  const renderAddingDes = () => {
    return (
      <CAreaContent
        refChild={desEl}
        value={dataEdit.description}
        onChange={handleChangeDes}
        errorText={errDes}
        label={t('doctorProfile.about')}
        labelStyle={{ fontWeight: '400', fontSize: 14, color: colors.c344054 }}
        placeHolder={t('channel.descriptionPlaceHolder')}
        onFocus={() => {
          if (isIOS) {
            setTimeout(() => {
              scrollRef.current?.scrollToEnd({ animated: true });
            }, 300);
          }
        }}
      />
    );
  };

  const renderCategory = () => {
    return <Categories listData={dataEdit.listCategoires} />;
  };

  const renderCategories = () => {
    return (
      <View style={screenStyles.mT5}>
        <Row start>
          <CText h5 color={colors.c344054}>
            {t('doctorProfile.specialist')}
          </CText>
          <Pressable
            hitSlop={screenStyles.hitSlop20}
            onPress={() => {
              setShowModalCategories(true);
            }}
            style={styles.btnAddCategories}
          >
            <IconX
              type={IconType.OCTICONS}
              name="plus"
              color={colors.primary}
              size={16}
            />
          </Pressable>
        </Row>
        {renderCategory()}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={[screenStyles.wrapModalTop]}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX
              name={'close'}
              type={IconType.ANT_DESIGN}
              color={colors.c667085}
              size={24}
            />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('profile.editChannel', 'Chỉnh sửa kênh')}
          </CText>
          <View style={screenStyles.box24} />
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        <KeyboardAvoidingView
          behavior={isIOS ? 'padding' : undefined}
          style={screenStyles.flex1}
          keyboardVerticalOffset={getStatusBarHeight() + ifIphoneX(20, 30)}
        >
          <CScrollView innerRef={scrollRef} style={screenStyles.pH24}>
            <View style={{ height: 12 }} />
            {renderThumnail()}
            <View style={{ height: 4 }} />
            {renderChannelName()}
            {renderAddingDes()}
            {renderCategories()}
          </CScrollView>
        </KeyboardAvoidingView>
        <View style={screenStyles.pH24}>
          <CButton
            title={t('common.confirm', 'Confirm')}
            btnWidth={'100%'}
            onPress={handleSubmit}
            isDisable={!activeBtn || isLoadingAPI}
            isBottom
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={hideModal}
    >
      <View style={styles.modalContainer}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hideModal}>
          <View style={styles.backdrop} />
        </Pressable>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>
      <Toast ref={toastEl} position="center" />
      {showModalCategories ? (
        <ModalCategory
          isVisible={showModalCategories}
          hideModal={() => setShowModalCategories(false)}
          listCategoryChoose={dataEdit.listCategoires || []}
          updateListCategories={handleUpdateCategories}
        />
      ) : null}
      {isLoadingAPI && (
        <View style={styles.loadingOverlay} accessibilityRole="progressbar">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </Modal>
  );
};
