import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { CHeader, IconX, Wrapper } from '@/components';
import { PAGINATION } from '@/constants';
import ApiService from '@/services/api-base';
import { CEmptyData, CLoading, CText } from '@/utils';
import moment from 'moment';

const MyPackages: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const [firstRender, setFirstRender] = useState(true);
  const [listPackages, setListPackages] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [finalLoad, setFinalLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPackages = async (newOffset: number, isRefresh = false) => {
    try {
      const params = {
        offset: newOffset,
        limit: PAGINATION.ITEMS_20,
      };
      const res: any = await ApiService.getMyPackages(params);
      const items = res?.data?.result?.items || res?.data?.items || [];
      const total = res?.data?.result?.total ?? res?.data?.total ?? items.length;

      if (newOffset === 0 || isRefresh) {
        setListPackages(items);
      } else {
        setListPackages(prev => [...prev, ...items]);
      }

      setFinalLoad(items.length < PAGINATION.ITEMS_20 || (newOffset + items.length >= total));
      setOffset(newOffset);
    } catch (err) {
      console.log('fetchPackages error:', err);
    } finally {
      setFirstRender(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPackages(0);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPackages(0, true);
  };

  const handleLoadMore = () => {
    if (!finalLoad && !loadingMore && !firstRender && !refreshing) {
      setLoadingMore(true);
      const nextOffset = offset + PAGINATION.ITEMS_20;
      fetchPackages(nextOffset);
    }
  };

  const renderItem = ({ item }: any) => {
    const pkg = item?.package || item;
    const name = pkg?.name || pkg?.title || item?.name || 'Gói dịch vụ';
    const clinic = item?.clinic?.name || item?.doctor?.name || '';
    const expiry = item?.expire_at ? moment(item.expire_at).format('DD/MM/YYYY') : '';
    const status = item?.status || 'active';

    const getStatusBadge = () => {
      if (status === 'active' || status === 'completed') {
        return { text: 'Đang hiệu lực', bg: '#ECFDF3', color: '#027A48' };
      }
      if (status === 'expired') {
        return { text: 'Hết hạn', bg: '#FEF3F2', color: '#B42318' };
      }
      return { text: status, bg: '#F2F4F7', color: '#344054' };
    };

    const badge = getStatusBadge();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <IconX type="octicons" name="package" size={20} color="#19A2A7" />
          </View>
          <View style={styles.headerInfo}>
            <CText style={styles.pkgName} numberOfLines={2}>
              {name}
            </CText>
            {!!clinic && (
              <CText style={styles.clinicText} numberOfLines={1}>
                {clinic}
              </CText>
            )}
          </View>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <CText style={[styles.badgeText, { color: badge.color }]}>{badge.text}</CText>
          </View>
        </View>

        {!!expiry && (
          <View style={styles.footerRow}>
            <IconX type="ionicons" name="calendar-outline" size={14} color="#98A2B3" />
            <CText style={styles.expiryText}>Hạn sử dụng: {expiry}</CText>
          </View>
        )}
      </View>
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
        title={t('profile.myPackage', 'Gói dịch vụ của tôi')}
        rightComponentDisable
      />
      {firstRender ? (
        <CLoading />
      ) : (
        <FlatList
          contentContainerStyle={listPackages.length === 0 ? styles.emptyContainer : styles.listContent}
          data={listPackages}
          keyExtractor={(item, idx) => item?.id || String(idx)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <CEmptyData title={t('profile.emptyPackages', 'Chưa có gói dịch vụ nào')} />
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
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F2F4F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E6FAFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  pkgName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    lineHeight: 20,
  },
  clinicText: {
    fontSize: 13,
    color: '#667085',
    marginTop: 3,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    gap: 6,
  },
  expiryText: {
    fontSize: 12,
    color: '#98A2B3',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyPackages;
