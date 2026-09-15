import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { CHeader, IconX, ImageHelper, Wrapper } from '@/components';
import { PAGINATION } from '@/constants';
import ApiService from '@/services/api-base';
import { CEmptyData, CLoading, CText } from '@/utils';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;
const ITEM_HEIGHT = ITEM_WIDTH * 1.6;

const VideosSaved: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const [firstRender, setFirstRender] = useState(true);
  const [listVideoSaved, setListVideoSaved] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [finalLoad, setFinalLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchVideosSaved = async (newOffset: number, isRefresh = false) => {
    try {
      const params = {
        filter: 'saved',
        offset: newOffset,
        limit: PAGINATION.ITEMS_30,
      };
      const res: any = await ApiService.getVideosSaved(params);
      const items = res?.data?.result?.items || res?.data?.items || [];
      const total = res?.data?.result?.total ?? res?.data?.total ?? items.length;

      if (newOffset === 0 || isRefresh) {
        setListVideoSaved(items);
      } else {
        setListVideoSaved(prev => [...prev, ...items]);
      }

      setFinalLoad(items.length < PAGINATION.ITEMS_30 || (newOffset + items.length >= total));
      setOffset(newOffset);
    } catch (err) {
      console.log('fetchVideosSaved error:', err);
    } finally {
      setFirstRender(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchVideosSaved(0);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideosSaved(0, true);
  };

  const handleLoadMore = () => {
    if (!finalLoad && !loadingMore && !firstRender && !refreshing) {
      setLoadingMore(true);
      const nextOffset = offset + PAGINATION.ITEMS_30;
      fetchVideosSaved(nextOffset);
    }
  };

  const renderItem = ({ item }: any) => {
    const thumbUri = item?.thumbnail_url || item?.cover || item?.media?.thumbnail;
    const views = item?.statistics?.view ?? item?.views ?? 0;

    return (
      <TouchableOpacity
        style={styles.itemWrapper}
        activeOpacity={0.8}
        onPress={() => {
          console.log('Video clicked:', item?.id);
        }}
      >
        <ImageHelper
          source={{ uri: thumbUri || '' }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.viewRow}>
            <IconX type="ionicons" name="play-outline" size={13} color="#FFFFFF" />
            <CText style={styles.viewText}>{views}</CText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={{ paddingVertical: 14 }}>
          <ActivityIndicator size="small" color={colors.primary || '#19A2A7'} />
        </View>
      );
    }
    return null;
  };

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={() => navigation.goBack()}
        isBorderBottom
        title={t('profile.saved', 'Đã lưu')}
        rightComponentDisable
      />
      {firstRender ? (
        <CLoading />
      ) : (
        <FlatList
          contentContainerStyle={listVideoSaved.length === 0 ? styles.emptyContainer : { paddingBottom: 24 }}
          data={listVideoSaved}
          numColumns={3}
          keyExtractor={(item, idx) => item?.id || String(idx)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <CEmptyData title={t('profile.emptySaved', 'Chưa có video đã lưu')} />
          }
          onEndReachedThreshold={0.4}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary || '#19A2A7'}
            />
          }
        />
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    padding: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideosSaved;
