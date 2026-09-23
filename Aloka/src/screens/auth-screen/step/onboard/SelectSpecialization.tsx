import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@rneui/themed';
import { CHeader, CSearchBar, IconX, ImageHelper, Wrapper } from '@/components';
import { CButton, CText } from '@/utils';
import { changeAlias, ScreenWidth } from '@/configs';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { getSpecializations } from '@/redux/slices/onboardSlice';

export interface SpecializationItem {
  id: number | string;
  name: string;
  icon?: string;
  code?: string;
  parent_id?: number | null;
  status?: number;
}

interface Props {
  goBack: () => void;
  onConfirm: (items: SpecializationItem[]) => void;
  initialSelected?: SpecializationItem[];
}

// Fallback items matching mockup image exactly if API data is loading or empty
const DEFAULT_SPECIALIZATIONS: SpecializationItem[] = [
  { id: 1, name: 'Răng hàm mặt', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png' },
  { id: 2, name: 'Sơ cứu - Cấp cứu', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966486.png' },
  { id: 3, name: 'Thể dục - Thể thao', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966345.png' },
  { id: 4, name: 'Dinh dưỡng', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966367.png' },
  { id: 5, name: 'Ung bướu', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966411.png' },
  { id: 6, name: 'Thần kinh', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966380.png' },
  { id: 7, name: 'Tâm lý', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966395.png' },
  { id: 8, name: 'Tiêu hóa', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966432.png' },
  { id: 9, name: 'Da liễu', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966420.png' },
  { id: 10, name: 'Phẫu thuật thẩm mỹ', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966450.png' },
  { id: 11, name: 'Huyết học', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966465.png' },
  { id: 12, name: 'Truyền nhiễm', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966478.png' },
  { id: 13, name: 'Cơ xương khớp', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966490.png' },
  { id: 14, name: 'Nam khoa', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966505.png' },
];

export const SelectSpecialization: React.FC<Props> = ({
  goBack,
  onConfirm,
  initialSelected = [],
}) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const dispatch = useAppDispatch();
  const { specializationsList } = useAppSelector(state => state.onboardReducer);

  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<SpecializationItem[]>(initialSelected);

  useEffect(() => {
    dispatch(getSpecializations(null));
  }, [dispatch]);

  // Combine API items or fallback to DEFAULT_SPECIALIZATIONS
  const allItems: SpecializationItem[] = useMemo(() => {
    const apiItems = specializationsList?.data?.items;
    if (Array.isArray(apiItems) && apiItems.length > 0) {
      return apiItems;
    }
    return DEFAULT_SPECIALIZATIONS;
  }, [specializationsList]);

  // Filter based on search input
  const filteredList: SpecializationItem[] = useMemo(() => {
    const query = searchValue.trim();
    if (!query) return allItems;
    const normalizedQuery = changeAlias(query).toLowerCase();
    return allItems.filter(item => {
      const normalizedName = changeAlias(item.name || '').toLowerCase();
      return normalizedName.includes(normalizedQuery);
    });
  }, [allItems, searchValue]);

  const handleToggleItem = (item: SpecializationItem) => {
    setSelectedItems(prev => {
      const exists = prev.some(it => it.id === item.id);
      if (exists) {
        return prev.filter(it => it.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isSelected = (id: number | string) => {
    return selectedItems.some(it => it.id === id);
  };

  const handleConfirm = () => {
    Keyboard.dismiss();
    onConfirm(selectedItems);
  };

  const renderErrorImage = () => (
    <IconX
      type="ionicons"
      name="medkit-outline"
      size={26}
      color={colors.c667085}
    />
  );

  const cardWidth = (ScreenWidth - 20 * 2 - 12) / 2;

  const renderItem = ({ item }: { item: SpecializationItem }) => {
    const active = isSelected(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.itemCard,
          { width: cardWidth },
          active && styles.itemCardActive,
        ]}
        activeOpacity={0.7}
        onPress={() => handleToggleItem(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconWrap}>
            {item.icon ? (
              <ImageHelper
                source={{ uri: item.icon }}
                style={styles.iconImage}
                resizeMode="contain"
                renderErrorImage={renderErrorImage}
              />
            ) : (
              renderErrorImage()
            )}
          </View>

          {active ? (
            <View style={styles.checkboxWrap}>
              <IconX
                type="ionicons"
                name="checkmark-circle"
                size={24}
                color="#007AFF"
              />
            </View>
          ) : (
            <View style={styles.checkboxPlaceholder} />
          )}
        </View>

        <CText
          style={[styles.itemText, active && styles.itemTextActive]}
          numberOfLines={2}
        >
          {item.name}
        </CText>
      </TouchableOpacity>
    );
  };

  return (
    <Wrapper safeBottom style={styles.container}>
      {/* Header */}
      <CHeader
        title={t('onboarding.specialistTitle', 'Chọn chuyên khoa')}
        isBorderBottom={false}
        rightComponentDisable
        leftComponentOnPress={goBack}
      />

      {/* 3-Step Progress Indicator matching Mockup Image 1 */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={styles.progressGap} />
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={styles.progressGap} />
        <View style={[styles.progressSegment, styles.progressInactive]} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <CSearchBar
          value={searchValue}
          placeholder={t('search.searchPlaceholder', 'Tìm kiếm')}
          onChangeText={setSearchValue}
          onClear={() => setSearchValue('')}
          returnKeyType="search"
        />
      </View>

      {/* Specializations 2-Column Grid */}
      <FlatList
        data={filteredList}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <CText style={styles.emptyText}>
              {t('common.noData', 'Không tìm thấy chuyên khoa')}
            </CText>
          </View>
        }
      />

      {/* Bottom Button "Tiếp tục" */}
      <View style={styles.bottomBar}>
        <CButton
          btnWidth="100%"
          title={t('common.continue', 'Tiếp tục')}
          onPress={handleConfirm}
          isDisable={selectedItems.length === 0}
          backgroundColor={selectedItems.length > 0 ? '#007AFF' : '#D0D5DD'}
          titleColor="#FFFFFF"
          style={styles.continueBtn}
        />
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    flexDirection: 'row',
    height: 3.5,
    width: ScreenWidth,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
  },
  progressActive: {
    backgroundColor: '#007AFF',
  },
  progressInactive: {
    backgroundColor: '#D0D5DD',
  },
  progressGap: {
    width: 3,
    backgroundColor: '#FFFFFF',
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemCard: {
    height: 104,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
    padding: 12,
    justifyContent: 'space-between',
  },
  itemCardActive: {
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 38,
    height: 38,
  },
  checkboxWrap: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxPlaceholder: {
    width: 24,
    height: 24,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
    marginTop: 6,
    lineHeight: 18,
  },
  itemTextActive: {
    color: '#101828',
    fontWeight: '600',
  },
  emptyWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#667085',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
  },
  continueBtn: {
    borderRadius: 10,
    height: 48,
  },
});

export default SelectSpecialization;
