import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { CHeader, ImageHelper, Toast, Wrapper } from '@/components';
import { images, screenStyles } from '@/configs';
import { PAGINATION } from '@/constants';
import ApiService from '@/services/api-base';
import { CEmptyData, CLoading, CText, Row } from '@/utils';

const FollowingList: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const toastEl = useRef<any>(null);

  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [finalLoad, setFinalLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listFollowing, setListFollowing] = useState<any[]>([]);

  const fetchFollowing = async (newOffset: number, isRefresh = false) => {
    try {
      const params = {
        offset: newOffset,
        limit: PAGINATION.ITEMS_20,
      };
      const res: any = await ApiService.getListFollowings(params);
      const items = res?.data?.result?.items || res?.data?.items || [];
      const total = res?.data?.result?.total ?? res?.data?.total ?? items.length;

      if (newOffset === 0 || isRefresh) {
        setListFollowing(items);
      } else {
        setListFollowing(prev => [...prev, ...items]);
      }

      setFinalLoad(items.length < PAGINATION.ITEMS_20 || (newOffset + items.length >= total));
      setOffset(newOffset);
    } catch (err) {
      console.log('fetchFollowing error:', err);
    } finally {
      setFirstRender(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFollowing(0);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFollowing(0, true);
  };

  const handleLoadMore = () => {
    if (!finalLoad && !loadingMore && !firstRender && !refreshing) {
      setLoadingMore(true);
      const nextOffset = offset + PAGINATION.ITEMS_20;
      fetchFollowing(nextOffset);
    }
  };

  const handleToggleFollow = async (item: any, index: number) => {
    const channelId = item?.channel_id || item?.following_id || item?.following?.id;
    if (!channelId) return;

    try {
      // Optimistic remove from following list
      const arrClone = [...listFollowing];
      arrClone.splice(index, 1);
      setListFollowing(arrClone);

      await ApiService.putUnFollow({
        doctorId: channelId,
        data1: { isFollowed: false },
      });
    } catch (err) {
      console.log('handleToggleFollow error:', err);
    }
  };

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box36}
        resizeMode="contain"
      />
    );
  };

  const renderItem = ({ item, index }: any) => {
    const following = item?.following || item;
    const avatar = following?.avatar || item?.avatar;
    const name = following?.name || following?.full_name || item?.name || '';
    const categoryName = following?.categoryName || following?.specialty || item?.categoryName;

    return (
      <Row
        start
        style={[
          screenStyles.pH16,
          screenStyles.pV12,
          styles.itemRow,
          { borderBottomColor: colors.cF2F4F7 },
        ]}
      >
        <View style={styles.avatar}>
          <ImageHelper
            source={{ uri: avatar || '' }}
            renderErrorImage={renderErrorImage}
          />
        </View>
        <View style={[screenStyles.pH12, screenStyles.flex1]}>
          <CText h5 w600 color={colors.c101828} numberOfLines={1}>
            {name}
          </CText>
          {!!categoryName && (
            <CText h6 color={colors.c667085} style={{ marginTop: 2 }} numberOfLines={1}>
              {categoryName}
            </CText>
          )}
        </View>
        <Pressable
          onPress={() => handleToggleFollow(item, index)}
          style={[styles.btnFollow, { borderColor: colors.cD0D5DD }]}
        >
          <CText h6 color={colors.c667085} center>
            {t('profile.followed', 'Đã theo dõi')}
          </CText>
        </Pressable>
      </Row>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={{ paddingVertical: 16 }}>
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
        title={t('profile.following', 'Đã theo dõi')}
        rightComponentDisable
      />
      {firstRender ? (
        <CLoading />
      ) : (
        <FlatList
          contentContainerStyle={listFollowing.length === 0 ? styles.emptyContainer : { paddingBottom: 30 }}
          data={listFollowing}
          keyExtractor={(item, idx) => item?.id || String(idx)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <CEmptyData title={t('profile.emptyFollowing', 'Chưa có theo dõi nào')} />
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
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#EAECF0',
  },
  btnFollow: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FollowingList;
