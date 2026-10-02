import { CSearchBar, IconType, IconX } from '@/components';
import { changeAlias, keyExtractor, screenStyles } from '@/configs';
import { getCountries } from '@/redux/slices/globalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import {
  CButton,
  CEmptyData,
  CEmptySearch,
  CLoading,
  CText,
  Row,
} from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { isArray, isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export const ModalCountry = ({
  isVisible,
  hideModal,
  chooseCountry,
  countryChoose,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { loading, data, error } = useAppSelector(
    state => state.globalReducer.countryList,
  );

  const [searchValue, setSearchValue] = useState<string>('');

  const [listCountry, setListCountry] = useState<any>([]);

  const [itemChoose, setItemChoose] = useState<any>({});
  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    setItemChoose(countryChoose);
  }, [countryChoose]);

  useEffect(() => {
    if (isUndefined(data)) {
      dispatch(getCountries(null));
    }
  }, []);

  useEffect(() => {
    if (isArray(data?.items)) {
      setListCountry(data?.items || []);
      setFirstRender(false);
    } else if (error) {
      setFirstRender(false);
    }
  }, [data, error]);

  //ACTION
  const onChangeTextSearch = (value: string) => {
    if (value !== '') {
      const newData = data?.items.filter(function (item: any) {
        const itemData = changeAlias(item.name);
        const textData = changeAlias(value);
        return itemData.indexOf(textData) > -1;
      });
      setListCountry(newData);
      setSearchValue(value);
    } else {
      setListCountry(data?.items || []);
      setSearchValue(value);
    }
  };

  const handleUpdateLanguage = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    chooseCountry(itemChoose);
  };

  //RENDER
  const renderItemList = ({ item, index }: any) => {
    const paddingCommon =
      index !== 0 ? screenStyles.pV13 : screenStyles.pFirstRow;
    return (
      <TouchableOpacity
        onPress={() => {
          handleUpdateLanguage(item);
        }}
        style={[
          screenStyles.rowBettween,
          paddingCommon,
          screenStyles.pR8,
          screenStyles.bottomLine,
        ]}
      >
        <Row start>
          <CText h5 color={colors.c1D2939}>
            {item.name}
          </CText>
        </Row>
        {itemChoose.name !== item.name ? (
          <IconX
            name="circle"
            size={20}
            type={IconType.ENTYPO}
            color={colors.c98A2B3}
          />
        ) : (
          <IconX
            name="radio-btn-active"
            size={20}
            type={IconType.FONTISTO}
            color={colors.primary}
          />
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
        data={listCountry}
        extraData={listCountry}
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
            {t('common.selectCountry')}
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
        <View style={screenStyles.pH24}>
          <CButton
            title={t('common.choose', 'Choose')}
            btnWidth={'100%'}
            onPress={handleSubmit}
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  contentContainer: {
    width: '100%',
    height: '87%',
  },
});
