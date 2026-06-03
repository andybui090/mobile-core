import { CSearchBar, ICON_TYPE, IconX } from '@/components';
import { changeAlias, keyExtractor, screenStyles } from '@/configs';
import { CButton, CEmptyData, CEmptySearch, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

export const ModalGender = ({ isVisible, hideModal, chooseGender, genderChoose }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState<string>('');

  const [itemChoose, setItemChoose] = useState<any>({});

  const [listGender, setListGender] = useState<any>([
    { value: 'Male', name: t('gender.male'), label: t('gender.male') },
    { value: 'Female', name: t('gender.female'), label: t('gender.female') },
    { value: 'Undisclosed', name: t('gender.undisclosed'), label: t('gender.undisclosed') },
  ]);
  const [defaultData] = useState<any>([
    { value: 'Male', name: t('gender.male'), label: t('gender.male') },
    { value: 'Female', name: t('gender.female'), label: t('gender.female') },
    { value: 'Undisclosed', name: t('gender.undisclosed'), label: t('gender.undisclosed') },
  ]);

  // const [listGender, setListGender] = useState<any>([
  //   { value: t('gender.male'), name: t('gender.male'), label: t('gender.male') },
  //   { value: t('gender.female'), name: t('gender.female'), label: t('gender.female') },
  //   { value: t('gender.undisclosed'), name: t('gender.undisclosed'), label: t('gender.undisclosed') },
  // ]);
  // const [defaultData] = useState<any>([
  //   { value: t('gender.male'), name: t('gender.male'), label: t('gender.male') },
  //   { value: t('gender.female'), name: t('gender.female'), label: t('gender.female') },
  //   { value: t('gender.undisclosed'), name: t('gender.undisclosed'), label: t('gender.undisclosed') },
  // ]);

  useEffect(() => {
    setItemChoose(genderChoose);
  }, [genderChoose]);

  //ACTION
  const onChangeTextSearch = (value: string) => {
    if (value !== '') {
      const newData = defaultData.filter(function (item: any) {
        const itemData = changeAlias(item.name);
        const textData = changeAlias(value);
        return itemData.indexOf(textData) > -1;
      });
      setListGender(newData);
      setSearchValue(value);
    } else {
      setListGender(defaultData);
      setSearchValue(value);
    }
  };

  const handleUpdateLanguage = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    chooseGender(itemChoose);
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

  const renderListGender = () => {
    return (
      <FlatList
        contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH24]}
        data={listGender}
        extraData={listGender}
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
    return renderListGender();
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={colors.c667085} size={24} />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('onboarding.selectGender')}
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
