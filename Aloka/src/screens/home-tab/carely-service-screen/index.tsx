import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { IconX, ImageHelper } from '@/components';
import { formatMoneyVND } from '@/configs/common';
import { images } from '@/configs/image';
import { PAGINATION } from '@/constants';
import ApiService from '@/services/api-base';
import { CText } from '@/utils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

const CarelyServiceScreen: React.FC<any> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const parentService = route.params?.parentService || {};
  const parentTitle = parentService?.name || 'Dịch vụ';

  const [listChildServices, setListChildServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChildServices = async (isRefresh = false) => {
    if (!parentService?.id) {
      setLoading(false);
      return;
    }

    if (!isRefresh) setLoading(true);

    try {
      const param: any = {
        limit: PAGINATION.ITEMS_100 || 100,
        offset: 0,
        fq: `status:1,is_deleted:0,parent_id:${parentService.id},is_book_service:1`,
      };

      const res: any = await ApiService.getCarelyServices(param);

      const items: any[] =
        res?.data?.items ||
        res?.data?.result?.items ||
        res?.data?.result?.item ||
        (Array.isArray(res?.data) ? res.data : []) ||
        [];

      setListChildServices(items);
    } catch (error) {
      console.log('fetchChildServices error:', error);
      setListChildServices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChildServices();
  }, [parentService?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChildServices(true);
  };

  const handlePressDetail = (item: any) => {
    navigation.navigate('CarelyServiceDetailScreen', {
      service: item,
    });
  };

  const renderServiceCard = ({ item }: { item: any }) => {
    const title = item?.name || '';
    const nurseOrDoctor =
      item?.channel?.name || item?.doctor?.full_name || 'Điều dưỡng Aloka';
    const rating = item?.avg_value ? Number(item.avg_value).toFixed(1) : '5.0';
    const totalRatings = item?.total_ratings || 0;
    const price = item?.price ?? item?.package?.price ?? 0;
    const priceFormatted = formatMoneyVND(price, '.');

    const imageSource = item?.thumbnail
      ? { uri: item.thumbnail }
      : (images.common as any)?.service_mom_baby || images.common.img_default;

    return (
      <TouchableOpacity
        style={styles.serviceCard}
        activeOpacity={0.7}
        onPress={() => handlePressDetail(item)}
      >
        <ImageHelper
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
        />

        <View style={styles.cardContent}>
          <CText style={styles.cardTitle} numberOfLines={2}>
            {title}
          </CText>

          <CText style={styles.nurseName} numberOfLines={1}>
            {nurseOrDoctor}
          </CText>

          <View style={styles.ratingRow}>
            <IconX type="ionicons" name="star" size={13} color="#F59E0B" />
            <CText style={styles.ratingText}>{rating}</CText>
            {totalRatings > 0 && (
              <CText style={styles.ratingCount}>({totalRatings})</CText>
            )}
          </View>

          <View style={styles.priceRow}>
            <CText style={styles.priceText}>{priceFormatted}</CText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <IconX
          type="ionicons"
          name="medkit-outline"
          size={52}
          color="#D0D5DD"
        />
        <CText style={styles.emptyTitle}>Chưa có dịch vụ con</CText>
        <CText style={styles.emptySub}>
          Nhấn bên dưới để xem thông tin chi tiết gói dịch vụ này
        </CText>
        <TouchableOpacity
          style={styles.viewParentBtn}
          activeOpacity={0.8}
          onPress={() => handlePressDetail(parentService)}
        >
          <CText style={styles.viewParentBtnText}>Xem chi tiết dịch vụ</CText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <IconX
            type="ionicons"
            name="chevron-back"
            size={24}
            color="#1D2939"
          />
        </TouchableOpacity>
        <CText style={styles.headerTitle} numberOfLines={1}>
          {parentTitle}
        </CText>
        <View style={styles.placeholder} />
      </View>

      {/* Body List */}
      <View style={styles.body}>
        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#19A2A7" />
          </View>
        ) : (
          <FlatList
            data={listChildServices}
            keyExtractor={(item, index) =>
              String(item?.id || item?._id || index)
            }
            renderItem={renderServiceCard}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={[
              styles.listContent,
              listChildServices.length === 0 && {
                flexGrow: 1,
                justifyContent: 'center',
              },
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#19A2A7"
                colors={['#19A2A7']}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CarelyServiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
    maxWidth: width - 100,
    textAlign: 'center',
  },
  placeholder: {
    width: 36,
  },
  body: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECF0',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 115,
    backgroundColor: '#E5E7EB',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#101828',
    lineHeight: 18,
    minHeight: 36,
  },
  nurseName: {
    fontSize: 11.5,
    color: '#667085',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#344054',
  },
  ratingCount: {
    fontSize: 11,
    color: '#98A2B3',
  },
  priceRow: {
    marginTop: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#19A2A7',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  viewParentBtn: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewParentBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
