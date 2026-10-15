import { IconType, IconX } from '@/components';
import {
  formatMoneyVND,
  images,
  parsePricePackage,
  screenStyles,
} from '@/configs';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, Pressable, View } from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  wrapEmpty: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flex: 1,
  },
  viewPackage: {
    borderWidth: 1,
    marginTop: 14,
    borderRadius: 10,
    borderColor: colors.cF2F4F7,
    overflow: 'hidden' as const,
    marginHorizontal: 16,
  },
}));

export const ListEmptyPkg = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();
  return (
    <View style={styles.wrapEmpty}>
      <IconX
        type={IconType.MATERIAL_ICONS}
        name="medical-services"
        size={90}
        color={colors.cD0D5DD}
      />
      <Row style={{ paddingHorizontal: 24, marginTop: 5 }}>
        <CText h5 w500 center color={colors.c667085}>
          {t('common.noDataAvailable', 'Hiện tại chưa có dữ liệu nào !')}
        </CText>
      </Row>
    </View>
  );
};

export const PackageChannel = ({
  item,
  index,
  checkIsFreeBuyed,
  t,
  user,
  onViewDetailPackage,
  onPressMenu,
}: any) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  if (!item) return null;

  const {
    chat_1vs1,
    count_chat,
    count_call,
    is_newsfeed,
    discount,
    price,
    call_1vs1,
    duration,
    option1,
    option2,
    option3,
    option4,
    option5,
    description,
    is_book_service,
    status,
    rejected_reason,
  } = item;

  const priceFormat = parsePricePackage(price, discount);
  const months = duration ?? 1;
  let isFreeBuyed = false;
  if (priceFormat.rootPrice === 0) {
    isFreeBuyed = checkIsFreeBuyed?.(item) ?? false;
  }
  //RENDER

  const renderOption = (value: string) => {
    return (
      <Row start style={screenStyles.pV6}>
        <IconX
          name={'medical-services'}
          // type={IconType.FEATHER_ICONS}
          type={IconType.MATERIAL_ICONS}
          color={colors.c33353A}
          size={16}
        />
        <CText h5 color={colors.c33353A} style={screenStyles.mL5}>
          {value}
        </CText>
      </Row>
    );
  };

  const renderKYCStatus = (statusPackage: number, rejected_reason: string) => {
    // Neu chuyen gia chua xac thuc, hoac goi bi khoa
    const statusChuyenGia = user?.personalization?.status;
    if (statusPackage == 1) return;
    let statusText = '';
    let iconKYC = images.global.kyc_0;
    let textColor = colors.warning;
    if (statusChuyenGia == 2) {
      statusText = t('profile.verifyingFailed', 'Verifying Failed');
      iconKYC = images.global.kyc_2;
      textColor = colors.error;
    }
    if (statusPackage == 0) {
      statusText = t('package.locked', 'Gói đã bị khoá');
      iconKYC = images.global.kyc_2;
      textColor = colors.error;
    }
    if (statusText == '') return;
    return (
      <Row start style={screenStyles.mT8}>
        <Image
          source={iconKYC}
          style={screenStyles.box14}
          resizeMode="contain"
        />
        <CText
          h6
          w400
          color={textColor}
          style={screenStyles.mL3}
          numberOfLines={2}
        >
          {statusText}
        </CText>
      </Row>
    );
  };

  return (
    <View style={styles.viewPackage}>
      <ImageBackground
        source={images.global.bg_package}
        style={[screenStyles.pV14, screenStyles.pH12]}
      >
        <Row between>
          <Row between style={screenStyles.flex1}>
            <View style={screenStyles.flex1}>
              <CText h46 w600 color={colors.c101828}>
                {is_book_service == 1
                  ? `${item.name}`
                  : `${item.name} (${months} ${
                      months == 1
                        ? t('common.month', 'month')
                        : t('common.months', 'months')
                    })`}
              </CText>
            </View>
            <Pressable
              hitSlop={20}
              onPress={() => onPressMenu?.(item)}
              style={{
                paddingLeft: 12,
              }}
            >
              <IconX
                name={'dots-three-vertical'}
                type={IconType.ENTYPO}
                size={18}
                color={colors.c667085}
              />
            </Pressable>
          </Row>
        </Row>
        <Pressable
          style={screenStyles.mT8}
          onPress={() => onViewDetailPackage?.(item, is_book_service)}
        >
          {/* {is_book_service === 1 ? (
            <Row start style={screenStyles.pV6}>
              <IconX
                name={'health-and-safety'}
                type={IconType.MATERIAL_ICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText
                h5
                w400
                color={colors.c33353A}
                style={screenStyles.mL5}
              >{`${t(
                'package.serviceHome',
                'Dịch vụ chăm sóc sức khoẻ tại nhà',
              )}`}</CText>
            </Row>
          ) : (
            <Row start style={screenStyles.pV6}>
              <IconX
                name={'health-and-safety'}
                type={IconType.MATERIAL_ICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText
                h5
                w400
                color={colors.c33353A}
                style={screenStyles.mL5}
              >{`${t(
                'package.serviceOnline',
                'Dịch vụ tư vấn trực tuyến',
              )}`}</CText>
            </Row>
          )} */}
          {/* {is_newsfeed === 1 && (
            <Row start style={screenStyles.pV6}>
              <IconX
                name={'newspaper-outline'}
                type={IconType.IONICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText h5 color={colors.c33353A} style={screenStyles.mL5}>{`${t(
                'package.newsfeed',
              )}`}</CText>
            </Row>
          )} */}
          {/* {chat_1vs1 === 1 && (
            <Row start style={screenStyles.pV6}>
              <IconX
                name={'chatbox-ellipses-outline'}
                type={IconType.IONICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText h5 color={colors.c33353A} style={screenStyles.mL5}>{`${t(
                'package.chat',
              )}`}</CText>
              {count_chat && count_chat != -1 ? (
                <CText
                  h5
                  color={colors.c33353A}
                  style={screenStyles.mL5}
                >{`(${count_chat})`}</CText>
              ) : null}
            </Row>
          )} */}
          {/* {call_1vs1 === 1 && (
            <Row start style={screenStyles.pV6}>
              <IconX
                name={'call-outline'}
                type={IconType.IONICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText h5 color={colors.c33353A} style={screenStyles.mL5}>{`${t(
                'package.call1vs1',
                'Allow making private calls',
              )}`}</CText>
              {count_call && count_call != -1 ? (
                <CText
                  h5
                  color={colors.c33353A}
                  style={screenStyles.mL5}
                >{`(${count_call})`}</CText>
              ) : null}
            </Row>
          )} */}
          {option1 ? renderOption(option1) : null}
          {option2 ? renderOption(option2) : null}
          {option3 ? renderOption(option3) : null}
          {option4 ? renderOption(option4) : null}
          {option5 ? renderOption(option5) : null}
        </Pressable>
        <Pressable
          style={screenStyles.mT5}
          onPress={() => onViewDetailPackage?.(item, is_book_service)}
        >
          <Row between>
            {priceFormat.discountPrice > 0 ? (
              <Row start style={{ flex: 1, flexWrap: 'wrap' }}>
                <CText
                  color={colors.c667085}
                  h5
                  w400
                  style={{ textDecorationLine: 'line-through' }}
                >
                  {`${formatMoneyVND(priceFormat.rootPrice, '.')}`}
                </CText>
                <CText h4 w600 color={colors.black} style={[screenStyles.mL5]}>
                  {`${formatMoneyVND(priceFormat.discountPrice, '.')}`}
                </CText>
              </Row>
            ) : (
              <Row start style={{ flex: 1, flexWrap: 'wrap' }}>
                <CText h4 w600 color={colors.c101828}>
                  {`${formatMoneyVND(priceFormat.rootPrice, '.')}`}
                </CText>
              </Row>
            )}
            <Row end>
              <View>
                <CText
                  w500
                  color={is_book_service == 1 ? colors.c19A2A7 : colors.primary}
                  h5
                >
                  {t('package.viewPackageDetails', 'Xem chi tiết')} →
                </CText>
              </View>
            </Row>
          </Row>
        </Pressable>
        {renderKYCStatus(status, rejected_reason || '')}
      </ImageBackground>
    </View>
  );
};
