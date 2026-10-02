import { CSearchBar } from '@/components';
import { changeAlias, keyExtractor, replaceOverSpace, screenStyles } from '@/configs';
import { getSpecializations } from '@/redux/slices/onboardSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CEmptyData, CEmptySearch, CLoading, Container } from '@/utils';
import { isArray } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import ItemSpecializations from './ItemSpecializations';

export const Specializations = ({ dataNurseInfo, updateNurseInfo }: any) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { specializationsList } = useAppSelector(state => state.onboardReducer);

  const [listSpecializations, setListSpecializations] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    dispatch(getSpecializations(null));
  }, []);

  useEffect(() => {
    const processAPISpecializations = () => {
      if (isArray(specializationsList.data?.items)) {
        setListSpecializations(specializationsList.data.items || []);
        setFirstRender(false);
      } else if (specializationsList.error) {
        setFirstRender(false);
      }
    };
    processAPISpecializations();
  }, [specializationsList]);

  //Action
  const handleChooseItem = (item: any) => {
    let arr = [...dataNurseInfo.specializationArr];
    let found = false;
    for (let i = 0; i < dataNurseInfo.specializationArr.length; i++) {
      if (item.id === dataNurseInfo.specializationArr[i].id) {
        arr.splice(i, 1);
        found = true;
        break;
      }
    }
    if (!found) {
      arr.push(item);
    }
    updateNurseInfo('specializationArr', arr);
  };

  const onChangeTextSearch = (value: string) => {
    let removeSpace = replaceOverSpace(value);
    if (removeSpace !== '') {
      const textData = changeAlias(removeSpace);
      let arr = [];
      let listSpec:any = specializationsList.data?.items || []
      for (let i = 0; i < listSpec.length; i++) {
        const itemDataName = changeAlias(specializationsList.data?.items[i]?.name);
        if (itemDataName.indexOf(textData) > -1) {
          arr.push(specializationsList.data?.items[i]);
        }
      }
      setListSpecializations(arr);
      setSearchValue(removeSpace);
    } else {
      setListSpecializations(specializationsList.data?.items || []);
      setSearchValue(removeSpace);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setListSpecializations(specializationsList.data?.items || []);
  };

  //Render
  const renderItemList = ({ item, index }: any) => {
    return (
      <ItemSpecializations
        item={item}
        index={index}
        onPressItem={handleChooseItem}
        listItemChoose={dataNurseInfo.specializationArr || []}
      />
    );
  };

  const renderListEmpty = () => {
    if (searchValue != '') {
      <CEmptySearch />;
    }
    return <CEmptyData />;
  };

  const renderListSpecializations = () => {
    return (
      <FlatList
        contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH12]}
        numColumns={2}
        data={listSpecializations}
        extraData={listSpecializations}
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
    }
    return renderListSpecializations();
  };

  return (
    <Container>
      <View style={screenStyles.modalTopSearchBar}>
        <CSearchBar
          value={searchValue}
          placeholder={t('search.searchPlaceholder', 'Search...')}
          onChangeText={onChangeTextSearch}
          onClear={handleClearSearch}
          returnKeyType="search"
        />
      </View>
      {renderList()}
    </Container>
  );
};
