import { CHeader, ImageHelper, Toast, Wrapper } from '@/components';
import {
  calculateDistance,
  formatMoneyVND,
  images,
  isIOS,
  keyExtractor,
  parsePricePackage,
  screenStyles,
  ScreenWidth,
} from '@/configs';
import { PAGINATION } from '@/constants';
import { mainRoute } from '@/constants/route_key';
import {
  getCarelyChildServices,
  resetCarely,
} from '@/redux/slices/carelySlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CEmptyData, Container, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { ServiceLoading } from './ServiceLoading';
import { AppContext } from '@/contexts';

const ServicesScreen: React.FC<any> = ({ navigation, route }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const styles = useStyles();
  const toastEl = useRef(null);

  const { currentLocation } = useContext(AppContext);

  const dispatch = useAppDispatch();

  const { carelyChildServiceData } = useAppSelector(
    state => state.carelyReducer,
  );

  const [listChildService, setListChildService] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const callAPICarelyChildServices = (_offset: number, parent_id: number) => {
    const param: any = {
      limit: PAGINATION.ITEMS_100,
      offset: _offset,
      fq: `status:1,is_deleted:0,parent_id:${parent_id},is_book_service:1'`,
    };
    dispatch(getCarelyChildServices(param));
  };

  useEffect(() => {
    const initData = () => {
      const parent = route.params?.parentService;
      if (parent.id > 0) {
        callAPICarelyChildServices(0, parent.id);
      }
    };
    if (route.params?.parentService) {
      initData();
    }
  }, [route.params]);

  useEffect(() => {
    const processAPIListService = () => {
      const { loading, data, error } = carelyChildServiceData;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          console.log('🚀 ~ processAPIListService ~ newItems:', newItems);
          const arrClone = [...listChildService, ...newItems];
          setListChildService(arrClone);
          setLoading(false);
          dispatch(resetCarely());
        } else if (error) {
          setLoading(false);
          dispatch(resetCarely());
        }
      }
    };
    processAPIListService();
  }, [carelyChildServiceData]);

  //PROPS & STATE

  // ACTION
  const handleViewDetail = (item: any) => {
    navigation.navigate(mainRoute.serviceDetailScreen, {
      service: item,
    });
  };

  //RENDER
  const renderErrorImage = () => {
    return (
      <Image
        source={images.bottomTab.carely}
        style={{ width: '80%', height: '80%' }}
        resizeMode="contain"
      />
    );
  };

  const ServiceCard = ({ item }: any) => {
    const {
      name,
      price,
      discount,
      thumbnail,
      avg_value,
      total_ratings,
      distance,
      latitude,
      longitude,
    } = item;
    const priceFormat = parsePricePackage(price, discount);
    const numRating = avg_value ? avg_value : 0;
    const totalRating = total_ratings ? total_ratings : 0;
    const distanceKm = distance
      ? distance
      : calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          latitude,
          longitude,
        );
    return (
      <Pressable style={styles.card} onPress={() => handleViewDetail(item)}>
        <View style={styles.image}>
          <ImageHelper
            source={{ uri: thumbnail }}
            renderErrorImage={renderErrorImage}
          />
        </View>
        <View style={styles.content}>
          <CText w500 h5 numberOfLines={2} color={colors.c101828}>
            {name || ''}
          </CText>
          {numRating > 0 && (
            <Row start style={screenStyles.mT3}>
              <Rating
                startingValue={5}
                readonly
                showRating={false}
                imageSize={14}
                jumpValue={0.5}
                ratingColor={'#FDB022'}
                ratingCount={1}
              />
              <CText style={screenStyles.mL5} color={'#FDB022'} h56>
                {numRating || 0}
              </CText>
              <CText style={screenStyles.mL5} color={colors.cEAECF0} h5 w500>
                {'|'}
              </CText>
              <CText color={'#374151'} h56 style={screenStyles.mL5}>
                {`${t('course.review', 'Review')} (${totalRating})`}
              </CText>
            </Row>
          )}
          {distanceKm != null && distanceKm > 0 && (
            <Row start style={screenStyles.mT3}>
              <CText color={'#374151'} h56>
                {`${distanceKm}km`}
              </CText>
            </Row>
          )}
          <View style={screenStyles.mT3}>
            {priceFormat.discountPrice > 0 ? (
              <Row start style={{ flex: 1, flexWrap: 'wrap' }}>
                <CText
                  color={'#999'}
                  h5
                  w400
                  style={{ textDecorationLine: 'line-through' }}
                >
                  {`${formatMoneyVND(priceFormat.rootPrice, '.')}`}
                </CText>
                <CText h4 w600 color={'#ff3b30'} style={[screenStyles.mL5]}>
                  {`${formatMoneyVND(priceFormat.discountPrice, '.')}`}
                </CText>
              </Row>
            ) : (
              <Row start style={{ flex: 1, flexWrap: 'wrap' }}>
                <CText h4 w600 color={'#ff3b30'}>
                  {`${formatMoneyVND(priceFormat.rootPrice, '.')}`}
                </CText>
              </Row>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const renderContent = () => {
    if (loading) return <ServiceLoading />;
    return (
      <Container>
        <FlatList
          data={listChildService}
          extraData={listChildService}
          keyExtractor={keyExtractor}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ padding: 12, flexGrow: 1 }}
          renderItem={({ item }) => <ServiceCard item={item} />}
          scrollEventThrottle={isIOS ? 160 : 16}
          ListEmptyComponent={<CEmptyData />}
        />
      </Container>
    );
  };

  return (
    <Wrapper>
      <CHeader
        isBorderBottom={true}
        title={
          route.params?.parentService?.name ?? t('carely.service', 'Service')
        }
        rightComponentDisable
        leftComponentOnPress={navigation.goBack}
      />
      {renderContent()}
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  card: {
    width: '48%' as const,
    backgroundColor: '#fff',
    paddingVertical: 4,
  },
  image: {
    width: '100%' as const,
    height: ScreenWidth / 2,
    borderRadius: 10,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
  },
  content: {
    paddingVertical: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ff3b30',
  },
}));

export default ServicesScreen;
