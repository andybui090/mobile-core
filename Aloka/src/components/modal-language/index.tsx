import { CSearchBar, IconX, ImageHelper } from '@/components';
import { changeAlias, keyExtractor, screenStyles } from '@/configs';
import { getLanguages } from '@/redux/slices/globalSlice';
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
  View,
} from 'react-native';

export const ModalLanguage = ({
  isVisible,
  hideModal,
  chooseLanguage,
  languageChoose,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { loading, data, error } = useAppSelector(
    state => state.globalReducer.languageList,
  );

  const [searchValue, setSearchValue] = useState<string>('');
  const [listLanguage, setListLanguage] = useState<any[]>([]);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [itemChoose, setItemChoose] = useState<any>({});

  useEffect(() => {
    setItemChoose(languageChoose || {});
  }, [languageChoose]);

  useEffect(() => {
    if (isUndefined(data)) {
      dispatch(
        getLanguages({
          fq: 'status:1',
        }),
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isArray(data?.items)) {
      setListLanguage(data.items || []);
      setFirstRender(false);
    } else if (error) {
      setFirstRender(false);
      console.log('🚀 ~ file: errLanguages: ', error);
    }
  }, [data, error]);

  // ACTION

  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);

    if (value !== '') {
      const textData = changeAlias(value);

      const newData = data?.items?.filter((item: any) => {
        const itemData = changeAlias(item.locale);

        return itemData.indexOf(textData) > -1;
      });

      setListLanguage(newData || []);
    } else {
      setListLanguage(data?.items || []);
    }
  };

  const handleUpdateLanguage = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    chooseLanguage(itemChoose);
  };

  // RENDER

  const renderItemList = ({ item, index }: any) => {
    const paddingCommon =
      index !== 0 ? screenStyles.pV13 : screenStyles.pFirstRow;

    const isSelected = itemChoose?.locale === item.locale;

    return (
      <Pressable
        onPress={() => handleUpdateLanguage(item)}
        style={[
          screenStyles.rowBettween,
          paddingCommon,
          screenStyles.pH8,
          screenStyles.bottomLine,
        ]}
      >
        <Row start>
          <View style={screenStyles.box24}>
            <ImageHelper source={{ uri: item.flag }} resizeMode="contain" />
          </View>

          <CText h5 color={colors.c1D2939} style={screenStyles.mL15}>
            {item.locale}
          </CText>
        </Row>
        <IconX
          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
          size={20}
          type="ionicons"
          color={isSelected ? colors.primary : colors.c98A2B3}
        />
      </Pressable>
    );
  };

  const renderListEmpty = () => {
    if (searchValue !== '') {
      return <CEmptySearch />;
    }
    return <CEmptyData />;
  };

  const renderListLanguage = () => {
    return (
      <FlatList
        contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH24]}
        data={listLanguage}
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

    return renderListLanguage();
  };

  const renderContent = () => {
    return (
      <View style={[screenStyles.wrapModalTop]}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX
              name="close"
              type="antdesign"
              color={colors.c667085}
              size={22}
            />
          </Pressable>

          <CText h4 w600 color={colors.c101828}>
            {t('settings.language')}
          </CText>

          <View style={{ width: 22 }} />
        </Row>

        <Divider color={colors.cD0D5DD} width={1} />

        <View style={screenStyles.modalTopSearchBar}>
          <CSearchBar
            value={searchValue}
            placeholder={t('search.searchPlaceholder', 'Search...')}
            onChangeText={onChangeTextSearch}
            onClear={() => {
              setSearchValue('');
              setListLanguage(data?.items || []);
            }}
            returnKeyType="search"
          />
        </View>

        {renderList()}

        <View style={screenStyles.pH24}>
          <CButton
            title={t('common.choose', 'Choose')}
            btnWidth="100%"
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
