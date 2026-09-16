import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '@/components';
import { CText } from '@/utils';
import ApiService from '@/services/api-base';

export interface LocationItem {
  text: string;
  geometry?: { location?: { lat: number; lng: number } };
  place_id?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onChooseLocation: (item: LocationItem) => void;
}

const ModalSearchAddress: React.FC<Props> = ({ visible, onClose, onChooseLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input khi modal mở
  useEffect(() => {
    if (visible) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible]);

  // Debounce search
  const handleChangeText = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) { setResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res: any = await ApiService.searchLocation(text.trim());
        if (res?.ok) {
          const items: LocationItem[] = (res.data?.result?.items || res.data?.items || []).map((item: any) => ({
            text: item.text || item.description || item.name || '',
            geometry: item.geometry,
            place_id: item.place_id || item.id,
          }));
          setResults(items);
        }
      } catch {}
      setLoading(false);
    }, 400);
  }, []);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleSelect = (item: LocationItem) => {
    Keyboard.dismiss();
    onChooseLocation(item);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleClose} activeOpacity={0.7}>
            <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
          </TouchableOpacity>
          <CText style={styles.headerTitle}>Chọn địa chỉ</CText>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Search bar */}
        <View style={styles.searchWrapper}>
          <IconX type="ionicons" name="search" size={18} color="#98A2B3" />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Tìm kiếm địa chỉ..."
            placeholderTextColor="#98A2B3"
            value={query}
            onChangeText={handleChangeText}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleChangeText('')} activeOpacity={0.7}>
              <IconX type="ionicons" name="close-circle" size={18} color="#98A2B3" />
            </TouchableOpacity>
          )}
        </View>

        {/* Results */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="small" color="#14B8A6" />
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item, idx) => item.place_id || String(idx)}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              query.trim().length > 0 ? (
                <View style={styles.centerBox}>
                  <CText style={styles.emptyText}>Không tìm thấy địa chỉ</CText>
                </View>
              ) : undefined
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)} activeOpacity={0.7}>
                <IconX type="ionicons" name="location-outline" size={20} color="#14B8A6" />
                <CText style={styles.resultText} numberOfLines={2}>{item.text}</CText>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 48, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#F2F4F7',
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#101828' },
  headerPlaceholder: { width: 36 },
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 10, borderWidth: 1, borderColor: '#EAECF0',
    backgroundColor: '#F9FAFB', gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#101828', padding: 0 },
  centerBox: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#98A2B3' },
  resultItem: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  resultText: { flex: 1, fontSize: 14, color: '#101828', lineHeight: 20 },
  separator: { height: 1, backgroundColor: '#F2F4F7', marginLeft: 48 },
});

export default ModalSearchAddress;
