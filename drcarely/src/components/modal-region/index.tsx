import { CSearchBar, ICON_TYPE, IconX } from '@/components';
import { changeAlias, keyExtractor, screenStyles } from '@/configs';
import { getRegions } from '@/redux/slices/globalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CEmptyData, CEmptySearch, CLoading, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

export const ModalRegion = ({ isVisible, hideModal, chooseRegion, regionChoose }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { loading, data, error } = useAppSelector(state => state.globalReducer.regionList);

  const [searchValue, setSearchValue] = useState<string>('');

  const [listRegion, setListRegion] = useState<any>([{
    id: -1,
    name: "Global",
  }]);

  const [itemChoose, setItemChoose] = useState<any>({});
  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    setItemChoose(regionChoose);
  }, [regionChoose]);

  useEffect(() => {
    if (isUndefined(data)) {
      dispatch(getRegions({ offset: 0, limit: 300 }));
    }
  }, []);

  useEffect(() => {
    const initData = () => {
      if (!loading) {
        if (data?.items) {
          setListRegion([...listRegion, ...data?.items || []]);
          setFirstRender(false);
        } else if (error) {
          setFirstRender(false);
        }
      }
    }
    initData();
  }, [loading, data, error]);

  //ACTION
  const onChangeTextSearch = (value: string) => {
    if (value !== '') {
      const newData = data?.items.filter(function (item: any) {
        const itemData = changeAlias(item.name);
        const textData = changeAlias(value);
        return itemData.indexOf(textData) > -1;
      });
      setListRegion(newData);
      setSearchValue(value);
    } else {
      setListRegion(data?.items || []);
      setSearchValue(value);
    }
  };

  const handleUpdateLanguage = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    chooseRegion(itemChoose);
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
        <Row start>
          <CText h5 color={colors.c1D2939}>
            {item.name}
          </CText>
        </Row>
        {itemChoose.name !== item.name ? (
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

  const renderListCountry = () => {
    return (
      <FlatList
        contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH24]}
        data={listRegion}
        extraData={listRegion}
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
    if (loading || firstRender) {
      return <CLoading />;
    }
    return renderListCountry();
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={colors.c667085} size={24} />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('home.region', "Region")}
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
          <CButton title={t('common.choose', 'Choose')} btnWidth={'100%'} onPress={handleSubmit} isBottom />
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
