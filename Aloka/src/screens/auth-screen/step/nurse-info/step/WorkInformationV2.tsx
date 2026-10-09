import {
  CAreaContent,
  CInput,
  CInputTouch,
  IconType,
  IconX,
  ModalServiceRadius,
  Toast,
} from '@/components';
import { formatByte, images, isIOS, screenStyles, showToast } from '@/configs';
import { getTitleInfomations } from '@/redux/slices/onboardSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CScrollView, CText, Row } from '@/utils';
import {
  DocumentPickerResponse,
  pick,
  types,
} from '@react-native-documents/picker';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import { isArray } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, KeyboardAvoidingView, Pressable, View } from 'react-native';
// import ItemWorkInformation from './ItemWorkInformation';
import ModalSearchNearby from '../../components/ModalSearchNearby';
import { STORAGEKEY } from '@/constants/storage_key';
import { getObjectData, storeObjectData } from '@/storages';

const useStyles = makeStyles(({ colors }) => ({
  uploadWrap: {
    borderRadius: 8,
    borderColor: colors.cD0D5DD,
    backgroundColor: colors.cFCFCFD,
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  txtError: {
    marginTop: 10,
    color: '#F04438',
    marginLeft: 5,
  },
  wrapperFile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden' as const,
    backgroundColor: colors.cF2F4F7,
    ...screenStyles.centerWrap,
  },
}));

export const WorkInformationV2 = ({
  dataNurseInfo,
  updateNurseInfo,
  addNewDoc,
  showModalCommon,
  removeNewDoc,
}: any) => {
  const scrollRef = useRef<any>(null);

  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  const dispatch = useAppDispatch();
  const { titleInfomationsList } = useAppSelector(
    state => state.onboardReducer,
  );

  const [listTitleInfomations, setListTitleInfomations] = useState<any[]>([]);

  const toastEl = useRef<any>(null);

  const workplaceEl = useRef<any>(null);
  const [errWorkplace, setErrWorkplace] = useState<string>('');

  const experienceEl = useRef<any>(null);
  const [errExperience, setErrExperience] = useState('');

  const [showAddress, setShowAddress] = useState<boolean>(false);

  const [errCountry, setErrCountry] = useState<string>('');
  const [showModalRadius, setShowModalRadius] = useState<boolean>(false);

  // Effect
  useEffect(() => {
    dispatch(getTitleInfomations({ limit: 20 }));
  }, []);

  useEffect(() => {
    const processAPISpecializations = () => {
      if (isArray(titleInfomationsList.data?.items)) {
        // loai bo item co code=occupation
        const items = titleInfomationsList.data.items.filter(
          item => item.code !== 'occupation',
        );
        setListTitleInfomations(items);
      } else if (titleInfomationsList.error) {
        //   dispatch(resetAuth());
      }
    };
    processAPISpecializations();
  }, [titleInfomationsList]);

  //Action
  const handlePickerError = (err: unknown) => {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as any).code === 'DOCUMENT_PICKER_CANCELED'
    ) {
      // user bấm cancel → bỏ qua
      console.warn('Document picker cancelled');
      return;
    }

    // lỗi thật → throw để crash log / Sentry bắt
    throw err;
  };

  const handleUploadDoc = async (item: any, index: number) => {
    try {
      const MAX_MB = 10;
      const results: DocumentPickerResponse[] = await pick({
        type: [types.doc, types.docx, types.pdf, types.images],
        copyTo: 'documentDirectory',
        allowMultiSelection: false,
      });

      if (!results || results.length === 0) return;

      const document = results[0];

      if (!document.size) return;

      const mbSize = document.size / (1024 * 1024);
      if (mbSize > MAX_MB) {
        showToast(toastEl, 'File can not be larger than 10MB', 1500);
        return;
      }

      const attachments = [...dataNurseInfo.attachments];

      attachments[index] = {
        ...attachments[index],
        fileUri: document.uri,
        fileName: document.name,
        fileType: document.type,
        fileSize: document.size,
      };

      updateNurseInfo('attachments', attachments);
    } catch (err) {
      handlePickerError(err);
    }
  };

  const handleUploadNewDoc = async (index: number) => {
    const MAX_MB = 10;
    try {
      const results = await pick({
        type: [types.doc, types.docx, types.pdf, types.images],
        allowMultiSelection: false,
      });

      if (!results || results.length === 0) return;

      const document = results[0];

      if (!document.size) return;

      const mbSize = document.size / (1024 * 1024);
      if (mbSize > MAX_MB) {
        showToast(toastEl, 'File can not be larger than 10MB', 1500);
        return;
      }

      const arr = [...dataNurseInfo.arrAttachments];

      arr[index] = {
        ...arr[index],
        fileUri: document.uri, // ✅ chỉ dùng uri
        fileName: document.name,
        fileType: document.type,
        fileSize: document.size,
      };

      updateNurseInfo('arrAttachments', arr);
    } catch (err) {
      handlePickerError(err);
    }
  };

  // const handlePressItemS2 = (itemChoose: any, index: number) => {
  //   // console.log('🚀 ~ handlePressItemS2 ~ itemChoose:', itemChoose);
  //   showModalCommon(itemChoose, index);
  // };

  const handleRemoveFile = (index: number) => {
    let arr = [...dataNurseInfo.attachments];
    arr[index].fileUri = '';
    arr[index].fileName = '';
    arr[index].fileSize = 0;
    arr[index].fileType = '';
    arr[index].fileCopyUri = '';
    updateNurseInfo('attachments', arr);
  };

  const handleRemoveNewFile = (index: number) => {
    let arr = [...dataNurseInfo.arrAttachments];
    arr[index].fileUri = '';
    arr[index].fileName = '';
    arr[index].fileSize = 0;
    arr[index].fileType = '';
    arr[index].fileCopyUri = '';
    updateNurseInfo('arrAttachments', arr);
  };

  const handleRemoveNewDoc = (index: number) => {
    removeNewDoc(index);
  };

  const handleChangeWorkplace = (value: string) => {
    setErrWorkplace('');
    updateNurseInfo('workplace', value);
    // resetValid();
  };

  const handleChangeDescription = (value: string) => {
    setErrExperience('');
    updateNurseInfo('description', value);
    // resetValid();
  };

  const onChooseLocation = async (newLocation: any) => {
    console.log('🚀 ~ onChooseLocation ~ newLocation:', newLocation);
    setShowAddress(false);

    if (!newLocation) return;

    updateNurseInfo('bookingAddress', newLocation);

    try {
      const arrHis =
        (await getObjectData(STORAGEKEY.ALOKA_ADDRESS_HISTORY)) || [];

      // đã tồn tại → KHÔNG lưu nữa
      const isExist = arrHis.some(
        (item: any) =>
          item?.text?.toString().trim() ===
          newLocation?.text?.toString().trim(),
      );

      if (isExist) return;

      const newHistory = [newLocation, ...arrHis].slice(0, 5);

      storeObjectData(STORAGEKEY.ALOKA_ADDRESS_HISTORY, newHistory);
    } catch (error) {
      console.log('Save address history error:', error);
    }
  };

  const handleUpdateServiceRadius = (serviceRadiusChoose: any) => {
    updateNurseInfo('serviceRadius', serviceRadiusChoose);
    setShowModalRadius(false);
  };

  //Render
  const renderAddNewDoc = () => {
    return (
      <Pressable
        style={{ marginTop: 15, ...screenStyles.rowStart }}
        onPress={addNewDoc}
      >
        <IconX
          type={IconType.IONICONS}
          name="add"
          color={colors.primary}
          size={20}
        />
        <CText h5 color={colors.primary} style={screenStyles.mL5}>
          {t('onboarding.addOtherAttachment')}
        </CText>
      </Pressable>
    );
  };

  // const renderItemS2 = (item: any, index: number) => {
  //   return (
  //     <ItemWorkInformation
  //       key={index}
  //       item={item}
  //       index={index}
  //       onPressItem={handlePressItemS2}
  //       dataNurseInfo={dataNurseInfo}
  //     />
  //   );
  // };

  // const renderListS2 = () => {
  //   if (listTitleInfomations.length > 0) {
  //     return listTitleInfomations.map(renderItemS2);
  //   }
  // };

  const renderFile = (index: number) => {
    const { attachments } = dataNurseInfo;
    if (attachments[index].fileUri == '') {
      return (
        <Row start>
          <Image
            source={images.auth.ico_upfile}
            style={screenStyles.box22}
            resizeMode="contain"
          />
          <CText h5 w400 color={colors.c667085} style={screenStyles.mL10}>
            {t('onboarding.upload', 'Upload')}
          </CText>
        </Row>
      );
    } else {
      const { fileName, fileSize, fileType, fileUri } = attachments[index];
      //chuyen kb to byte
      let fb = formatByte(fileType, fileName, fileSize);
      return (
        <>
          <Row start>
            <View style={styles.wrapperFile}>
              <Image
                source={images.auth.ico_file_uploaded}
                style={screenStyles.box16}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1 }}>
              <CText
                h5
                w400
                color={colors.c344054}
                style={screenStyles.mL5}
                numberOfLines={1}
              >
                {fb.removeEx + ` (${fb.MB})`}
              </CText>
            </View>
            <View>
              <CText h5 w400 color={colors.c344054} style={screenStyles.mL5}>
                {` (${fb.MB}) ${fb.extension}`}
              </CText>
            </View>
            <Pressable onPress={() => handleRemoveFile(index)}>
              <IconX
                type={IconType.MATERIAL_ICONS}
                name="close"
                color={colors.c344054}
                size={20}
                style={screenStyles.mL5}
              />
            </Pressable>
          </Row>
        </>
      );
    }
  };

  const renderFile2 = (index: number) => {
    const { arrAttachments } = dataNurseInfo;
    if (arrAttachments[index].fileUri == '') {
      return (
        <Row start>
          <Image
            source={images.auth.ico_upfile}
            style={screenStyles.box22}
            resizeMode="contain"
          />
          <CText h5 w400 color={colors.c667085} style={screenStyles.mL10}>
            {t('onboarding.upload', 'Upload')}
          </CText>
        </Row>
      );
    } else {
      const { fileName, fileSize, fileType, fileUri } = arrAttachments[index];
      let fb = formatByte(fileType, fileName, fileSize);
      return (
        <>
          <Row start>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: colors.cF2F4F7,
                ...screenStyles.centerWrap,
              }}
            >
              <Image
                source={images.auth.ico_file_uploaded}
                style={screenStyles.box16}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1 }}>
              <CText
                h5
                w400
                color={colors.c344054}
                style={screenStyles.mL5}
                numberOfLines={1}
              >
                {fb.removeEx + ` (${fb.MB})`}
              </CText>
            </View>
            <View>
              <CText h5 w400 color={colors.c344054} style={screenStyles.mL5}>
                {` (${fb.MB}) ${fb.extension}`}
              </CText>
            </View>
            <Pressable onPress={() => handleRemoveNewFile(index)}>
              <IconX
                type={IconType.MATERIAL_ICONS}
                name="close"
                color={colors.c344054}
                size={20}
                style={screenStyles.mL5}
              />
            </Pressable>
          </Row>
        </>
      );
    }
  };

  const renderItemS1 = (item: any, index: number) => {
    return (
      <View style={screenStyles.mT12} key={index}>
        <Row start>
          <CText h5 color={colors.c344054}>
            {item.certifiName}
          </CText>
          <CText h5 color={colors.error}>
            {' *'}
          </CText>
        </Row>
        <Pressable
          style={[
            styles.uploadWrap,
            { borderStyle: item.fileUri !== '' ? 'solid' : 'dashed' },
          ]}
          onPress={() => handleUploadDoc(item, index)}
        >
          {renderFile(index)}
        </Pressable>
      </View>
    );
  };

  const renderListSession1 = () => {
    const { attachments } = dataNurseInfo;
    if (attachments.length > 0) {
      return attachments.map(renderItemS1);
    }
  };

  const renderItemNewDoc = (index: number) => {
    return (
      <View key={index}>
        {/* <CText h5 color={colors.c344054} style={screenStyles.mT15}>
          {t('onboarding.otherAttachment', 'Other license')}
        </CText> */}
        <Row>
          <Pressable
            style={[
              styles.uploadWrap,
              {
                borderStyle:
                  dataNurseInfo.arrAttachments[index].fileUri !== ''
                    ? 'solid'
                    : 'dashed',
                flex: 1,
              },
            ]}
            onPress={() => handleUploadNewDoc(index)}
          >
            {renderFile2(index)}
          </Pressable>
          <Pressable
            onPress={() => handleRemoveNewDoc(index)}
            style={{ marginLeft: 10, marginTop: 3 }}
            hitSlop={screenStyles.hitSlop20}
          >
            <Image source={images.auth.ico_trash} style={screenStyles.box20} />
          </Pressable>
        </Row>
      </View>
    );
  };

  const renderNewDoc = () => {
    const { arrAttachments } = dataNurseInfo;
    let result = [];
    for (let i = 0; i < arrAttachments.length; i++) {
      result.push(renderItemNewDoc(i));
    }
    return result;
  };

  const renderSession1 = () => {
    return (
      <View style={[screenStyles.mT15, screenStyles.pH24]}>
        <CText h5 w600 color={colors.c344054}>
          {t('onboarding.practiceCertificate', 'Practice certificate')}
        </CText>
        {renderListSession1()}
        {renderNewDoc()}
        {renderAddNewDoc()}
      </View>
    );
  };

  // const renderSession2 = () => {
  //   return (
  //     <View style={screenStyles.pH24}>
  //       <CText h5 w600 color={colors.c344054}>
  //         {t('onboarding.titleInformation')}
  //       </CText>
  //       <View style={{ height: 4 }} />
  //       {renderListS2()}
  //     </View>
  //   );
  // };

  const renderDescription = () => {
    return (
      <CAreaContent
        isRequire
        refChild={experienceEl}
        value={dataNurseInfo.description}
        onChange={handleChangeDescription}
        errorText={errExperience}
        label={t('onboarding.workExperience')}
        placeHolder={t('onboarding.descriptionPlaceHolder')}
        onFocus={() => {
          if (isIOS) {
            scrollRef.current?.scrollToEnd({ animated: true });
          }
        }}
        // onSubmitEditing={()=>workplaceEl.current?.focus}
      />
    );
  };

  const renderWorkplace = () => {
    return (
      <CInput
        isRequire={false}
        refChild={workplaceEl}
        value={dataNurseInfo.workplace}
        onChange={handleChangeWorkplace}
        errorText={errWorkplace}
        label={t('onboarding.workplace', 'Workplace')}
        placeHolder={t(
          'onboarding.workplacePlaceHolder',
          'Enter your workplace',
        )}
        returnKeyType={'next'}
        autoCapitalize={'words'}
        // onSubmitEditing={handleUpdateCountryOnSubmit}
        maxLength={100}
      />
    );
  };

  const renderWorkingArea = () => {
    return (
      <CInputTouch
        label={t('onboarding.workingArea', 'Khu vực làm việc')}
        placeHolder={t(
          'onboarding.workingAreaPlaceHolder',
          'Chọn khu vực làm việc',
        )}
        isRequire
        name={'workingArea'}
        onTouch={() => setShowAddress(true)}
        value={dataNurseInfo.bookingAddress.text}
      />
    );
  };

  const renderServiceRadius = () => {
    return (
      <CInputTouch
        label={t('onboarding.serviceRadius', 'Bán kính phục vụ') + ' (km)'}
        placeHolder={t(
          'onboarding.serviceRadiusPlaceHolder',
          'Chọn bán kính phục vụ',
        )}
        isRequire
        name={'serviceRadius'}
        onTouch={() => setShowModalRadius(true)}
        value={dataNurseInfo.serviceRadius.label}
      />
    );
  };

  const renderSession2 = () => {
    return (
      <View style={screenStyles.pH24}>
        {/* Mo ta them ve kinh nghiem lam viec */}
        {renderDescription()}
        {/* Noi cong tac */}
        {renderWorkplace()}
        {/* Khu Vuc Cong Tac */}
        {renderWorkingArea()}
        {/* Ban kinh san sang di chuyen phuc vu */}
        {renderServiceRadius()}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : undefined}
      style={screenStyles.flex1}
    >
      <CScrollView innerRef={scrollRef}>
        {renderSession1()}
        <Divider color={colors.cF9FAFB} width={7} style={screenStyles.mV15} />
        {/* {renderSession2()} */}
        {renderSession2()}
        <Toast ref={toastEl} position="center" />
      </CScrollView>
      {showAddress && (
        <ModalSearchNearby
          modalVisibled={showAddress}
          onClose={() => {
            setShowAddress(false);
          }}
          onChooseLocation={onChooseLocation}
        />
      )}
      {showModalRadius && (
        <ModalServiceRadius
          isVisible={showModalRadius}
          hideModal={() => setShowModalRadius(false)}
          chooseServiceRadius={handleUpdateServiceRadius}
          serviceRadiusChoose={dataNurseInfo.serviceRadius}
        />
      )}
    </KeyboardAvoidingView>
  );
};
