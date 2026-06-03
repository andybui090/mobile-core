import { CSearchBar, ICON_TYPE, IconX } from '@/components';
import { changeAlias, images, keyExtractor, screenStyles } from '@/configs';
import { getClinics, resetOnboardUnused } from '@/redux/slices/onboardSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CLoading, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, RefreshControl, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { ModalAddClinic } from './ModalAddClinic';

export const ModalClinics = ({ isVisible, hideModal, chooseClinic, clinicChoose }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const scrollRef = useRef<any>(null);

  const dispatch = useAppDispatch();
  const { clinicList } = useAppSelector(state => state.onboardReducer);

  const [searchValue, setSearchValue] = useState<string>('');

  const [listClinic, setListClinic] = useState<any>([]);
  const [defaultData, setDefaultData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [itemChoose, setItemChoose] = useState<any>({ id: -1 });
  const [firstRender, setFirstRender] = useState<boolean>(false);

  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);

  const [isHasAddNew, setIsHasAddNew] = useState(false);

  const [activeBtn, setActiveBtn] = useState(false);

  useEffect(() => {
    const checkActiveBtn = () => {
      let valid = true;
      if (itemChoose.id == -1) {
        valid = false;
      }
      setActiveBtn(valid);
    };
    checkActiveBtn();
  }, [itemChoose]);

  useEffect(() => {
    setItemChoose(clinicChoose);
  }, [clinicChoose]);

  useEffect(() => {
    // dispatch(getClinics({ limit: 1000, fqin: 'status:0,1', fq: 'is_deleted:0', raw:true }));
    dispatch(getClinics({ limit: 1000, raw: true }));
  }, []);

  useEffect(() => {
    const processAPIGetClinic = () => {
      const { loading, data, error } = clinicList;
      if (!loading) {
        if (data && data.items) {
          setListClinic(data.items || []);
          setDefaultData(data.items || []);
          setFirstRender(false);
          if (isHasAddNew) {
            setIsHasAddNew(false);
            setItemChoose(data.items[0]);
            scrollRef.current?.scrollToOffset({ animated: true, offset: 0 });
          }
          resetOnboardUnused(null);
          setRefreshing(false);
        } else if (error) {
          setFirstRender(false);
          resetOnboardUnused(null);
          setRefreshing(false);
        }
      }
    };
    processAPIGetClinic();
  }, [clinicList]);

  //ACTION
  const onChangeTextSearch = (value: string) => {
    if (value !== '') {
      const newData = defaultData.filter(function (item: any) {
        const itemData = changeAlias(item.name);
        const textData = changeAlias(value);
        return itemData.indexOf(textData) > -1;
      });
      setListClinic(newData);
      setSearchValue(value);
    } else {
      setListClinic(defaultData);
      setSearchValue(value);
    }
  };

  const handleUpdateLanguage = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    chooseClinic(itemChoose);
  };

  const handleAddNewClinic = () => {
    setShowModalAdd(true);
  };

  const handleUpdateClinics = () => {
    setTimeout(() => {
      setIsHasAddNew(true);
      // dispatch(getClinics({ limit: 1000, fqin: 'status:0,1', fq: 'is_deleted:0', raw:true }));
      dispatch(getClinics({ limit: 1000, raw: true }));
    }, 500);
  };

  const onRefresh = React.useCallback(() => {
    // setOffset(0);
    setRefreshing(true);
    // dispatch(getClinics({ limit: 1000, fqin: 'status:0,1', fq: 'is_deleted:0', raw:true }));
    dispatch(getClinics({ limit: 1000, raw: true }));
  }, [refreshing]);

  //RENDER
  const renderItemList = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleUpdateLanguage(item);
        }}
        style={[
          screenStyles.rowBettween,
          screenStyles.pV12,
          screenStyles.bottomLine,
          index == 0 && { paddingTop: 0 },
          {
            borderRadius: 8,
          },
        ]}>
        <Row start style={[screenStyles.flex1, screenStyles.pR10]}>
          <View
            style={[
              screenStyles.box24,
              screenStyles.overflowHidden,
              screenStyles.centerWrap,
              { borderRadius: 12, backgroundColor: colors.primary, marginLeft: 1 },
            ]}>
            <Image source={images.global.ico_location_hospital} style={screenStyles.box14} resizeMode="contain" />
          </View>
          <View style={screenStyles.flex1}>
            <CText h5 color={colors.c101828} style={screenStyles.mL10}>
              {item.name}
            </CText>
            <CText numberOfLines={1} h6 color={colors.c98A2B3} style={[screenStyles.mL10, screenStyles.mT3]}>
              {item.full_address}
            </CText>
          </View>
        </Row>
        {itemChoose.id !== item.id ? (
          <IconX name="circle" size={20} origin={ICON_TYPE.ENTYPO} color={colors.c98A2B3} />
        ) : (
          <IconX name="radio-btn-active" size={20} origin={ICON_TYPE.FONTISTO} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  const renderListClinic = () => {
    return (
      <FlatList
        ref={scrollRef}
        contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH24]}
        data={listClinic}
        extraData={listClinic}
        keyExtractor={keyExtractor}
        renderItem={renderItemList}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={160}
        keyboardDismissMode="on-drag"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        scrollsToTop={false}
      />
    );
  };

  const renderList = () => {
    if (firstRender) {
      return <CLoading />;
    } else {
      return renderListClinic();
    }
  };

  const renderDescription = () => {
    return (
      <View
        style={{
          paddingBottom: 14,
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            padding: 14,
            backgroundColor: colors.cF9FAFB,
            borderRadius: 8,
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: colors.cEAECF0,
          }}>
          <CText h5 color={colors.c33353A}>
            {t(
              'onboarding.clinicDescription',
              'If you can not find a Hospital/Medical Facility, please create new information by clicking the button below',
            )}
          </CText>
          <Pressable
            hitSlop={screenStyles.hitSlop20}
            style={{ marginTop: 8, ...screenStyles.rowStart }}
            onPress={handleAddNewClinic}>
            <IconX origin={ICON_TYPE.ICONICONS} name="add" color={colors.primary} size={20} />
            <CText numberOfLines={1} w500 color={colors.primary}>
              {t('onboarding.addNewClinic')}
            </CText>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={[screenStyles.wrapModalTop]}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={colors.c667085} size={24} />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('onboarding.hospital')}
          </CText>
          <CText />
          {/* <Pressable onPress={handleAddNewClinic} hitSlop={screenStyles.hitSlop20}>
            <IconX name={'add-circle-outline'} origin={ICON_TYPE.ICONICONS} color={colors.primary} size={24} />
          </Pressable> */}
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        <View style={screenStyles.modalTopSearchBar}>
          <CSearchBar
            value={searchValue}
            placeholder={t('search.searchPlaceholder', 'Search...')}
            onChangeText={onChangeTextSearch}
            onClear={() => {
              setSearchValue('');
            }}
            returnKeyType="search"
          />
        </View>
        {renderDescription()}
        {renderList()}
        <View style={screenStyles.modalTopBtn}>
          <CButton
            title={t('common.choose', 'Choose')}
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
      {showModalAdd && (
        <ModalAddClinic
          isVisible={showModalAdd}
          hideModal={() => setShowModalAdd(false)}
          updateListClinic={handleUpdateClinics}
          searchValue={searchValue}
        />
      )}
    </Modal>
  );
};
