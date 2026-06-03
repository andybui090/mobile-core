import { CSearchBar, ICON_TYPE, IconX } from '@/components';
import { changeAlias, keyExtractor, screenStyles } from '@/configs';
import { CEmptyData, CEmptySearch, CLoading, CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View } from 'react-native';

const Content = ({name, firstRender, data, setListData, defaultData, itemChoose, onChooseItem, searchValue, setSearchValue, loading}: any) => {
  const {t} = useTranslation();
  const {
    theme: {colors},
  } = useTheme();

  const onChangeTextSearch = (value: string) => {
    if (value !== '') {
      const newData = defaultData.filter(function (item: any) {
        const itemData = changeAlias(item.name);
        const textData = changeAlias(value);
        return itemData.indexOf(textData) > -1;
      });
      
      setListData(newData);
      setSearchValue(value);
    } else {
      setListData(defaultData);
      setSearchValue(value);
    }
  };

  const handleChooseItem = (item: any) => {
    onChooseItem(name, item);
  };

  const renderItemData = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleChooseItem(item);
        }}
        style={[
          screenStyles.rowBettween,
          screenStyles.pV12,
          screenStyles.pR10,
          screenStyles.bottomLine,
          index == 0 && {paddingTop: 0},
        ]}>
        <Row start style={screenStyles.flex1}>
          <CText h5 color={colors.c101828} style={screenStyles.mL10}>
            {item.name}
          </CText>
        </Row>
        {itemChoose.id !== item.id ? (
          <IconX name="circle" size={20} origin={ICON_TYPE.ENTYPO} color={colors.grey3} />
        ) : (
          <IconX name="radio-btn-active" size={20} origin={ICON_TYPE.FONTISTO} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  const renderSearchBar = () => {
    return (
      <View style={[screenStyles.pV14, {paddingHorizontal: 24}]}>
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
    );
  };

  const renderListData = () => {
    return (
      <>
        {renderSearchBar()}
        <FlatList
          contentContainerStyle={[screenStyles.flexGrow1, {paddingHorizontal: 24}]}
          data={data}
          extraData={data}
          keyExtractor={keyExtractor}
          renderItem={renderItemData}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={160}
          keyboardDismissMode="on-drag"
          ListEmptyComponent={searchValue != '' ?  <CEmptySearch /> : <CEmptyData />}
          scrollsToTop={false}
        />
      </>
    );
  };

  if (firstRender || loading) {
    return <CLoading />;
  } else {
    return renderListData();
  }
};

export default Content;
