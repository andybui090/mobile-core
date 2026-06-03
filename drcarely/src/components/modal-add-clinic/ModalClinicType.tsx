import { CSearchBar, ICON_TYPE, IconX, ImageHelper } from '@/components';
import { changeAlias, keyExtractor, screenStyles } from '@/configs';
import { getClinicTypes } from '@/redux/slices/onboardSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CEmptyData, CEmptySearch, CLoading, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { isArray, isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

export const ModalClinicType = ({ isVisible, hideModal, chooseClinicType, clinicTypeChoose }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { clinicTypesList } = useAppSelector(state => state.onboardReducer);

  const [searchValue, setSearchValue] = useState<string>('');

  const [listClinic, setListClinic] = useState<any>([]);

  const [itemChoose, setItemChoose] = useState<any>({});
  const [firstRender, setFirstRender] = useState<boolean>(false);

  useEffect(() => {
    setItemChoose(clinicTypeChoose);
  }, [clinicTypeChoose]);

  useEffect(() => {
    if (isUndefined(clinicTypesList.data)) {
      dispatch(getClinicTypes(null));
    }
  }, []);

  useEffect(() => {
    if (isArray(clinicTypesList.data?.items)) {
      setListClinic(clinicTypesList.data.items || []);
      setFirstRender(false);
    } else if (clinicTypesList.error) {
      setFirstRender(false);
    }
  }, [clinicTypesList]);

  //ACTION
  const onChangeTextSearch = (value: string) => {
    if (value !== '') {
      const newData = clinicTypesList.data?.items.filter(function (item: any) {
        const itemData = changeAlias(item.name);
        const textData = changeAlias(value);
        return itemData.indexOf(textData) > -1;
      });
      setListClinic(newData);
      setSearchValue(value);
    } else {
      setListClinic( clinicTypesList.data?.items || []);
      setSearchValue(value);
    }
  };

  const handleSearch = (value: string) => {};

  const handleUpdateLanguage = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    chooseClinicType(itemChoose);
  };

  //RENDER
  const renderItemList = ({ item, index }: any) => {
    const paddingCommon = index !== 0 ? screenStyles.pV13 : screenStyles.pFirstRow;
    return (
      <TouchableOpacity
        onPress={() => {
          handleUpdateLanguage(item);
        }}
        style={[screenStyles.rowBettween, paddingCommon, screenStyles.pR8, screenStyles.bottomLine]}>
        <Row start style={screenStyles.flex1}>
          <View
            style={[
              screenStyles.box24,
              screenStyles.overflowHidden,
              screenStyles.centerWrap,
              { borderRadius: 12, backgroundColor: colors.primary },
            ]}>
            <ImageHelper source={{ uri: item.icon }} />
          </View>
          <CText h5 color={colors.c101828} style={screenStyles.mL10}>
            {item.name}
          </CText>
        </Row>
        {itemChoose.id !== item.id ? (
          <IconX name="circle" size={20} origin={ICON_TYPE.ENTYPO} color={colors.c98A2B3} />
        ) : (
          <IconX name="radio-btn-active" size={20} origin={ICON_TYPE.FONTISTO} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  const renderListEmpty = () => {
    if (searchValue != '') {
      <CEmptySearch />;
    }
    return <CEmptyData />;
  };

  const renderListClinic = () => {
    return (
      <FlatList
        contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH24]}
        data={listClinic}
        extraData={listClinic}
        keyExtractor={keyExtractor}
        renderItem={renderItemList}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={160}
        keyboardDismissMode="on-drag"
        ListEmptyComponent={renderListEmpty}
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

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={colors.c667085} size={24} />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('onboarding.hospital')}
          </CText>
          <View style={{ width: 24 }} />
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
        {renderList()}
        <View style={screenStyles.modalTopBtn}>
          <CButton title={t('common.choose', 'Choose')} btnWidth={'100%'} onPress={handleSubmit} isBottom/>
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
