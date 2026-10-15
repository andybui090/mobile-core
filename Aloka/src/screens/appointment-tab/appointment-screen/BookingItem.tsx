import { IconType, IconX, ImageHelper } from '@/components';
import {
  formatISOToVietnameseDate,
  formatTimeRangeWithDurationFromISO,
  images,
  screenStyles,
  ScreenWidth,
} from '@/configs';
import i18n from '@/i18n';
import { useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { STATUS_COLORS, statusAppoinment } from '.';
dayjs.extend(duration);

interface BookingItemProps {
  item: any;
  user: any;
  onCompleteRoom: () => void;
  onCancelBooking: (id: any, isViewByDoctor: boolean) => void;
  onChatNurse: (item: any) => void;
  onGoToLocation: (id: any) => void;
  onGoEnd: (id: any) => void;
  onContactSupport: () => void;
}

const useStyles = makeStyles(({ colors }) => ({
  card: {
    paddingHorizontal: 16,
    borderTopWidth: 6,
    borderTopColor: colors.cF2F4F7,
    paddingVertical: 12,
  },
  topWrap: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.cF9FAFB,
  },
  btnBasic: {
    borderRadius: 6,
    paddingVertical: 9,
    minWidth: ScreenWidth / 3,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flex: 1,
  },
  page1TopWrap: {
    borderRadius: 8,
    borderColor: colors.cEAECF0,
    borderWidth: 1,
    overflow: 'hidden' as const,
  },
  thumn: {
    width: 60,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cEAECF0,
  },
  bodyWrap: {
    backgroundColor: colors.white,
    ...screenStyles.pH14,
  },
}));

const BookingItem: React.FC<BookingItemProps> = ({
  item,
  user,
  onCompleteRoom,
  onCancelBooking,
  onChatNurse,
  onGoToLocation,
  onGoEnd,
  onContactSupport,
}) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  const { t } = useTranslation();

  const { firebaseConfig } = useAppSelector(state => state.globalReducer);

  const {
    doctor,
    date,
    doctor_id,
    user: userBooking,
    id,
    note,
    type,
    package: packageInfo,
    duration,
    address,
    status,
  } = item;
  //   console.log("🚀 ~ BookingItem ~ item:", item)
  const isViewByDoctor = doctor_id == user.id;
  const dateShow = formatISOToVietnameseDate(
    date,
    i18n.language === 'vi' ? 'vi' : 'en',
    t,
  );
  const timeShow1 =
    formatTimeRangeWithDurationFromISO(date, duration || 0) || '';
  const showChat = !isViewByDoctor && doctor?.id && packageInfo?.id && item?.id;
  // Thời gian join room
  const [canJoin, setCanJoin] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [canCancel, setCanCancel] = useState(false);

  const isOffline = type === 'OFFLINE';

  useEffect(() => {
    if (!date) return;
    const appointmentTime = dayjs(date);

    const interval = setInterval(() => {
      const now = dayjs();
      const diffMs = appointmentTime.diff(now); // ms
      const diffMinutes = appointmentTime.diff(now, 'minute', true);
      // const pastMinutes = now.diff(appointmentTime, "minute", true);
      // ===== OFFLINE =====
      if (isOffline) {
        if (diffMinutes > 0) {
          // Trước giờ hẹn
          setShowComplete(false);
          setCanJoin(false);
          setCanCancel(diffMinutes > 30);

          const d = dayjs.duration(diffMs);
          const h = String(d.hours()).padStart(2, '0');
          const m = String(d.minutes()).padStart(2, '0');
          const s = String(d.seconds()).padStart(2, '0');
          setCountdown(`${h}:${m}:${s}`);
        } else {
          // Đến giờ hoặc sau giờ
          setShowComplete(true);
          setCanJoin(false);
          setCanCancel(false);
          setCountdown('');
        }
        return;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [date, isOffline, firebaseConfig.isAllowCall]);

  const renderErrorImage = () => {
    return (
      <Image
        source={images.bottomTab.carely}
        style={screenStyles.box30}
        resizeMode="contain"
      />
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.page1TopWrap}>
        <View style={styles.topWrap}>
          <Row start style={[{ alignItems: 'flex-start' }]}>
            <View style={styles.thumn}>
              <ImageHelper
                source={{ uri: packageInfo?.thumbnail || '' }}
                renderErrorImage={renderErrorImage}
                resizeMode={'cover'}
              />
            </View>
            <View style={screenStyles.mL10}>
              {packageInfo?.name?.toString().trim() && (
                <CText h4 w500 color={colors.c1D2939}>
                  {packageInfo?.name?.toString().trim()}
                </CText>
              )}
              <CText
                h5
                color={colors.c98A2B3}
                style={[screenStyles.mT2, { flexShrink: 1 }]}
                numberOfLines={2}
              >
                {isViewByDoctor
                  ? userBooking.full_name || ''
                  : doctor.full_name || ''}
              </CText>
            </View>
          </Row>
        </View>
        <View style={styles.bodyWrap}>
          {/* Lien he dieu duong */}
          {showChat && (
            <Row start style={screenStyles.pV10}>
              <Pressable
                style={screenStyles.rowCenter}
                onPress={() => onChatNurse(item)}
              >
                <Image
                  source={images.service.ic_chat}
                  style={screenStyles.box18}
                  resizeMode="contain"
                />
                <CText h5 color={colors.c101828} style={screenStyles.mL5}>
                  {t('carely.contactNurse', 'Liên hệ điều dưỡng')}
                </CText>
              </Pressable>
            </Row>
          )}
          <Divider color={colors.cF2F4F7} width={1} />
          {/* Ghi chu */}
          <Row start style={screenStyles.pV10}>
            <Row start>
              <IconX
                type={IconType.MATERIAL_DESIGN_ICONS}
                name={'note-outline'}
                size={16}
                color={colors.c101828}
              />
              <CText h5 color={colors.c101828} style={screenStyles.mL5}>{`${t(
                'package.consultationNote',
              )}: ${note || '---'}`}</CText>
            </Row>
          </Row>
          <Divider color={colors.cF2F4F7} width={1} />
          {/* Thoi gian, dia diem */}
          <Row start style={screenStyles.mT10}>
            <Image
              source={images.service.ic_calendar}
              style={screenStyles.box16}
              resizeMode="contain"
            />
            <CText h5 color={colors.c1D2939} style={screenStyles.mL5}>
              {dateShow}
            </CText>
          </Row>
          <Row start style={screenStyles.mT10}>
            <Image
              source={images.service.ic_clock}
              style={screenStyles.box16}
              resizeMode="contain"
            />
            <CText h5 color={colors.c1D2939} style={screenStyles.mL5}>
              {timeShow1}
            </CText>
          </Row>
          <Row
            start
            style={[
              screenStyles.mT10,
              { alignItems: 'flex-start', paddingRight: 10 },
            ]}
          >
            <Image
              source={images.service.ic_location}
              style={screenStyles.box16}
              resizeMode="contain"
            />
            <CText h5 color={colors.c1D2939} style={screenStyles.mL5}>
              {address || '---'}
            </CText>
          </Row>
          <View style={screenStyles.pV12}>
            {/* OFFLINE */}
            <>
              {/* Countdown trước giờ */}
              {!showComplete && countdown ? (
                <Row start style={screenStyles.pB12}>
                  <CText h5 color={colors.c667085}>
                    {countdown}
                  </CText>
                </Row>
              ) : null}
              {/* Phien ban 2 */}
              {status == statusAppoinment.CONFIRMED && isViewByDoctor && (
                <Row between style={[{ gap: 12 }]}>
                  <Pressable
                    style={[
                      styles.btnBasic,
                      {
                        flexDirection: 'row',
                        backgroundColor: colors.c19A2A7,
                      },
                    ]}
                    onPress={() => onGoToLocation(id)}
                  >
                    <IconX
                      type={IconType.FONTISTO}
                      name={'map'}
                      size={16}
                      color={colors.white}
                    />
                    <CText
                      h56
                      w500
                      color={colors.white}
                      style={screenStyles.mL8}
                    >
                      {t('booking.goToAppointment', 'Đi đến điểm hẹn')}
                    </CText>
                  </Pressable>
                </Row>
              )}
              {status == statusAppoinment.ON_THE_WAY && isViewByDoctor && (
                <Row between style={[{ gap: 12 }]}>
                  <Pressable
                    style={[
                      styles.btnBasic,
                      {
                        flexDirection: 'row',
                        backgroundColor: colors.c19A2A7,
                      },
                    ]}
                    onPress={() => onGoEnd(id)}
                  >
                    <IconX
                      type={IconType.ENTYPO}
                      name={'location'}
                      size={16}
                      color={colors.white}
                    />
                    <CText
                      h56
                      w500
                      color={colors.white}
                      style={screenStyles.mL8}
                    >
                      {t('booking.confirmArrival', 'Xác nhận đã đến điểm hẹn')}
                    </CText>
                  </Pressable>
                </Row>
              )}
              {status == statusAppoinment.ARRIVED && isViewByDoctor && (
                <Row between style={[{ gap: 12 }]}>
                  <Pressable
                    style={[
                      styles.btnBasic,
                      { backgroundColor: colors.c19A2A7, flexDirection: 'row' },
                    ]}
                    onPress={onCompleteRoom}
                  >
                    <IconX
                      type={IconType.IONICONS}
                      name={'checkmark-done'}
                      size={18}
                      color={colors.white}
                    />
                    <CText
                      h56
                      w500
                      color={colors.white}
                      style={screenStyles.mL8}
                    >
                      {t('appointment.markAsComplete', 'Mark as Complete')}
                    </CText>
                  </Pressable>
                </Row>
              )}
              {!isViewByDoctor && (
                <Row between style={[{ gap: 12 }]}>
                  <Pressable
                    style={[
                      styles.btnBasic,
                      {
                        backgroundColor: colors.white,
                        borderWidth: 1,
                        borderColor: colors.c19A2A7,
                        flex: 1,
                        flexDirection: 'row',
                      },
                    ]}
                    onPress={onContactSupport}
                  >
                    <IconX
                      type={IconType.MATERIAL_ICONS}
                      name={'support-agent'}
                      size={16}
                      color={colors.c19A2A7}
                    />
                    <CText
                      h56
                      w500
                      color={colors.c19A2A7}
                      style={screenStyles.mL8}
                    >
                      {t('appointment.contactSupport', 'Liên hệ CSKH')}
                    </CText>
                  </Pressable>
                </Row>
              )}
            </>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BookingItem;
