import {
  AnimatedReadMore,
  IconType,
  IconX,
  ImageHelper,
  Toast,
  Wrapper,
} from '@/components';
import {
  calculateDistance,
  formatMoneyVND,
  getBottomSpace,
  getPackageByChannelId,
  ifIphoneX,
  images,
  MergedPackage,
  mergePackagesByChannel,
  parsePricePackage,
  ScreenHeight,
  screenStyles,
  ScreenWidth,
  showToast,
} from '@/configs';
import { AppContext } from '@/contexts';
import { getDetailPkgCarely, resetCarely } from '@/redux/slices/carelySlice';
import {
  getDetailChannel,
  resetChannelDetail,
} from '@/redux/slices/channelSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CEmptyData, CLoading, CScrollView, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Rating } from 'react-native-ratings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { mainRoute } from '@/constants';

const useStyles = makeStyles(({ colors }) => ({
  backBtnWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  chipWrapper: {
    marginTop: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.cF9FAFB,
  },
  backBtn: {
    position: 'absolute' as const,
    left: 16,
    zIndex: 1,
  },
  shareBtn: {
    position: 'absolute' as const,
    right: 16,
    zIndex: 1,
  },
  thumnailWrap: {
    width: ScreenWidth,
    height: ScreenHeight / 2.2,
    backgroundColor: 'black' as const,
  },
  layerBlur: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    left: 0,
    height: ScreenHeight / 3.6,
    justifyContent: 'flex-end' as const,
    zIndex: 1,
  },
  footerWrapper: {
    marginTop: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  btnWrapper: {
    backgroundColor: '#19A2A7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    ...screenStyles.centerWrap,
    borderRadius: 8,
  },
  optionWrap: {
    marginTop: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cF9FAFB,
  },
}));

const ServiceDetailScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const toastEl = useRef(null);
  const { user, isDoctor, currentLocation } = useContext(AppContext);

  const insets = useSafeAreaInsets();
  const isFocusScreen = useIsFocused();

  const dispatch = useAppDispatch();

  const { channelDetailData } = useAppSelector(state => state.channelReducer);
  const { carelyPackageData } = useAppSelector(state => state.carelyReducer);

  // -------------------------------
  // STATE
  // -------------------------------
  const [errorService, setErrorService] = useState(false);
  const [firstRender, setFirstRender] = useState(false);

  const [channelData, setChannelData] = useState<any>({});
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [showReview, setShowReview] = useState(false);

  // from deeplink
  const [serviceClient, setServiceClient] = useState(
    route.params?.service || {},
  );

  const [channelId] = useState(route.params?.channelId || '');
  const [packageId] = useState(route.params?.packageId || -1);

  const [myPackage, setMyPackage] = useState<MergedPackage>({
    channel_id: '',
    call_1vs1: 0,
    chat_1vs1: 0,
    is_book_service: 0,
    orders: [],
    expiredChat: true,
    expiredCall: true,
  });

  //loc package theo channel
  useEffect(() => {
    const processMergeChannelPackage = () => {
      const filteredPackages = (user.packages || []).filter(
        (item: any) => item.is_book_service !== 1,
      );
      const merged: MergedPackage[] = mergePackagesByChannel(filteredPackages);
      const result = getPackageByChannelId(merged, channelData.id);
      setMyPackage(result);
    };
    if (user.packages && channelData.id) {
      processMergeChannelPackage();
    }
  }, [user, channelData.id]);

  useEffect(() => {
    const detectInitData = () => {
      // const { service, channelId, packageId} = route.params;
      const service = route.params?.service || {};
      setServiceClient(service);
      const hasService = service?.channel_id;
      const hasDeepLink =
        typeof channelId === 'string' &&
        channelId.length > 0 &&
        packageId !== -1;
      // console.log('🚀 ~ detectInitData ~ hasDeepLink:', hasService);
      if (hasService) {
        setFirstRender(true);
        dispatch(getDetailChannel({ channelId: service.channel_id }));
      } else if (hasDeepLink) {
        setFirstRender(true);
        dispatch(getDetailChannel({ channelId: channelId }));
        dispatch(
          getDetailPkgCarely({
            channelId,
            packageId,
          }),
        );
      } else {
        setErrorService(true); // state để hiển thị UI lỗi
      }
    };
    if (route.params) {
      detectInitData();
    }
  }, [route.params]);

  useEffect(() => {
    const processAPIDetailChannel = () => {
      const { loading, data, error }: any = channelDetailData;
      if (!loading) {
        if (data) {
          const datachannel = data.result || {};
          setChannelData(datachannel);
          // Cheat goi tao room o day luon
          if (datachannel.id) {
            setIsOwner(
              (datachannel.manager?.id === user.id ||
                datachannel.owner_id === user.id) &&
                isDoctor,
            );
          }
          setFirstRender(false);
          dispatch(resetChannelDetail(null));
        } else if (error) {
          setFirstRender(false);
          dispatch(resetChannelDetail(null));
        }
      }
    };
    if (isFocusScreen) {
      processAPIDetailChannel();
    }
  }, [channelDetailData]);

  useEffect(() => {
    const processAPIDetailPackage = () => {
      const { loading, data, error }: any = carelyPackageData;
      if (!loading) {
        // console.log('🚀 ~ processAPIDetailPackage ~ data:', data);
        if (data) {
          const dataPkg = data.result || {};
          console.log('🚀 ~ processAPIDetailPackage ~ dataPkg:', dataPkg);
          setServiceClient(dataPkg);
          dispatch(resetCarely());
        } else if (error) {
          console.log('🚀 ~ processAPIDetailPackage ~ error:', error);
          setErrorService(true);
          dispatch(resetCarely());
        }
      }
    };
    processAPIDetailPackage();
  }, [carelyPackageData]);

  // -------------------------------
  // ACTION
  // -------------------------------
  const handleShare = () => {};

  const handleViewChannel = () => {
    // navigation.navigate(mainRoute.channelDetailScreen, {
    //   channelId: channelData.id,
    //   type: 'package',
    // });
  };

  const checkIsFreeBuyed = (packageItem: any) => {
    for (let i = 0; i < myPackage.orders.length; i++) {
      const order = myPackage.orders[i];
      if (order.id === packageItem.id) {
        return true;
      }
    }
    return false;
  };

  const handleBookNow = () => {
    if (channelData.id) {
      navigation.navigate(mainRoute.bookingScreen, {
        service: serviceClient,
        channelData,
      });
    } else {
      showToast(toastEl, 'Dịch vụ tạm thời không hoạt động!');
    }
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------

  const renderHeader = () => {
    return (
      <>
        <Pressable
          onPress={navigation.goBack}
          style={[styles.backBtn, { top: insets.top }]}
        >
          <View style={styles.backBtnWrapper}>
            <IconX
              type={IconType.FONTISTO}
              name={'angle-left'}
              size={16}
              color={colors.white}
            />
          </View>
        </Pressable>
        {!errorService && (
          <Pressable
            onPress={handleShare}
            style={[styles.shareBtn, { top: insets.top }]}
          >
            <View style={styles.backBtnWrapper}>
              <IconX
                type={IconType.ENTYPO}
                name={'share'}
                size={20}
                color={colors.white}
              />
            </View>
          </Pressable>
        )}
      </>
    );
  };

  const renderInfo = () => {
    const { name } = serviceClient;
    return (
      <View style={screenStyles.pH16}>
        <Row start>
          <CText color={colors.c101828} h3 w600>
            {name || ''}
          </CText>
        </Row>
      </View>
    );
  };

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.img_default}
        style={screenStyles.fillParent}
        resizeMode="cover"
      />
    );
  };

  const renderThumbnail = () => {
    return (
      <View style={styles.thumnailWrap}>
        <View style={screenStyles.flex1}>
          <ImageHelper
            source={{ uri: serviceClient?.thumbnail }}
            renderErrorImage={renderErrorImage}
            resizeMode={'cover'}
          />
        </View>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0.15)',
            'rgba(255,255,255,0.4)',
            'rgba(255,255,255,0.85)',
            'rgba(255,255,255,1)',
          ]}
          locations={[0, 0.25, 0.45, 0.7, 0.9, 1]}
          style={styles.layerBlur}
        >
          {renderInfo()}
        </LinearGradient>
      </View>
    );
  };

  const renderDecriptionAboutChannel = () => {
    if (channelData.description) {
      return (
        <View style={styles.chipWrapper}>
          <AnimatedReadMore
            text={channelData.description}
            numberOfLines={2}
            seeMoreText={t('common.seeMore', 'See more')}
            seeLessText={t('common.viewLess', 'View less')}
            seeStyle={{ color: colors.c98A2B3 }}
            txtColor={'#374151'}
          />
        </View>
      );
    }
  };

  const renderOption = (value: string) => {
    return (
      <View style={styles.optionWrap}>
        <Row start style={{ alignItems: 'flex-start' }}>
          <View
            style={{
              width: 26,
              height: 26,
              overflow: 'hidden',
            }}
          >
            <Image
              source={images.service.ic_h}
              resizeMode="cover"
              style={screenStyles.fillParent}
            />
          </View>
          <CText
            h5
            color={colors.c33353A}
            style={[screenStyles.mL8, { flexShrink: 1 }]}
          >
            {value}
          </CText>
        </Row>
      </View>
    );
  };

  const renderOtherInfo = () => {
    const { option1, option2, option3, option4, option5 } = serviceClient;
    if (option1 || option2 || option3 || option4 || option5) {
      return (
        <>
          <Row start style={screenStyles.mT12}>
            <CText color={colors.c101828} h5 w600>
              {t('carely.otherInfomation', 'Thông tin khác')}
            </CText>
          </Row>
          {option1 ? renderOption(option1) : null}
          {option2 ? renderOption(option2) : null}
          {option3 ? renderOption(option3) : null}
          {option4 ? renderOption(option4) : null}
          {option5 ? renderOption(option5) : null}
        </>
      );
    }
  };

  const renderInfo1 = () => {
    const { address, avg_value, total_ratings, distance, latitude, longitude } =
      serviceClient;
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
      <View
        style={[
          screenStyles.pH16,
          { backgroundColor: colors.white, paddingBottom: 12 },
        ]}
      >
        {channelData.name && (
          <Row start style={screenStyles.mT2}>
            <Pressable onPress={handleViewChannel}>
              <CText color={colors.c19A2A7} h46 w400>
                {channelData.name || ''}
              </CText>
            </Pressable>
          </Row>
        )}
        {address && (
          <Row start style={[screenStyles.mT5, { paddingRight: 12 }]}>
            <IconX
              type={IconType.IONICONS}
              name={'location'}
              size={20}
              color={colors.c667085}
            />
            <Row start>
              <CText color={colors.c667085} h5 style={screenStyles.mL5}>
                {address || ''}
              </CText>
            </Row>
          </Row>
        )}
        {numRating > 0 && (
          <Row start style={screenStyles.mT8}>
            <Pressable onPress={() => setShowReview(true)}>
              <Row start>
                <Rating
                  startingValue={5}
                  readonly
                  showRating={false}
                  imageSize={14}
                  jumpValue={0.5}
                  ratingColor={'#FDB022'}
                  ratingCount={1}
                />
                <CText style={screenStyles.mL5} color={'#374151'} h56 w500>
                  {numRating || 0}
                </CText>
                <CText style={screenStyles.mL5} color={colors.cEAECF0} h56>
                  {'|'}
                </CText>
                <CText color={'#374151'} h56 style={screenStyles.mL5}>
                  {`${t('course.review', 'Review')} (${totalRating})`}
                </CText>
              </Row>
            </Pressable>
          </Row>
        )}
        {distanceKm != null && distanceKm > 0 && (
          <>
            <Row start style={screenStyles.mT5}>
              <IconX
                type={IconType.MATERIAL_ICONS}
                name={'share-location'}
                size={14}
                color={colors.c19A2A7}
              />
              <CText color={colors.c19A2A7} h56 w500 style={screenStyles.mL5}>
                {`${distanceKm}km`}
              </CText>
            </Row>
            <CText color={colors.c667085} h6 w400 style={screenStyles.mL20}>
              {`(Khoảng cách đến nhà cung cấp dịch vụ)`}
            </CText>
          </>
        )}
        {renderDecriptionAboutChannel()}
      </View>
    );
  };

  const renderDecriptionSession = () => {
    const { time_package, description, radius } = serviceClient;
    const timeService = time_package ? time_package : 0;
    return (
      <View
        style={{
          marginTop: 8,
          borderRadius: 4,
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: colors.white,
        }}
      >
        <Row start style={screenStyles.mT5}>
          <CText color={colors.c101828} h5 w600>
            {t('carely.serviceDescription', 'Mô tả dịch vụ')}
          </CText>
        </Row>
        <View
          style={{
            marginTop: 8,
            borderRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: colors.cF9FAFB,
          }}
        >
          <CText
            h5
            color={colors.c33353A}
            style={[screenStyles.mL5, { flexShrink: 1 }]}
          >
            {description || t('common.noDataAvailable', 'No data available')}
          </CText>
        </View>
        {/* Thoi gian */}
        <Row start style={screenStyles.mT12}>
          <CText color={colors.c101828} h5 w600>
            {t('carely.serviceDuration', 'Thời gian thực hiện dịch vụ')}
          </CText>
        </Row>
        <View
          style={{
            marginTop: 8,
            borderRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: colors.cF9FAFB,
          }}
        >
          <Row start>
            <IconX
              type={IconType.FONTISTO}
              name={'clock'}
              size={16}
              color={colors.c101828}
            />
            <CText color={colors.c101828} h5 w400 style={screenStyles.mL5}>
              {timeService +
                ' ' +
                (timeService > 1 ? t('common.minutes') : t('common.minute'))}
            </CText>
          </Row>
        </View>
        {/* Ban kinh phuc vu */}
        {radius && (
          <>
            <Row start style={screenStyles.mT12}>
              <CText color={colors.c101828} h5 w600>
                {t('carely.serviceArea', 'Phạm vi phục vụ')}
              </CText>
            </Row>
            <View
              style={{
                marginTop: 8,
                borderRadius: 4,
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: colors.cF9FAFB,
              }}
            >
              <Row start>
                <IconX
                  type={IconType.MATERIAL_ICONS}
                  name={'share-location'}
                  size={16}
                  color={colors.c101828}
                />
                <CText color={colors.c101828} h5 w400 style={screenStyles.mL5}>
                  {`${radius}km`}
                </CText>
              </Row>
            </View>
          </>
        )}
        {/* Thong tin khac */}
        {renderOtherInfo()}
      </View>
    );
  };

  const renderFooter = () => {
    const { price, discount } = serviceClient;
    const priceFormat = parsePricePackage(price, discount);
    let isFreeBuyed = false;
    if (priceFormat.rootPrice === 0) {
      // Cho nay dang bi thieu truong hop booking carely se khong vao userProfile order
      isFreeBuyed = checkIsFreeBuyed(serviceClient);
    }
    return (
      <View style={styles.footerWrapper}>
        <View>
          <Row start>
            <CText color={colors.c101828} h5 w400>
              {t('carely.packageValue', 'Giá trị gói')}
            </CText>
          </Row>
          {priceFormat.discountPrice > 0 ? (
            <Row start style={screenStyles.mT5}>
              <CText h3 w600 color={colors.cF04438}>
                {formatMoneyVND(priceFormat.discountPrice, '.')}
              </CText>
            </Row>
          ) : (
            <Row start style={screenStyles.mT5}>
              <CText h3 w600 color={colors.cF04438}>
                {`${formatMoneyVND(priceFormat.rootPrice, '.')}`}
              </CText>
            </Row>
          )}
        </View>
        {!isOwner && !isDoctor && (
          <View style={screenStyles.mT10}>
            {!isFreeBuyed ? (
              <Pressable style={styles.btnWrapper} onPress={handleBookNow}>
                <CText color={colors.white} h5 w500>
                  {t('carely.bookNow', 'Đặt lịch ngay')}
                </CText>
              </Pressable>
            ) : (
              <CText h5 w500 color={'#2F80ED'}>
                {t('package.freeActive', 'Đang sở hữu')}
              </CText>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderBody = () => {
    if (firstRender) {
      return <CLoading />;
    }
    if (errorService) {
      return (
        <CEmptyData
          title={t(
            'package.noLongerAvailable',
            'Gói dịch vụ này hiện không còn khả dụng.',
          )}
        />
      );
    } else {
      return (
        <CScrollView
          contentContainerStyle={{
            backgroundColor: colors.cF9FAFB,
            paddingBottom: getBottomSpace() + ifIphoneX(5, 10),
          }}
        >
          {renderThumbnail()}
          {renderInfo1()}
          {renderDecriptionSession()}
          {renderFooter()}
        </CScrollView>
      );
    }
  };

  return (
    <Wrapper>
      {renderHeader()}
      {renderBody()}
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

export default ServiceDetailScreen;
