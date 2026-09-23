import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@rneui/themed';
import { Divider } from '@rneui/base';
import { CSearchBar, IconX } from '@/components';
import { changeAlias, keyExtractor, screenStyles } from '@/configs';
import { CButton, CEmptyData, CEmptySearch, CText, Row } from '@/utils';
import { DataCountry } from '@/screens/auth-screen/step/components/modal-phone-code/country';

export interface ModalCountryProps {
  isVisible: boolean;
  hideModal: () => void;
  chooseCountry: (country: any) => void;
  countryChoose?: any;
  title?: string;
  searchPlaceholder?: string;
  btnTitle?: string;
}

export const ModalCountry: React.FC<ModalCountryProps> = ({
  isVisible,
  hideModal,
  chooseCountry,
  countryChoose,
  title = 'Chọn Quốc gia',
  searchPlaceholder = 'Tìm kiếm quốc gia...',
  btnTitle = 'Chọn',
}) => {
  const {
    theme: { colors },
  } = useTheme();

  const [searchValue, setSearchValue] = useState<string>('');
  const [itemChoose, setItemChoose] = useState<any>({});

  const defaultData = DataCountry.map(c => ({
    name: c.label,
    value: c.label,
    label: c.label,
    code: c.value,
  }));

  const [listCountry, setListCountry] = useState<any[]>(defaultData);

  useEffect(() => {
    if (typeof countryChoose === 'string') {
      const lower = countryChoose.toLowerCase();
      const found = defaultData.find(
        c =>
          c.name.toLowerCase() === lower ||
          c.value.toLowerCase() === lower ||
          c.label.toLowerCase() === lower,
      );
      setItemChoose(
        found || { name: countryChoose, value: countryChoose, label: countryChoose },
      );
    } else if (countryChoose?.value || countryChoose?.name) {
      const lowerVal = (countryChoose.value || countryChoose.name || '').toLowerCase();
      const found = defaultData.find(
        c => c.name.toLowerCase() === lowerVal || c.value.toLowerCase() === lowerVal,
      );
      setItemChoose(found || countryChoose);
    } else {
      setItemChoose({});
    }
  }, [countryChoose, isVisible]);

  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim() !== '') {
      const newData = defaultData.filter(item => {
        const itemData = changeAlias(item.name).toLowerCase();
        const textData = changeAlias(value).toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setListCountry(newData);
    } else {
      setListCountry(defaultData);
    }
  };

  const handleUpdateCountry = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    chooseCountry(itemChoose);
    hideModal();
  };

  const renderItemList = ({ item, index }: any) => {
    const isSelected =
      itemChoose?.value === item.value ||
      itemChoose?.name === item.name ||
      itemChoose === item.value ||
      itemChoose === item.name;

    const paddingCommon = index !== 0 ? screenStyles.pV13 : screenStyles.pFirstRow;

    return (
      <TouchableOpacity
        key={`${item.name}-${index}`}
        onPress={() => handleUpdateCountry(item)}
        activeOpacity={0.7}
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
        {isSelected ? (
          <IconX
            name="radio-button-on"
            type="ionicons"
            size={22}
            color={colors.primary}
          />
        ) : (
          <IconX
            name="radio-button-off"
            type="ionicons"
            size={22}
            color="#D0D5DD"
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderListEmpty = () => {
    if (searchValue !== '') {
      return <CEmptySearch />;
    }
    return <CEmptyData />;
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <IconX name="close" type="antdesign" color="#667085" size={22} />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {title}
          </CText>
          <View style={{ width: 22 }} />
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        <View style={screenStyles.modalTopSearchBar}>
          <CSearchBar
            value={searchValue}
            placeholder={searchPlaceholder}
            onChangeText={onChangeTextSearch}
            onClear={() => {
              setSearchValue('');
              setListCountry(defaultData);
            }}
            returnKeyType="search"
          />
        </View>
        <FlatList
          contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH24]}
          data={listCountry}
          keyExtractor={keyExtractor}
          renderItem={renderItemList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderListEmpty}
        />
        <View style={[screenStyles.pH24, { paddingBottom: 16 }]}>
          <CButton
            title={btnTitle}
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  contentContainer: {
    width: '100%',
    height: '70%',
  },
});

export default ModalCountry;
