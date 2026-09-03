import {ImageHelper} from '@/components';
import {
  calculateDistance,
  formatMoneyVND,
  ifIphoneX,
  images,
  isIOS,
  keyExtractor,
  parsePricePackage,
  screenStyles,
  ScreenWidth,
} from '@/configs';
import {CEmptyData, CText, Row} from '@/utils';
import {makeStyles, useTheme} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  View,
} from 'react-native';
import {ServiceLoading} from './ServiceLoading';
import {Rating} from 'react-native-ratings';
import {useContext} from 'react';
import {AppContext} from '@/contexts';

const useStyles = makeStyles(({colors}) => ({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    paddingVertical: 4,
  },
  image: {
    width: '100%' as const,
    height: ScreenWidth / 2,
    borderRadius: 4,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
  },
  content: {
    paddingVertical: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ff3b30',
  },
}));

const CarelyServicesSearch = (props: any) => {
  const {
    theme: {colors},
  } = useTheme();
  const styles = useStyles();
  const {t} = useTranslation();

  const {currentLocation} = useContext(AppContext);
  //
  const {
    loading,
    listData,
    onLoadMore,
    finalLoad,
    onEndReached,
    setOnEndReached,
    onPressItem,
  } = props;

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.img_default}
        style={{width: '80%', height: '80%'}}
        resizeMode="contain"
      />
    );
  };

  const _renderSearchResultsFooter = () => {
    return !finalLoad && !onEndReached ? (
      <View
        style={[
          screenStyles.centerWrap,
          {paddingBottom: ifIphoneX(20, 10), paddingTop: 5},
        ]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    ) : null;
  };

  const ServiceCard = ({item}: any) => {
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
      <Pressable style={styles.card} onPress={() => onPressItem(item)}>
        <View style={styles.image}>
          <ImageHelper
            source={{uri: thumbnail}}
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
              <CText style={screenStyles.mL5} color={colors.cEAECF0} h56 w500>
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
              <Row start style={{flex: 1, flexWrap: 'wrap'}}>
                <CText
                  color={'#999'}
                  h5
                  w400
                  style={{textDecorationLine: 'line-through'}}>
                  {`${formatMoneyVND(priceFormat.rootPrice, '.')}`}
                </CText>
                <CText h4 w600 color={'#ff3b30'} style={[screenStyles.mL5]}>
                  {`${formatMoneyVND(priceFormat.discountPrice, '.')}`}
                </CText>
              </Row>
            ) : (
              <Row start style={{flex: 1, flexWrap: 'wrap'}}>
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

  const renderList = () => {
    if (loading) {
      return <ServiceLoading />;
    }
    return (
      <FlatList
        data={listData}
        extraData={listData}
        keyExtractor={keyExtractor}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        contentContainerStyle={{paddingHorizontal: 12, flexGrow: 1}}
        renderItem={({item}) => <ServiceCard item={item} />}
        scrollEventThrottle={isIOS ? 160 : 16}
        ListEmptyComponent={<CEmptyData />}
        ListFooterComponent={_renderSearchResultsFooter}
        onMomentumScrollBegin={() => setOnEndReached(false)}
        onEndReached={onLoadMore}
      />
    );
  };
  return (
    <>
      <View style={[screenStyles.pH14, screenStyles.pV12]}>
        <CText h46 w600 color={colors.c101828}>
          {t('carely.service', 'Service')}
        </CText>
      </View>
      {renderList()}
    </>
  );
};

export default CarelyServicesSearch;
