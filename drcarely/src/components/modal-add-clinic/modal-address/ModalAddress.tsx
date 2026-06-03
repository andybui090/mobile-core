import { ICON_TYPE, IconX } from '@/components';
import { keyExtractor, screenStyles } from '@/configs';
import { getCountries, getDistricts, getProvinces, getWards } from '@/redux/slices/globalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CText, Container, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import Content from './Content';

enum addressType {
  Country = 'Country',
  Province = 'Province',
  District = 'Dictrict',
  Ward = 'Ward',
}

export const ModalAddress = ({ isVisible, hideModal, addressCurrentChoose, onChooseAddress }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const topScrollRef = useRef<any>(null);

  const dispatch = useAppDispatch();
  const { countryList, provinceList, districtList, wardList } = useAppSelector(state => state.globalReducer);

  const [listCountry, setListCountry] = useState<any[]>([]);
  const [searchCountry, setSearchCountry] = useState<string>('');

  const [listProvince, setListProvince] = useState<any[]>([]);
  const [searchProvince, setSearchProvince] = useState<string>('');

  const [listDistrict, setListDistrict] = useState<any[]>([]);
  const [searchDistrict, setSearchDistrict] = useState<string>('');

  const [listWard, setListWard] = useState<any[]>([]);
  const [searchWard, setSearchWard] = useState<string>('');

  const [fRCountry, setFRCountry] = useState<boolean>(false);
  const [fRProvince, setFRProvince] = useState<boolean>(false);
  const [fRDistrict, setFRDistrict] = useState<boolean>(false);
  const [fRWard, setFRWard] = useState<boolean>(false);

  const [data, setData] = useState({
    country: { id: -1, name: t('common.selectCountry') },
    province: { id: -1, name: t('common.selectCity') },
    district: { id: -1, name: t('common.selectDistrict') },
    ward: { id: -1, name: t('common.selectWard') },
  });

  const [arrTop, setArrTop] = useState<any>([{ id: -1, name: t('common.selectCountry') }]);

  const [tabIdx, setTabIdx] = useState<number>(0);

  const [validBtn, setValidBtn] = useState(false);

  //country
  useEffect(() => {
    const checkValidBtn = () => {
      let valid = true;
      if (data.country.id == -1) {
        valid = false;
      } else {
        if (listProvince.length > 0) {
          if (data.province.id == -1) {
            valid = false;
          } else {
            if (listDistrict.length > 0) {
              if (data.district.id == -1) {
                valid = false;
              } else {
                if (listWard.length > 0) {
                  if (data.ward.id == -1) {
                    valid = false;
                  }
                }
              }
            }
          }
        }
      }
      setValidBtn(valid);
    };
    checkValidBtn();
  }, [data, listCountry, listProvince, listDistrict, listWard]);

  useEffect(() => {
    dispatch(getCountries(null));
  }, []);

  useEffect(() => {
    const processAPICountry = () => {
      const { loading, data, error } = countryList;
      if (!loading) {
        if (data) {
          setListCountry(data.items || []);
          setFRCountry(false);
        } else if (error) {
          setFRCountry(false);
        }
      }
    };
    processAPICountry();
  }, [countryList]);

  //provinces
  useEffect(() => {
    const processAPIProvince = () => {
      const { loading, data, error } = provinceList;
      if (!loading) {
        if (data) {
          setListProvince(data.items || []);
          setFRProvince(false);
        } else if (error) {
          setFRProvince(false);
        }
      }
    };
    processAPIProvince();
  }, [provinceList]);

  //districts
  useEffect(() => {
    const processAPIDistrict = () => {
      const { loading, data, error } = districtList;
      if (!loading) {
        if (data) {
          setListDistrict(data.items || []);
          setFRDistrict(false);
        } else if (error) {
          setFRDistrict(false);
        }
      }
    };
    processAPIDistrict();
  }, [districtList]);

  //wards
  useEffect(() => {
    const processAPIAward = () => {
      const { loading, data, error } = wardList;
      if (!loading) {
        if (data) {
          setListWard(data.items || []);
          setFRWard(false);
        } else if (error) {
          setFRWard(false);
        }
      }
    };
    processAPIAward();
  }, [wardList]);

  //ACTION
  const handleChooseItem = (name: addressType, item: any) => {
    switch (name) {
      case addressType.Country:
        if (data.country.id !== item.id) {
          setData({
            ...data,
            country: item,
          });
          let newArr = [];
          newArr.push(item);
          newArr.push({ id: -1, name: t('common.selectCity') });
          setArrTop(newArr);
          setTabIdx(1);
          setSearchProvince('');
          setSearchDistrict('');
          setSearchWard('');
          setListProvince([]);
          setListDistrict([]);
          setListWard([]);
          dispatch(getProvinces({ fq: 'country_id:' + item.id }));
        }
        break;
      case addressType.Province:
        if (data.province.id !== item.id) {
          setData({
            ...data,
            province: item,
            district: { id: -1, name: t('common.selectDistrict') },
            ward: { id: -1, name: t('common.selectWard') },
          });
          let newArr = [arrTop[0]];
          newArr.push(item);
          newArr.push({ id: -1, name: t('common.selectDistrict') });
          setArrTop(newArr);
          setTabIdx(2);
          setSearchDistrict('');
          setSearchWard('');
          setListDistrict([]);
          setListWard([]);
          dispatch(getDistricts({ fq: 'state_id:' + item.id }));
        }
        break;
      case addressType.District:
        if (data.district.id !== item.id) {
          setData({
            ...data,
            district: item,
            ward: { id: -1, name: t('common.selectWard') },
          });
          let newArr = [arrTop[0], arrTop[1]];
          newArr.push(item);
          newArr.push({ id: -1, name: t('common.selectWard') });
          setArrTop(newArr);
          setTabIdx(3);
          setSearchWard('');
          setListWard([]);
          dispatch(getWards({ fq: 'district_id:' + item.id }));
        }
        break;
      case addressType.Ward:
        setData({
          ...data,
          ward: item,
        });
        break;
      default:
        break;
    }
    setTimeout(() => {
      topScrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handlePressItemTop = (idx: number) => {
    if (idx !== tabIdx) {
      setTabIdx(idx);
    }
  };

  const handleSubmit = () => {
    onChooseAddress(data);
  };

  //RENDER
  const renderList = () => {
    switch (tabIdx) {
      case 0:
        return (
          <Content
            name={addressType.Country}
            firstRender={fRCountry}
            data={listCountry}
            setListData={setListCountry}
            defaultData={countryList.data?.items || []}
            itemChoose={data.country}
            onChooseItem={handleChooseItem}
            searchValue={searchCountry}
            setSearchValue={setSearchCountry}
            loading={countryList.loading}
          />
        );
      case 1:
        return (
          <Content
            name={addressType.Province}
            firstRender={fRProvince}
            data={listProvince}
            setListData={setListProvince}
            defaultData={provinceList.data?.items || []}
            itemChoose={data.province}
            onChooseItem={handleChooseItem}
            searchValue={searchProvince}
            setSearchValue={setSearchProvince}
            loading={provinceList.loading}
          />
        );
      case 2:
        return (
          <Content
            name={addressType.District}
            firstRender={fRDistrict}
            data={listDistrict}
            setListData={setListDistrict}
            defaultData={districtList.data?.items || []}
            itemChoose={data.district}
            onChooseItem={handleChooseItem}
            searchValue={searchDistrict}
            setSearchValue={setSearchDistrict}
            loading={districtList.loading}
          />
        );
      case 3:
        return (
          <Content
            name={addressType.Ward}
            firstRender={fRWard}
            data={listWard}
            setListData={setListWard}
            defaultData={wardList.data?.items || []}
            itemChoose={data.ward}
            onChooseItem={handleChooseItem}
            searchValue={searchWard}
            setSearchValue={setSearchWard}
            loading={wardList.loading}
          />
        );
      default:
        break;
    }
  };

  const renderItemTop = ({ item, index }: any) => {
    return (
      <View
        style={{
          paddingLeft: index == 0 ? 14 : 0,
          paddingRight: index == arrTop.length - 1 ? 14 : 0,
          height: '100%',
        }}>
        <Pressable
          onPress={() => handlePressItemTop(index)}
          style={{
            borderBottomWidth: index == tabIdx ? 2 : 0,
            borderBottomColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 7,
          }}>
          <CText h5 color={index != tabIdx ? colors.c667085 : colors.primary}>
            {item.name}
          </CText>
        </Pressable>
      </View>
    );
  };

  const renderTopChoose = () => {
    return (
      <Row
        start
        style={{
          borderBottomWidth: 1,
          borderColor: colors.cEAECF0,
        }}>
        <FlatList
          ref={topScrollRef}
          contentContainerStyle={[screenStyles.flexGrow1]}
          data={arrTop}
          extraData={arrTop}
          keyExtractor={keyExtractor}
          renderItem={renderItemTop}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={160}
          keyboardDismissMode="on-drag"
          scrollsToTop={false}
        />
      </Row>
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
            {t('onboarding.address')}
          </CText>
          <View style={{ width: 24 }} />
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        {renderTopChoose()}
        <Container>{renderList()}</Container>
        <View style={screenStyles.modalTopBtn}>
          <CButton
            title={t('common.choose', 'Choose')}
            btnWidth={'100%'}
            onPress={handleSubmit}
            isBottom
            isDisable={!validBtn || countryList.loading || provinceList.loading || districtList.loading || wardList.loading}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={hideModal} style={screenStyles.containerModalTop}>
      {renderContent()}
    </Modal>
  );
};
