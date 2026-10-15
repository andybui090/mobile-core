import { CHeader, CSearchBar, Wrapper } from '@/components';
import {
  changeAlias,
  isIOS,
  keyExtractor,
  replaceOverSpace,
  screenStyles,
} from '@/configs';
import { STORAGEKEY } from '@/constants';
import { getCategories } from '@/redux/slices/globalSlice';
import { getSettingsOnboarding } from '@/redux/slices/settingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { storeObjectData, storeStringData } from '@/storages';
import { spacings } from '@/theme';
import { CButton, CEmptyData, CEmptySearch, CLoading, CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, UIManager, View } from 'react-native';
// import Modal from 'react-native-modal';
import Item from './Item';

const useStyles = makeStyles(({ colors }) => ({
  mainContainer: {
    margin: 0,
  },
  wrapSearch: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  wrapper: {
    marginTop: 15,
    flex: 1,
  },
}));

// const MIN_ITEM = 6;

export function ModalCategory({
  isVisible,
  hideModal,
  listCategoryChoose,
  updateListCategories,
}: any) {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const styles = useStyles();

  //State & Props
  const dispatch = useAppDispatch();
  const { categoryList } = useAppSelector(state => state.globalReducer);
  const [listCategory, setListCategory] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [listItemChoose, setListItemChoose] = useState<any>([]);
  const [isActiveAction, setIsActiveAction] = useState(false);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  const [showData, setShowData] = useState(false);

  const { settingOnboarding } = useAppSelector(state => state.settingReducer);
  const [minSelect, setMinSelect] = useState<number>(0);
  //EFFECT
  useEffect(() => {
    dispatch(getSettingsOnboarding({ fq: 'type:onboard' }));
  }, []);

  useEffect(() => {
    const processSettingsOnboardingAPI = () => {
      const { loading, data, error } = settingOnboarding;
      // console.log("🚀 ~ useEffect ~ data: settingOnboarding", data)
      if (!loading) {
        if (data) {
          if (data?.items) {
            for (let i = 0; i < data.items.length; i++) {
              if (data.items[i].code === 'required_interest') {
                // setIsRequired(data.items[i].value);
                setMinSelect(data.items[i].value ? data.items[i].value : 0);
                break;
              }
            }
          }
        } else if (error) {
        }
      }
    };
    processSettingsOnboardingAPI();
  }, [settingOnboarding]);

  useEffect(() => {
    if (listCategoryChoose.length > 0) {
      let arr: any = [];
      for (let i = 0; i < listCategoryChoose.length; i++) {
        if (listCategoryChoose[i].id != -1) {
          arr.push(listCategoryChoose[i]);
        }
      }
      setListItemChoose(arr);
    }
  }, [listCategoryChoose]);

  useEffect(() => {
    setIsActiveAction(listItemChoose.length >= minSelect);
    setTimeout(() => {
      setShowData(true);
    }, 300);
  }, [listItemChoose, minSelect]);

  useEffect(() => {
    if (isIOS) {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
    dispatch(getCategories(null));
  }, []);

  useEffect(() => {
    if (categoryList.data) {
      setFirstRender(false);
      setListCategory(categoryList.data?.items || []);
    } else if (categoryList.error) {
      setFirstRender(false);
    }
  }, [categoryList.data, categoryList.error]);

  //ACTION
  const onChangeTextSearch = (value: string) => {
    let removeSpace = replaceOverSpace(value);
    if (removeSpace !== '') {
      const textData = changeAlias(removeSpace);
      let arr = [];
      let defaultData = categoryList.data?.items || [];
      for (let i = 0; i < defaultData.length; i++) {
        const itemData = defaultData[i].children;
        let obj = { ...defaultData[i] };
        let arrChild = [];
        let found = false;
        for (let j = 0; j < itemData.length; j++) {
          const itemChild = changeAlias(itemData[j].name);
          if (itemChild.indexOf(textData) > -1) {
            arrChild.push(itemData[j]);
            found = true;
          }
        }
        if (found) {
          obj.children = arrChild;
          arr.push(obj);
        }
      }
      setListCategory(arr);
      setSearchValue(removeSpace);
    } else {
      setListCategory(categoryList.data?.items || []);
      setSearchValue(removeSpace);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setListCategory(categoryList.data?.items || []);
  };

  const storeLocalInterest = async () => {
    // console.log('========== ', listItemChoose);
    let str = '';
    //sap xep theo thu tu alpha B
    let arrSortAZ = [];
    arrSortAZ = listItemChoose.sort(function (a: any, b: any) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    for (let i = 0; i < arrSortAZ.length; i++) {
      if (i == 0) {
        str = arrSortAZ[i].id.toString();
      } else {
        str = str + ',' + arrSortAZ[i].id;
      }
    }
    storeStringData(STORAGEKEY.CATEGORIES, str);
    let obj: any = {
      categoryStore: arrSortAZ,
    };

    storeObjectData(STORAGEKEY.CATEGORIES_CHOOSE, obj);

    updateListCategories(arrSortAZ, str);
  };

  const handleDiscovery = async () => {
    storeLocalInterest();
  };

  const handleChooseItem = (item: any) => {
    let arr = [...listItemChoose];
    let found = false;
    for (let i = 0; i < listItemChoose.length; i++) {
      if (item.id === listItemChoose[i].id) {
        arr.splice(i, 1);
        found = true;
        break;
      }
    }
    if (!found) {
      arr.push(item);
    }
    setListItemChoose(arr);
  };

  //RENDER
  const renderListEmpty = () => {
    if (searchValue != '') {
      <CEmptySearch />;
    }
    return <CEmptyData />;
  };

  const renderItemList = ({ item }: any) => {
    return (
      <Item
        item={item}
        onPressItem={handleChooseItem}
        listItemChoose={listItemChoose}
      />
    );
  };

  const renderListCategory = () => {
    return (
      <FlatList
        contentContainerStyle={screenStyles.flexGrow1}
        data={listCategory}
        extraData={listCategory}
        keyExtractor={keyExtractor}
        renderItem={renderItemList}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={160}
        ListEmptyComponent={renderListEmpty}
        keyboardDismissMode="on-drag"
        scrollsToTop={false}
      />
    );
  };

  const renderData = () => {
    if (categoryList.loading || firstRender || !showData) {
      return (
        <View style={styles.wrapper}>
          <CLoading />
        </View>
      );
    }
    return renderListCategory();
  };

  const renderContent = () => {
    return (
      <>
        {renderData()}
        <CButton
          isBottom
          title={t('common.save', 'Save')}
          isDisable={!isActiveAction}
          onPress={handleDiscovery}
        />
      </>
    );
  };

  return (
    // <Modal isVisible={isVisible} onBackdropPress={hideModal} style={styles.mainContainer}>
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={hideModal}
    >
      <Wrapper>
        <CHeader
          btnClose
          rightComponentDisable
          title={t(
            'onboarding.SelectCategoriesOfInterest',
            'Select categories of interest', 
          )}
          leftComponentOnPress={hideModal}
        />
        <View
          style={{
            paddingHorizontal: spacings.xl,
            opacity: 1,
          }}
        >
          <CText h5 w400 color={colors.c667085} style={screenStyles.mT5}>
            {`${t(
              'common.selectContent',
              'Please select content to receive relevant recommendations',
            )}`}
          </CText>
        </View>
        <View style={styles.wrapSearch}>
          <CSearchBar
            value={searchValue}
            placeholder={t('search.searchPlaceholder', 'Search...')}
            onChangeText={onChangeTextSearch}
            onClear={handleClearSearch}
            returnKeyType="search"
          />
        </View>
        {renderContent()}
      </Wrapper>
    </Modal>
  );
}
