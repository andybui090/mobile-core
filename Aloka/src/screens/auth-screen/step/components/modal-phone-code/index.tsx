import { CSearchBar, IconX } from '@/components';
import { changeAlias, keyExtractor, screenStyles } from '@/configs';
import { CButton, CEmptyData, CEmptySearch, CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, View, Modal, StyleSheet } from 'react-native';

import { Divider } from '@rneui/base';
import { useTranslation } from 'react-i18next';
import { DataCountry } from './country';

const ModalPhoneCode = ({
  isVisible,
  hideModal,
  choosePhoneCode,
  phoneCodeChoose,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState<string>('');

  const [listCountry, setListCountry] = useState<any[]>(DataCountry);
  const [defaultData] = useState<any[]>(DataCountry);

  const [itemChoose, setItemChoose] = useState<any>({});

  useEffect(() => {
    setItemChoose(phoneCodeChoose);
  }, [phoneCodeChoose]);

  //ACTION
  const onChangeTextSearch = (value: string) => {
    if (value !== '') {
      const newData = defaultData.filter(function (item: any) {
        const itemData = changeAlias(item.label);
        const textData = changeAlias(value);
        return itemData.indexOf(textData) > -1;
      });
      setListCountry(newData);
      setSearchValue(value);
    } else {
      setListCountry(defaultData);
      setSearchValue(value);
    }
  };

  const handleUpdateCountry = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    choosePhoneCode(itemChoose);
  };

  //RENDER
  const renderItemList = ({ item, index }: any) => {
    const paddingCommon =
      index !== 0 ? screenStyles.pV13 : screenStyles.pFirstRow;
    return (
      <Pressable
        onPress={() => {
          handleUpdateCountry(item);
        }}
        style={[
          screenStyles.rowBettween,
          paddingCommon,
          screenStyles.pR8,
          screenStyles.bottomLine,
        ]}
      >
        <CText h5 color={colors.c1D2939}>
          {item.label}
          <CText h5 color={colors.c98A2B3}>
            {` (${item.value})`}
          </CText>
        </CText>
        <IconX
          name={
            itemChoose.value == item.value
              ? 'radio-button-on'
              : 'radio-button-off'
          }
          size={20}
          type="ionicons"
          color={
            itemChoose.value == item.value ? colors.primary : colors.c98A2B3
          }
        />
      </Pressable>
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
    return renderListCountry();
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
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
            {t('onboarding.selectCountry')}
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

export default ModalPhoneCode;
