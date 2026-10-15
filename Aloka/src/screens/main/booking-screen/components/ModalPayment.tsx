import { APILoading, IconType, IconX, ImageHelper, Toast } from '@/components';
import {
  formatDateCarely,
  formatMoneyVND,
  formatTimeRangeWithDuration,
  images,
  isEmptyArray,
  logError,
  parsePricePackage,
  screenStyles,
  showToast,
} from '@/configs';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CScrollView, CText, Row } from '@/utils';
import { Divider, ScreenWidth } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import PaymentMethod from './PaymentMethod';
import { useEffect, useRef, useState } from 'react';
import {
  postBuyPackageChannel,
  resetPackageChannel,
} from '@/redux/slices/channelSlice';
import moment from 'moment';
import i18n from '@/i18n';
import { ModalSheetDetailJob } from './ModalSheetDetailJob';
import { storeObjectData } from '@/storages';
import { STORAGEKEY } from '@/constants';
import ModalVoucher from './ModalVoucher';
import ApiService from '@/services/api-base';
import ConfirmModal from '../ConfirmModal';

type BuyPackageProps = {
  isVisible: boolean;
  hideModal: () => void;
  dataDetailPackage: any;
  typeShow: number;
  paymentResult: any;
  updateTypeShow: (typeShow: number) => void;
  hideWithPayCode: () => void;
  // showVoucherSuccess: any;
  // chooseVoucher: () => void;
  channelName?: string;
  selectedDate: any;
  selectedTime?: any;
  bookingAddress?: string;
  setCurrentOrderId: any;
  // setShowVoucherSuccess: any;
  hideModalFreeWithVoucher: any;
};

export const enum PaymentTypes {
  momo = 'MoMo',
  VNPAY = 'VNPAY',
  VNPAY_INTCARD = 'VNPAY_INTCARD',
  VNPAYQR = 'VNPAYQR',
}

export const ModalPayment = ({
  isVisible,
  hideModal,
  dataDetailPackage,
  typeShow,
  paymentResult,
  updateTypeShow,
  hideWithPayCode,
  // showVoucherSuccess,
  // chooseVoucher,
  channelName,
  selectedDate,
  selectedTime,
  bookingAddress,
  setCurrentOrderId,
  hideModalFreeWithVoucher,
}: // setShowVoucherSuccess,
BuyPackageProps) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const toastEl = useRef<any>(null);
  // const bottomSheetViewJobRef = useRef<any>(null);

  const [visibleDetail, setVisibleDetail] = useState(false);

  const { dataBuyPackage } = useAppSelector(state => state.channelReducer);

  const [paymentType, setPaymentType] = useState<PaymentTypes>(
    PaymentTypes.momo,
  );
  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const [showVoucherSuccess, setShowVoucherSuccess] = useState<any>(null);

  const [isVisibleModalVoucher, setIsVisibleModalVoucher] =
    useState<boolean>(false);

  const [dataVoucherApply, setDataVoucherApply] = useState<any>({});

  const [modalConfirm, setModalConfirm] = useState({
    isVisible: false,
    message: '',
    onCancel: () => {},
    onConfirm: () => {},
  });

  const checkAutoApplyVoucher = async () => {
    try {
      const packageId = dataDetailPackage?.id;
      if (!packageId) return;

      const res: any = await ApiService.getVoucherByPackage({
        package_id: packageId,
      });
      if (res?.status === 200 || res?.status === 201) {
        const result: any = res?.data?.result || {};
        setDataVoucherApply(result?.code ? result : {});
      }
    } catch (error) {
      setDataVoucherApply({});
      console.log('checkAutoApplyVoucher error:', error);
    }
  };

  useEffect(() => {
    const processAPIBuyPackage = async () => {
      const { loading, data, error } = dataBuyPackage;
      if (!loading) {
        if (data) {
          const { msg }: any = data;
          console.log('🚀 ~ carely processAPIBuyPackage ~ msg:', msg);
          if (msg && msg.result?.payUrl) {
            setCurrentOrderId(msg.result?.order_id || '');
            if (paymentType === PaymentTypes.VNPAYQR) {
              storeObjectData(STORAGEKEY.PAYMENT_PENDING_KEY, {
                packageId: dataDetailPackage?.id,
                orderId: msg.result?.order_id,
                time: Date.now(),
              });
            }
            Linking.openURL(msg.result?.payUrl);
            setShowAlert(false);
            setIsLoadingAPI(false);
          } else {
            if (msg && msg.result?.order_id) {
              setShowAlert(false);
              setIsLoadingAPI(false);
              if (showVoucherSuccess?.voucher?.code) {
                hideModal();
                setTimeout(() => {
                  hideModalFreeWithVoucher(
                    msg.result?.order_id,
                    showVoucherSuccess,
                  );
                  setShowVoucherSuccess(null);
                }, 500);
              } else {
                hideModal();
              }
            } else {
              showToast(toastEl, t('course.payment.invalid', 'Invalid price'));
              setShowAlert(false);
              setIsLoadingAPI(false);
            }
          }
          dispatch(resetPackageChannel());
        } else if (error) {
          // cho nay kiem tra loi voucher trung, goi y ma voucher khac cho user neu o
          const { errors } = error;
          const isVoucherUsedError =
            !isEmptyArray(errors) &&
            errors.some(
              (item: any) =>
                item.key === 'code' &&
                dataVoucherApply?.code &&
                showVoucherSuccess?.voucher?.code,
            );

          setShowAlert(false);
          setIsLoadingAPI(false);
          dispatch(resetPackageChannel());

          if (isVoucherUsedError) {
            setModalConfirm({
              isVisible: true,
              message: t(
                'voucher.suggestMsg',
                'Mã giảm giá này vừa được sử dụng. Chúng tôi sẽ tìm và đề xuất mã khác phù hợp cho bạn.',
              ),
              onCancel: () => {
                setModalConfirm({
                  isVisible: false,
                  message: '',
                  onCancel: () => {},
                  onConfirm: () => {},
                });
              },
              onConfirm: () => {
                setModalConfirm({
                  isVisible: false,
                  message: '',
                  onCancel: () => {},
                  onConfirm: () => {},
                });

                setShowVoucherSuccess(null);
                setDataVoucherApply({});

                setTimeout(() => {
                  checkAutoApplyVoucher();
                }, 300);
              },
            });
            return;
          }

          showToast(toastEl, logError(error));
        }
      }
    };
    processAPIBuyPackage();
  }, [dataBuyPackage]);

  useEffect(() => {
    if (dataDetailPackage?.id) {
      checkAutoApplyVoucher();
    }
  }, [dataDetailPackage?.id]);

  //ACTION
  const handleBuyPackage = () => {
    if (dataDetailPackage?.id) {
      setShowAlert(true);
      setIsLoadingAPI(true);
      setTimeout(() => {
        const params: any = {
          package_id: dataDetailPackage?.id,
          payment: paymentType,
        };
        if (
          showVoucherSuccess != null &&
          showVoucherSuccess?.voucher?.code != null
        ) {
          params.code = showVoucherSuccess?.voucher?.code;
          // params.code = 'PAK113BOTFNAJ';
        }
        dispatch(postBuyPackageChannel(params));
      }, 200);
    }
  };

  const handleChoosePaymentType = (type: PaymentTypes) => {
    if (type != paymentType) {
      setPaymentType(type);
    }
  };

  const handleSubmitResultPayPackage = (retry: boolean) => {
    if (retry) {
      updateTypeShow(1);
    } else {
      // Cho nay day them cai booking o day
      // Chinh lai v2, goi luon booking o day sau khi thanh toan thanh cong, ko can den nut xac nhan nua
      hideWithPayCode();
    }
  };

  const handleViewDetailJob = () => {
    setVisibleDetail(true);
  };

  const handleApplySuggestVoucher = async () => {
    const packageId = dataDetailPackage?.id;
    const codeApply = dataVoucherApply?.code?.trim();
    if (!packageId || !codeApply) {
      return;
    }

    try {
      const res: any = await ApiService.getVoucherCourse({
        package_id: packageId,
        code: codeApply,
      });
      const { status, data } = res;
      if (status === 200 || status === 201) {
        const result: any = data?.result;

        if (result?.voucher?.code || result?.discount_price) {
          setShowVoucherSuccess(result);
        }
      } else {
        const message =
          data?.errors?.msg ||
          t('voucher.applyError', 'Unable to apply voucher');
        showToast(toastEl, message);
      }
    } catch (error: any) {
      console.log('handleApplySuggestVoucher error:', error);
      const message =
        error?.response?.data?.errors?.msg ||
        error?.response?.data?.message ||
        logError(error);

      showToast(toastEl, message);
    }
  };

  //RENDER
  const renderErrorImage = () => {
    return (
      <Image
        source={images.bottomTab.carely}
        style={screenStyles.box48}
        resizeMode="cover"
      />
    );
  };

  const renderTopInfo = () => {
    const { name, thumbnail, time_package } = dataDetailPackage;
    const dt = new Date(selectedDate);
    const dateShow =
      (dt
        ? formatDateCarely(dt, i18n.language === 'vi' ? 'vi' : 'en', t)
        : '') || '';
    const timeShow1 =
      formatTimeRangeWithDuration(selectedTime, time_package || 0) || '';
    return (
      <View style={[screenStyles.pH16, screenStyles.pV14]}>
        <CText h5 color={colors.c101828} w600>
          {t('carely.infomation', 'Thông tin')}
        </CText>
        <View style={styles.page1TopWrap}>
          <View style={[{ paddingHorizontal: 12, paddingVertical: 10 }]}>
            <Row start style={[{ alignItems: 'flex-start' }]}>
              {/* Bo sung them anh goi */}
              <View style={styles.thumn}>
                <ImageHelper
                  source={{ uri: thumbnail || '' }}
                  renderErrorImage={renderErrorImage}
                  resizeMode={'cover'}
                />
              </View>
              <View style={[screenStyles.mL10, { flex: 1 }]}>
                <CText h4 w500 color={colors.c1D2939}>
                  {name?.toString().trim()}
                </CText>
                <CText
                  h5
                  color={colors.c98A2B3}
                  style={[screenStyles.mT2, { flexShrink: 1 }]}
                  numberOfLines={2}
                >
                  {channelName || ''}
                </CText>
              </View>
            </Row>
          </View>
          <View
            style={{
              backgroundColor: colors.white,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Row start>
              <Image
                source={images.service.ic_calendar}
                style={screenStyles.box16}
                resizeMode="contain"
              />
              <CText h5 color={colors.c1D2939} style={screenStyles.mL5}>
                {dateShow}
              </CText>
            </Row>
            <Row start style={[screenStyles.mT8]}>
              <Image
                source={images.service.ic_clock}
                style={screenStyles.box16}
                resizeMode="contain"
              />
              <CText h5 color={colors.c1D2939} style={screenStyles.mL5}>
                {timeShow1}
              </CText>
            </Row>
            <Row start style={[screenStyles.mT8, { alignItems: 'flex-start' }]}>
              <Image
                source={images.service.ic_location}
                style={screenStyles.box16}
                resizeMode="contain"
              />
              <View style={[screenStyles.flex1, screenStyles.mL5]}>
                <CText h5 color={colors.c1D2939}>
                  {bookingAddress || ''}
                </CText>
              </View>
            </Row>
            <Pressable
              style={styles.btnViewDetail}
              onPress={handleViewDetailJob}
            >
              <CText h5 color={colors.c19A2A7} w500>
                {t('carely.paymentDetail', 'Xem chi tiết công việc')}
              </CText>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderVoucher = () => {
    const hasAppliedVoucher = !!showVoucherSuccess?.voucher?.code;
    const hasSuggestVoucher = dataVoucherApply?.code && !hasAppliedVoucher;

    return (
      <View style={[screenStyles.pH16, screenStyles.pV14]}>
        <Row between>
          <Row>
            <Image
              source={images.payment.ico_voucer}
              style={{
                width: 24,
                height: 24,
                marginRight: 8,
              }}
              resizeMode="contain"
            />
            <CText color={'#1D2939'} h5 w400>
              {t('course.discountCode', 'Mã giảm giá')}
            </CText>
          </Row>

          <Pressable onPress={() => setIsVisibleModalVoucher(true)}>
            {showVoucherSuccess?.discount_price ? (
              <Row>
                <View
                  style={{
                    borderRadius: 25,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    borderWidth: 1,
                    borderColor: '#E02401',
                    backgroundColor: '#FEECEB',
                  }}
                >
                  <CText color={'#E02401'} h5 w400>
                    {formatMoneyVND(
                      showVoucherSuccess?.discount_price || '',
                      '.',
                    )}
                  </CText>
                </View>
                <Pressable
                  onPress={() => setShowVoucherSuccess(null)}
                  style={screenStyles.mL12}
                >
                  <IconX
                    type={IconType.ANT_DESIGN}
                    name={'close'}
                    size={24}
                    color={colors.c667085}
                  />
                </Pressable>
              </Row>
            ) : (
              <CText color={colors.c19A2A7} h5 w400>
                {t('course.selectorentercode', 'Chọn hoặc nhập mã')}
              </CText>
            )}
          </Pressable>
        </Row>

        {hasSuggestVoucher && (
          <View style={styles.suggestVoucherBox}>
            <View style={styles.suggestIconBox}>
              <CText color={colors.white} h4 w600>
                {'%'}
              </CText>
            </View>

            <View style={screenStyles.flex1}>
              <Row start>
                <View style={styles.suggestBadge}>
                  <CText color={colors.c19A2A7} h7 w500>
                    {t('common.suggest', 'Gợi ý')}
                  </CText>
                </View>
              </Row>

              <CText color={colors.c1D2939} h56 w500 style={screenStyles.mT3}>
                {`${t('voucher.discount', 'Giảm')} ${
                  dataVoucherApply?.discount || 0
                }%`}
              </CText>
            </View>

            <Pressable
              onPress={handleApplySuggestVoucher}
              style={styles.btnApplyVoucher}
            >
              <CText color={colors.white} h56 w600>
                {t('common.apply', 'Áp dụng')}
              </CText>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  const renderPaymentMethod = () => {
    const { discount, price } = dataDetailPackage;
    const priceFormat = parsePricePackage(price, discount);
    return (
      <View style={[screenStyles.pH16, screenStyles.pV14]}>
        <CText h5 color={colors.c101828} w600>
          {t('course.payment.payMethod')}
        </CText>
        <View
          style={{
            borderRadius: 8,
            borderColor: colors.cEAECF0,
            borderWidth: 1,
            paddingHorizontal: 12,
            marginTop: 8,
          }}
        >
          <PaymentMethod
            title={t('course.payment.momoWallet', 'MoMo wallet')}
            renderImage={() => (
              <Image
                source={images.payment.ico_momo}
                style={[screenStyles.box40, { marginLeft: -5 }]}
                resizeMode="contain"
              />
            )}
            isChoose={paymentType == PaymentTypes.momo}
            onPress={() => handleChoosePaymentType(PaymentTypes.momo)}
          />
          {priceFormat.rootPrice >= 10000 && (
            <PaymentMethod
              title={t('payment.qrCode', 'Pay with QR Code')}
              renderImage={() => (
                <IconX
                  type={IconType.FONTISTO}
                  name={'qrcode'}
                  size={44}
                  color={colors.c33353A}
                />
              )}
              isChoose={paymentType == PaymentTypes.VNPAYQR}
              onPress={() => handleChoosePaymentType(PaymentTypes.VNPAYQR)}
            />
          )}
          {priceFormat.rootPrice >= 10000 && (
            <PaymentMethod
              title={t('course.payment.domestic', 'Domestic Payment')}
              renderImage={() => (
                <IconX
                  type={IconType.FONTISTO}
                  name={'credit-card-alt'}
                  size={32}
                  color={colors.c33353A}
                />
              )}
              isChoose={paymentType == PaymentTypes.VNPAY}
              onPress={() => handleChoosePaymentType(PaymentTypes.VNPAY)}
            />
          )}
        </View>
      </View>
    );
  };

  const renderDetailPayment = () => {
    const { discount, price } = dataDetailPackage;
    const priceFormat = parsePricePackage(price, discount);
    const voucherDiscount = showVoucherSuccess?.discount_price || 0;
    // const voucherDiscount = 200000;
    const basePrice = priceFormat.rootPrice;
    const discountPrice = priceFormat.discountPrice || 0;

    // Ưu tiên lấy giá giảm tốt nhất
    const finalPrice =
      voucherDiscount > 0
        ? Math.max(basePrice - voucherDiscount, 0)
        : discountPrice > 0
        ? discountPrice
        : basePrice;

    const hasDiscount = finalPrice < basePrice;
    return (
      <View style={[screenStyles.pH16, screenStyles.pV14]}>
        <CText h5 color={colors.c101828} w600>
          {t('carely.detailPayment', 'Chi tiết thanh toán')}
        </CText>
        <View
          style={{
            borderRadius: 8,
            borderColor: colors.cEAECF0,
            borderWidth: 1,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginTop: 8,
          }}
        >
          <Row between style={screenStyles.pV10}>
            <CText style={{ marginRight: 6 }} color={colors.c33353A} h4 w400>
              {t('course.payment.totalAmount', 'Total amount')}
            </CText>
            <View>
              <Row>
                {hasDiscount && (
                  <CText
                    color={colors.c667085}
                    h4
                    w400
                    style={{ textDecorationLine: 'line-through' }}
                  >
                    {formatMoneyVND(basePrice, '.')}
                  </CText>
                )}
                <CText
                  h3
                  w600
                  color={colors.c101828}
                  style={[screenStyles.mL10]}
                >
                  {formatMoneyVND(finalPrice, '.')}
                </CText>
              </Row>
            </View>
          </Row>
          <Row start style={screenStyles.pV10}>
            <IconX
              name={'lock-closed'}
              type={IconType.IONICONS}
              color={colors.c33353A}
              size={12}
            />
            <CText h7 w400 color={colors.c101828} style={screenStyles.mL3}>
              {t(
                'package.policy',
                'We are committed to protecting all of your information when you purchase a service package.',
              )}
            </CText>
          </Row>
        </View>
      </View>
    );
  };

  const renderPaymentType1 = () => {
    return (
      <>
        <CScrollView>
          {renderTopInfo()}
          <Divider color={colors.cF2F4F7} width={6} />
          {renderVoucher()}
          <Divider color={colors.cF2F4F7} width={6} />
          {renderPaymentMethod()}
          <Divider color={colors.cF2F4F7} width={6} />
          {renderDetailPayment()}
          <Divider color={colors.cF2F4F7} width={6} />
        </CScrollView>
        <CButton
          title={t('course.payment.payNow', 'Pay now')}
          isBottom
          onPress={handleBuyPackage}
          disabledStyle={{ backgroundColor: 'rgba(25,162,167, 0.8)' }}
          buttonStyle={{ backgroundColor: colors.c19A2A7 }}
        />
      </>
    );
  };

  const renderPaymentType2 = () => {
    const { resultCode, message, transId, responseTime, amount, orderId } =
      paymentResult;
    const dateShow = moment(new Date()).format('DD/MM/YYYY');
    return (
      <>
        <View
          style={[screenStyles.pH16, screenStyles.pV16, screenStyles.flex1]}
        >
          <View style={screenStyles.centerWrap}>
            <Image
              source={
                resultCode?.toString() == '0'
                  ? images.payment.payment_success
                  : images.payment.payment_failed
              }
              style={styles.paymentInfo}
            />
            <CText h4 w500 color={colors.c101828} style={screenStyles.mT15}>
              {message || t('course.payment.success', '🎉 Payment successful')}
            </CText>
            {resultCode?.toString() == '0' && (
              <CText h5 w400 color={colors.c667085} style={screenStyles.mT5}>
                {t(
                  'payment.msgSuccess',
                  'Cảm ơn bạn đã thanh toán dịch vụ của chúng tôi',
                )}
              </CText>
            )}
          </View>
          <View style={[screenStyles.bottomLine, screenStyles.pB12]} />
          <View style={screenStyles.bottomLine}>
            <Row between style={screenStyles.pV16}>
              <CText color={colors.c667085} h5 w400>
                {t('course.payment.transactionCode', 'Transaction code')}
              </CText>
              <CText color={colors.c101828} h5 w500>
                {transId ? `#${transId}` : ''}
              </CText>
            </Row>
            <Row between>
              <CText color={colors.c667085} h5 w400>
                {t('carely.service', 'Package name')}
              </CText>
              <Row end style={[screenStyles.flex1, { paddingLeft: 20 }]}>
                <CText h4 w500 color={colors.c1D2939} style={screenStyles.mT10}>
                  {dataDetailPackage?.name || ''}
                </CText>
              </Row>
            </Row>
            <Row between style={screenStyles.pV16}>
              <CText color={colors.c667085} h5 w400>
                {t('course.payment.purchaseDate', 'Purchase date')}
              </CText>
              <Row end style={[screenStyles.flex1, { paddingLeft: 20 }]}>
                <CText color={colors.c101828} h5 w500>
                  {dateShow}
                </CText>
              </Row>
            </Row>
          </View>
          <View style={screenStyles.pV16}>
            <Row between>
              <CText color={colors.c667085} h5 w400>
                {t('course.payment.totalAmount', 'Total amount')}
              </CText>
              <CText h4 w600 color={colors.c19A2A7} style={[screenStyles.mL10]}>
                {formatMoneyVND(amount, '.')}
              </CText>
            </Row>
          </View>
        </View>
        <CButton
          title={
            resultCode?.toString() == '0'
              ? t('booking.viewAppointment')
              : t('course.payment.retry')
          }
          isBottom
          onPress={() =>
            handleSubmitResultPayPackage(resultCode?.toString() != '0')
          }
          disabledStyle={{ backgroundColor: 'rgba(25,162,167, 0.8)' }}
          buttonStyle={{ backgroundColor: colors.c19A2A7 }}
        />
      </>
    );
  };

  const renderList = () => {
    if (typeShow == 1) {
      return renderPaymentType1();
    } else {
      return renderPaymentType2();
    }
  };

  const renderHeader = () => {
    if (typeShow == 1) {
      return (
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX
              type={IconType.IONICONS}
              name={'chevron-back'}
              color={colors.c667085}
              size={26}
            />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('carely.buy', 'Xem lại và xác nhận')}
          </CText>
          <View style={{ width: 24 }} />
        </Row>
      );
    }
    return (
      <Row style={screenStyles.modalTopHeader}>
        <CText h4 w600 color={colors.c101828}>
          {t('course.payment.paymentInfo', 'Thông tin thanh toán')}
        </CText>
      </Row>
    );
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        {renderHeader()}
        <Divider color={colors.cF2F4F7} width={6} />
        {renderList()}
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={hideModal}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hideModal}>
          <View style={styles.backdrop} />
        </Pressable>
        <View style={styles.contentContainer}>{renderContent()}</View>
        <ModalSheetDetailJob
          isVisible={visibleDetail}
          hideModal={() => setVisibleDetail(false)}
          dataDetailPackage={dataDetailPackage}
        />
        {showAlert ? (
          <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
        ) : null}
        <ModalVoucher
          package_id={dataDetailPackage?.id}
          isVisible={isVisibleModalVoucher}
          backAction={() => {
            setIsVisibleModalVoucher(false);
          }}
          hideModal={() => {
            setIsVisibleModalVoucher(false);
          }}
          verifySuccessVoucher={data => {
            setShowVoucherSuccess(data);
          }}
        />
        <ConfirmModal
          visible={modalConfirm.isVisible}
          message={modalConfirm.message}
          onCancel={modalConfirm.onCancel}
          onConfirm={modalConfirm.onConfirm}
        />
        <Toast ref={toastEl} position={'center'} />
      </View>
    </Modal>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end' as const,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  contentContainer: {
    width: '100%',
    height: '87%',
  },
  paymentInfo: {
    width: ScreenWidth / 4.5,
    height: ScreenWidth / 4.5,
  },
  page1TopWrap: {
    borderRadius: 8,
    borderColor: colors.cEAECF0,
    borderWidth: 1,
    backgroundColor: colors.cF9FAFB,
    marginTop: 8,
  },
  thumn: {
    width: 60,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cEAECF0,
  },
  btnViewDetail: {
    flexDirection: 'row' as const,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.c19A2A7,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginTop: 14,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  //
  voucherAppliedBox: {
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E02401',
    backgroundColor: '#FEECEB',
  },

  suggestVoucherBox: {
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.c19A2A7,
    backgroundColor: '#F0FEFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  suggestIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.c19A2A7,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 10,
  },

  suggestBadge: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.c19A2A7,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },

  btnApplyVoucher: {
    backgroundColor: colors.c19A2A7,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },

  chooseOtherVoucher: {
    marginTop: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
}));
