import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { CHeader, ImageHelper, Wrapper } from '@/components';
import { images } from '@/configs';
import { PAGINATION } from '@/constants';
import ApiService from '@/services/api-base';
import { CEmptyData, CLoading, CText } from '@/utils';

const MyCourses: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'courses' | 'saved'>('courses');
  const [firstRender, setFirstRender] = useState(true);
  const [listCourses, setListCourses] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [finalLoad, setFinalLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCourses = async (newOffset: number, isRefresh = false) => {
    try {
      const params = {
        offset: newOffset,
        limit: PAGINATION.ITEMS_20,
        filter: activeTab === 'saved' ? 'saved' : undefined,
      };
      const res: any = await ApiService.getMyCourses(params);
      const items = res?.data?.result?.items || res?.data?.items || [];
      const total = res?.data?.result?.total ?? res?.data?.total ?? items.length;

      if (newOffset === 0 || isRefresh) {
        setListCourses(items);
      } else {
        setListCourses(prev => [...prev, ...items]);
      }

      setFinalLoad(items.length < PAGINATION.ITEMS_20 || (newOffset + items.length >= total));
      setOffset(newOffset);
    } catch (err) {
      console.log('fetchCourses error:', err);
    } finally {
      setFirstRender(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setFirstRender(true);
    fetchCourses(0);
  }, [activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses(0, true);
  };

  const handleLoadMore = () => {
    if (!finalLoad && !loadingMore && !firstRender && !refreshing) {
      setLoadingMore(true);
      const nextOffset = offset + PAGINATION.ITEMS_20;
      fetchCourses(nextOffset);
    }
  };

  const renderItem = ({ item }: any) => {
    const title = item?.title || item?.name || '';
    const instructor = item?.doctor?.name || item?.author?.name || item?.instructor || '';
    const thumbUri = item?.thumbnail || item?.cover || item?.image;
    const progress = item?.progress ?? 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          console.log('Course clicked:', item?.id);
        }}
      >
        <ImageHelper
          source={{ uri: thumbUri || '' }}
          renderErrorImage={() => (
            <View style={styles.thumbPlaceholder}>
              <Image source={images.global.no_avatar} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </View>
          )}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.cardInfo}>
          <CText style={styles.courseTitle} numberOfLines={2}>
            {title}
          </CText>
          {!!instructor && (
            <CText style={styles.instructorText} numberOfLines={1}>
              {instructor}
            </CText>
          )}
          {progress > 0 && (
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
              </View>
              <CText style={styles.progressText}>{`${progress}%`}</CText>
            </View>
          )}
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
        title={t('profile.myCourses', 'Khóa học của Tôi')}
        rightComponentDisable
      />
      {/* Tabs */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'courses' && styles.tabButtonActive]}
          onPress={() => setActiveTab('courses')}
        >
          <CText style={[styles.tabText, activeTab === 'courses' && styles.tabTextActive]}>
            {t('home.course', 'Khóa học')}
          </CText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'saved' && styles.tabButtonActive]}
          onPress={() => setActiveTab('saved')}
        >
          <CText style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
            {t('common.saved', 'Đã lưu')}
          </CText>
        </TouchableOpacity>
      </View>

      {firstRender ? (
        <CLoading />
      ) : (
        <FlatList
          contentContainerStyle={listCourses.length === 0 ? styles.emptyContainer : styles.listContent}
          data={listCourses}
          keyExtractor={(item, idx) => item?.id || String(idx)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <CEmptyData title={t('profile.emptyCourses', 'Chưa có khóa học nào')} />
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
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#19A2A7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667085',
  },
  tabTextActive: {
    color: '#19A2A7',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F2F4F7',
  },
  thumbnail: {
    width: 110,
    height: 85,
  },
  thumbPlaceholder: {
    width: 110,
    height: 85,
    backgroundColor: '#EAECF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 18,
  },
  instructorText: {
    fontSize: 12,
    color: '#667085',
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 5,
    backgroundColor: '#F2F4F7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#19A2A7',
  },
  progressText: {
    fontSize: 11,
    color: '#98A2B3',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyCourses;
