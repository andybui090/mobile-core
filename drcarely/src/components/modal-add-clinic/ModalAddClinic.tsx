import { APILoading, CInput, CInputTouch, ICON_TYPE, IconX } from '@/components';
import { isEmptyArray, screenStyles, showError } from '@/configs';
import { createClinic, resetOnboardUnused } from '@/redux/slices/onboardSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CScrollView, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { ModalClinicType } from './ModalClinicType';
import { ModalAddress } from './modal-address/ModalAddress';

export const ModalAddClinic = ({ isVisible, hideModal, updateListClinic, searchValue }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { clinicCreate } = useAppSelector(state => state.onboardReducer);

  const [data, setData] = useState({
    clinicName: searchValue || '',
    address: '',
    addressCurrentChoose: {
      country: { id: -1, name: 'Chọn Quốc gia' },
      province: { id: -1, name: 'Chọn Thành phố' },
      district: { id: -1, name: 'Chọn Quận' },
      ward: { id: -1, name: 'Chọn Phường' },
    },
    addressDetail: '', //so nha, ten duong
    clinicType: {
      id: -1,
      name: '',
      code: '',
      description: '',
      icon: '',
    },
  });

  const clinicNameEl = useRef<any>(null);
  const [errClinicName, setErrClinicName] = useState<string>('');

  const addressEl = useRef<any>(null);
  const [errAddress, setErrAddress] = useState<string>('');

  const addressDetailEl = useRef<any>(null);
  const [errAddressDetail, setErrAddressDetail] = useState<string>('');

  const typeEl = useRef<any>(null);
  const [errType, setErrType] = useState<string>('');

  const [showClinicType, setShowClinicType] = useState<boolean>(false);
  const [showAddress, setShowAddress] = useState<boolean>(false);

  const [activeBtn, setActiveBtn] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  useEffect(() => {
    const processAPICreateClinic = () => {
      const { loading, data, error } = clinicCreate;
      if (!loading) {
        if (data) {
          console.log("🚀 ~ processAPICreateClinic ~ data:", data)
          setTimeout(() => {
            setShowAlert(false);
            setIsLoadingAPI(false);
            hideModal();
          }, 300);
          if (data.status == 'success') {
            updateListClinic();
          }
          dispatch(resetOnboardUnused(null));
        }
      } else if (error) {
        console.log("🚀 ~ processAPICreateClinic ~ error:", error)
        setShowAlert(false);
        setIsLoadingAPI(false);
        const { errors } = error;
        if (!isEmptyArray(errors)) {
          for (let i = 0; i < errors.length; i++) {
            let item = errors[i];
            if (item.key) {
              switch (item.key) {
                case 'address':
                  setErrAddress(item.msg || 'please check again!');
                  break;
                default:
                  showError(item.msg || 'please check again!');
                  break;
              }
            }
          }
        }
        dispatch(resetOnboardUnused(null));
      }
    };
    processAPICreateClinic();
  }, [clinicCreate]);

  useEffect(() => {
    const checkActiveBtn = () => {
      let valid = true;
      const { clinicName, address, addressDetail, clinicType } = data;
      if (clinicName === '') {
        valid = false;
      }
      if (address === '') {
        valid = false;
      }
      if (addressDetail == '') {
        valid = false;
      }
      if (clinicType.id == -1) {
        valid = false;
      }
      setActiveBtn(valid);
    };
    checkActiveBtn();
  }, [data]);

  //ACTION
  const handleSubmit = () => {
    const { clinicName, addressDetail, clinicType, addressCurrentChoose } = data;
    const bodyData = {
      name: clinicName,
      address: addressDetail,
      clinic_type_id: clinicType.id != -1 ? clinicType.id : 0,
      country_id: addressCurrentChoose.country.id != -1 ? addressCurrentChoose.country.id : 0,
      state_id: addressCurrentChoose.province.id != -1 ? addressCurrentChoose.province.id : 0,
      city_id: addressCurrentChoose.district.id != -1 ? addressCurrentChoose.district.id : 0,
      ward_id: addressCurrentChoose.ward.id != -1 ? addressCurrentChoose.ward.id : 0,
    };
    //console.log('🚀 ~ file: ModalAddClinic.tsx:101 ~ handleSubmit ~ bodyData:', bodyData);
    setShowAlert(true);
    setIsLoadingAPI(true);
    setTimeout(() => {
      dispatch(createClinic(bodyData));
    }, 200);
  };

  const handleChangeClinicName = (value: string) => {
    setData({
      ...data,
      clinicName: value,
    });
  };

  const handleTouchAddress = () => {
    setShowAddress(true);
  };

  const handleChangeAddressDetail = (value: string) => {
    setData({
      ...data,
      addressDetail: value,
    });
  };

  const handleTouchType = () => {
    setShowClinicType(true);
  };

  const handleChooseClinicType = (clinicTypeChoose: any) => {
    setData({
      ...data,
      clinicType: clinicTypeChoose,
    });
    setShowClinicType(false);
  };

  const handleChooseAddress = (addressChoose: any) => {
    //parse Country/City/District/Ward
    let address = '';
    const { country, province, district, ward } = addressChoose;
    if (country.id !== -1) {
      address += country.name;
    }
    if (province.id !== -1) {
      address += '/' + province.name;
    }
    if (district.id !== -1) {
      address += '/' + district.name;
    }
    if (ward.id !== -1) {
      address += '/' + ward.name;
    }
    setData({
      ...data,
      address: address,
      addressCurrentChoose: addressChoose,
    });
    setShowAddress(false);
    setErrAddress('');
  };

  //RENDER
  const renderClinicName = () => {
    return (
      <CInput
        isRequire
        refChild={clinicNameEl}
        value={data.clinicName}
        onChange={handleChangeClinicName}
        errorText={errClinicName}
        label={t('onboarding.inputClinicName')}
        placeHolder={t('onboarding.inputClinicName')}
        returnKeyType={'next'}
        autoCapitalize={'words'}
        onSubmitEditing={Keyboard.dismiss}
        maxLength={100}
      />
    );
  };

  const renderAddress = () => {
    return (
      <CInputTouch
        refChild={addressEl}
        isRequire
        name={'address'}
        value={data.address}
        onTouch={handleTouchAddress}
        errorText={errAddress}
        label={t('onboarding.address')}
        placeHolder={t('onboarding.addressBoxPlacehoder')}
      />
    );
  };

  const renderAddressDetail = () => {
    return (
      <CInput
        isRequire
        refChild={addressDetailEl}
        value={data.addressDetail}
        onChange={handleChangeAddressDetail}
        errorText={errAddressDetail}
        label={t('onboarding.addressDetail')}
        placeHolder={t('onboarding.addressDetail')}
        returnKeyType={'next'}
        autoCapitalize={'words'}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  };

  const renderType = () => {
    return (
      <CInputTouch
        refChild={typeEl}
        isRequire
        name={'clinicType'}
        value={data.clinicType.name}
        onTouch={handleTouchType}
        errorText={errType}
        label={t('onboarding.clinicType')}
        placeHolder={t('onboarding.clinicType')}
      />
    );
  };

  const renderList = () => {
    return (
      <CScrollView contentContainerStyle={[screenStyles.pH24, screenStyles.pV12]}>
        {renderClinicName()}
        {renderAddress()}
        {renderAddressDetail()}
        {renderType()}
      </CScrollView>
    );
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={colors.c667085} size={24} />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('onboarding.addNewClinic')}
          </CText>
          <View style={{ width: 24 }} />
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        {renderList()}
        <View style={screenStyles.modalTopBtn}>
          <CButton
            title={t('common.add', 'Add')}
            btnWidth={'100%'}
            onPress={handleSubmit}
            isDisable={!activeBtn}
            isBottom
          />
        </View>
      </View>
    );
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={hideModal} style={screenStyles.containerModalTop}>
      {renderContent()}
      {showClinicType && (
        <ModalClinicType
          isVisible={showClinicType}
          hideModal={() => setShowClinicType(false)}
          chooseClinicType={handleChooseClinicType}
          clinicTypeChoose={data.clinicType}
        />
      )}
      {showAddress && (
        <ModalAddress
          isVisible={showAddress}
          hideModal={() => setShowAddress(false)}
          addressCurrentChoose={data.addressCurrentChoose}
          onChooseAddress={handleChooseAddress}
        />
      )}
      {showAlert ? <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} /> : null}
    </Modal>
  );
};
