import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconX, ImageHelper } from '@/components';
import { formatMoneyVND } from '@/configs/common';
import { images } from '@/configs/image';
import { homeTabRoute, accountTabRoute } from '@/constants';
import { CText, Row } from '@/utils';
import { onShare } from '@/utils/shareHelper';

const { width, height } = Dimensions.get('window');
const THUMBNAIL_HEIGHT = Math.round(height / 2.2);
const GRADIENT_HEIGHT = Math.round(height / 3.6);

export const ServiceDetail: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const service = route.params?.service || {};

  const title = service?.name || '';
  const channelName =
    service?.channel?.name ||
    service?.channel_name ||
    '';

  const channelDescription =
    service?.channel?.description || service?.channel_description || '';

  const location =
    service?.address ||
    service?.doctor?.address ||
    service?.location?.address ||
    '';

  const numRating = service?.avg_value ? Number(service.avg_value) : 0;
  const rating = numRating > 0 ? numRating.toFixed(1) : '';
  const reviewCount = service?.total_ratings || 0;

  const distanceKm =
    service?.distance != null && service?.distance !== ''
      ? Number(service.distance).toFixed(2)
      : null;

  const rawDuration =
    service?.time_package != null && service?.time_package !== ''
      ? Number(service.time_package)
      : service?.duration != null && service?.duration !== ''
        ? Number(service.duration)
        : null;

  const durationText =
    rawDuration != null && rawDuration > 0
      ? rawDuration < 24
        ? `${rawDuration * 60} phút`
        : `${rawDuration} phút`
      : '';

  const radiusKm =
    service?.radius != null && service?.radius !== ''
      ? Number(service.radius)
      : null;

  const price = service?.price ?? service?.package?.price ?? 0;
  const priceFormatted = `${formatMoneyVND(price, '.')}đ`;

  const bannerSource = service?.thumbnail
    ? { uri: service.thumbnail }
    : images.common.img_default;

  const description = service?.description || '';

  const options = [
    service?.option1,
    service?.option2,
    service?.option3,
    service?.option4,
    service?.option5,
  ].filter(Boolean);

  const handleBookNow = () => {
    navigation.navigate(homeTabRoute.bookingSchedule, {
      service,
      channelData: service?.channel || (channelName ? { name: channelName } : undefined),
    });
  };

  const handleViewChannel = () => {
    const channelId =
      service?.channel_id || service?.channel?.id || service?.channel?._id;
    if (channelId) {
      navigation.navigate(accountTabRoute.partnerProfileScreen, { channelId });
    }
  };

  // 1. Top floating buttons: Back & Share
  const renderHeader = () => (
    <>
      <TouchableOpacity
        style={[styles.backBtn, { top: (insets.top || 16) + 4 }]}
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backBtnWrapper}>
          <IconX type="fontisto" name="angle-left" size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.shareBtn, { top: (insets.top || 16) + 4 }]}
        activeOpacity={0.7}
        onPress={() =>
          onShare({
            title: title || 'Aloka',
            message: title ? `${title}${channelName ? ` - ${channelName}` : ''}` : undefined,
          })
        }
      >
        <View style={styles.backBtnWrapper}>
          <IconX type="entypo" name="share" size={18} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </>
  );

  // 2. Banner hero image with SVG smooth linear gradient and title inside overlay
  const renderThumbnail = () => {
    const gradientH = GRADIENT_HEIGHT + 6;
    return (
      <View style={styles.thumbnailWrap}>
        <ImageHelper
          source={bannerSource}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <View style={styles.layerBlur}>
          <Svg
            width={width}
            height={gradientH}
            style={StyleSheet.absoluteFill}
          >
            <Defs>
              <SvgLinearGradient id="gradBlur" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0} />
                <Stop offset="25%" stopColor="#FFFFFF" stopOpacity={0.05} />
                <Stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.15} />
                <Stop offset="70%" stopColor="#FFFFFF" stopOpacity={0.4} />
                <Stop offset="85%" stopColor="#FFFFFF" stopOpacity={0.85} />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={1} />
              </SvgLinearGradient>
            </Defs>
            <Rect x={0} y={0} width={width} height={gradientH} fill="url(#gradBlur)" />
          </Svg>
          {Boolean(title) && (
            <View style={styles.titleWrap}>
              <Row start>
                <CText color="#101828" h3 w600 numberOfLines={2}>
                  {title}
                </CText>
              </Row>
            </View>
          )}
        </View>
      </View>
    );
  };

  // 3. Info 1: Channel Name, Address, Rating, Distance
  const renderInfo1 = () => {
    const hasAnyInfo =
      Boolean(channelName) ||
      Boolean(location) ||
      numRating > 0 ||
      Boolean(distanceKm && Number(distanceKm) > 0) ||
      Boolean(channelDescription);

    if (!hasAnyInfo) {
      return null;
    }

    return (
      <View style={styles.info1Section}>
        {Boolean(channelName) && (
          <Row start style={{ marginTop: 2 }}>
            <Pressable onPress={handleViewChannel}>
              <CText color="#19A2A7" h46 w400>
                {channelName}
              </CText>
            </Pressable>
          </Row>
        )}

        {Boolean(location) && (
          <Row start style={{ marginTop: 5, paddingRight: 12 }}>
            <IconX type="ionicons" name="location-outline" size={13} color="#667085" />
            <CText color="#667085" h5 style={{ marginLeft: 5 }}>
              {location}
            </CText>
          </Row>
        )}

        {numRating > 0 && (
          <Row start style={{ marginTop: 8 }}>
            <IconX type="ionicons" name="star" size={14} color="#FDB022" />
            <CText color="#374151" h56 w500 style={{ marginLeft: 5 }}>
              {rating}
            </CText>
            <CText color="#EAECF0" h56 style={{ marginLeft: 6 }}>
              {'|'}
            </CText>
            <CText color="#374151" h56 style={{ marginLeft: 6 }}>
              {`Đánh giá (${reviewCount})`}
            </CText>
          </Row>
        )}

        {Boolean(distanceKm && Number(distanceKm) > 0) && (
          <View style={{ marginTop: 6 }}>
            <Row start>
              <IconX type="ionicons" name="locate-outline" size={15} color="#19A2A7" />
              <CText color="#19A2A7" h56 w500 style={{ marginLeft: 5 }}>
                {`${distanceKm}km`}
              </CText>
            </Row>
            <CText color="#667085" h6 style={{ marginLeft: 20, marginTop: 2 }}>
              (Khoảng cách đến nhà cung cấp dịch vụ)
            </CText>
          </View>
        )}

        {Boolean(channelDescription) && (
          <View style={styles.chipWrapper}>
            <CText color="#374151" h5 numberOfLines={2}>
              {channelDescription}
            </CText>
          </View>
        )}
      </View>
    );
  };

  // 4. Description section: Mô tả, Thời gian, Phạm vi phục vụ, Thông tin khác
  const renderDescriptionSession = () => (
    <View style={styles.descriptionSection}>
      <Row start style={{ marginTop: 5 }}>
        <CText color="#101828" h5 w600>
          Mô tả dịch vụ
        </CText>
      </Row>
      <View style={styles.grayBox}>
        <CText color="#33353A" h5 style={{ flexShrink: 1 }}>
          {description || 'Chưa có thông tin'}
        </CText>
      </View>

      {/* Thời gian thực hiện */}
      {Boolean(durationText) && (
        <>
          <Row start style={{ marginTop: 12 }}>
            <CText color="#101828" h5 w600>
              Thời gian thực hiện dịch vụ
            </CText>
          </Row>
          <View style={styles.grayBox}>
            <Row start>
              <IconX type="ionicons" name="time-outline" size={16} color="#101828" />
              <CText color="#101828" h5 w400 style={{ marginLeft: 6 }}>
                {durationText}
              </CText>
            </Row>
          </View>
        </>
      )}

      {/* Phạm vi phục vụ */}
      {Boolean(radiusKm && radiusKm > 0) && (
        <>
          <Row start style={{ marginTop: 12 }}>
            <CText color="#101828" h5 w600>
              Phạm vi phục vụ
            </CText>
          </Row>
          <View style={styles.grayBox}>
            <Row start>
              <IconX type="materialicons" name="share-location" size={16} color="#101828" />
              <CText color="#101828" h5 w400 style={{ marginLeft: 6 }}>
                {`${radiusKm}km`}
              </CText>
            </Row>
          </View>
        </>
      )}

      {/* Thông tin khác */}
      {Boolean(options.length > 0) && (
        <>
          <Row start style={{ marginTop: 12 }}>
            <CText color="#101828" h5 w600>
              Thông tin khác
            </CText>
          </Row>
          {options.map((opt, idx) => (
            <View key={idx} style={styles.grayBox}>
              <CText color="#33353A" h5 style={{ flexShrink: 1 }}>
                {opt}
              </CText>
            </View>
          ))}
        </>
      )}
    </View>
  );

  // 5. Footer: Giá trị gói & Button Đặt lịch ngay
  const renderFooter = () => (
    <View style={styles.footerWrapper}>
      <View>
        <Row start>
          <CText color="#101828" h5 w400>
            Giá trị gói
          </CText>
        </Row>
        <Row start style={{ marginTop: 5 }}>
          <CText h3 w600 color="#F04438">
            {priceFormatted}
          </CText>
        </Row>
      </View>
      <TouchableOpacity
        style={styles.btnWrapper}
        activeOpacity={0.8}
        onPress={handleBookNow}
      >
        <CText color="#FFFFFF" h5 w500>
          Đặt lịch ngay
        </CText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (insets.bottom || 16) + 12 },
        ]}
      >
        {renderThumbnail()}
        {renderInfo1()}
        {renderDescriptionSession()}
        {renderFooter()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    backgroundColor: '#F9FAFB',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  shareBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
  backBtnWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailWrap: {
    width,
    height: THUMBNAIL_HEIGHT,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  layerBlur: {
    position: 'absolute',
    bottom: -2,
    right: 0,
    left: 0,
    height: GRADIENT_HEIGHT + 6,
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  titleWrap: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    zIndex: 2,
  },
  info1Section: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: -2,
  },
  chipWrapper: {
    marginTop: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  descriptionSection: {
    marginTop: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  grayBox: {
    marginTop: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  footerWrapper: {
    marginTop: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnWrapper: {
    backgroundColor: '#19A2A7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ServiceDetail;
