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
import { useTranslation } from 'react-i18next';
import { Divider } from '@rneui/base';
import { CSearchBar, IconX } from '@/components';
import { changeAlias, keyExtractor, screenStyles } from '@/configs';
import { CButton, CEmptyData, CEmptySearch, CText, Row } from '@/utils';

export interface ModalGenderProps {
  isVisible: boolean;
  hideModal: () => void;
  chooseGender: (gender: any) => void;
  genderChoose?: any;
}

export const ModalGender: React.FC<ModalGenderProps> = ({
  isVisible,
  hideModal,
  chooseGender,
  genderChoose,
}) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState<string>('');
  const [itemChoose, setItemChoose] = useState<any>({});

  const defaultData = [
    { value: 'Male', name: t('gender.male', 'Nam'), label: t('gender.male', 'Nam') },
    { value: 'Female', name: t('gender.female', 'Nữ'), label: t('gender.female', 'Nữ') },
    { value: 'Undisclosed', name: t('gender.undisclosed', 'Khác'), label: t('gender.undisclosed', 'Khác') },
  ];

  const [listGender, setListGender] = useState<any[]>(defaultData);

  useEffect(() => {
    if (typeof genderChoose === 'string') {
      const found = defaultData.find(
        g => g.name === genderChoose || g.value === genderChoose || g.label === genderChoose
      );
      setItemChoose(found || { name: genderChoose, value: genderChoose, label: genderChoose });
    } else if (genderChoose) {
      setItemChoose(genderChoose);
    } else {
      setItemChoose({});
    }
  }, [genderChoose, isVisible]);

  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim() !== '') {
      const newData = defaultData.filter(item => {
        const itemData = changeAlias(item.name).toLowerCase();
        const textData = changeAlias(value).toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setListGender(newData);
    } else {
      setListGender(defaultData);
    }
  };

  const handleUpdateLanguage = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    chooseGender(itemChoose);
    hideModal();
  };

  const renderItemList = ({ item, index }: any) => {
    const isSelected =
      itemChoose?.name === item.name ||
      itemChoose?.value === item.value ||
      itemChoose === item.name;

    const paddingCommon = index !== 0 ? screenStyles.pV13 : screenStyles.pFirstRow;

    return (
      <TouchableOpacity
        key={item.value}
        onPress={() => handleUpdateLanguage(item)}
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
            {t('onboarding.selectGender', 'Chọn giới tính')}
          </CText>
          <View style={{ width: 22 }} />
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        <View style={screenStyles.modalTopSearchBar}>
          <CSearchBar
            value={searchValue}
            placeholder={t('search.searchPlaceholder', 'Tìm kiếm...')}
            onChangeText={onChangeTextSearch}
            onClear={() => {
              setSearchValue('');
              setListGender(defaultData);
            }}
            returnKeyType="search"
          />
        </View>
        <FlatList
          contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH24]}
          data={listGender}
          keyExtractor={keyExtractor}
          renderItem={renderItemList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderListEmpty}
        />
        <View style={[screenStyles.pH24, { paddingBottom: 16 }]}>
          <CButton
            title={t('common.choose', 'Chọn')}
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
    height: '60%',
  },
});
