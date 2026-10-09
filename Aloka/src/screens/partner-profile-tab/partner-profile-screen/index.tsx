import {
  AnimatedReadMore,
  CHeader,
  IconType,
  ImageHelper,
  IconX,
  Wrapper,
} from '@/components';
import ImageHeader from '@/components/header/ImageHeader';
import { images, screenStyles } from '@/configs';
import { mainRoute, partnerProfileTabRoute } from '@/constants';
import { AppContext } from '@/contexts';
import { UserTypes } from '@/navigation/root-store';
import { Container, CScrollView, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { Rating } from 'react-native-ratings';

const useStyles = makeStyles(({ colors }) => ({
  container: { flex: 1 },
  content: { paddingHorizontal: 12, paddingBottom: 24 },
  profile: { paddingVertical: 12 },
  imgWrap: {
    ...screenStyles.centerWrap,
    height: 64,
    width: 64,
    borderRadius: 42,
    overflow: 'hidden' as const,
    backgroundColor: colors.cEAECF0,
  },
  profileInfo: { flex: 1, marginLeft: 14 },
  badge: {
    alignSelf: 'flex-start' as const,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  contactCard: {
    padding: 12,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cF9FAFB,
  },
  contactList: { flex: 1, marginRight: 8, gap: 4 },
  contactItem: { flexDirection: 'row' as const, alignItems: 'center' as const },
  contactText: { flex: 1, marginLeft: 6 },
  btnWrap: {
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    ...screenStyles.rowCenter,
  },
  statRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginTop: 16,
  },
  statDivider: { width: 1, height: 16, backgroundColor: colors.cEAECF0 },
  about: { marginTop: 18, marginBottom: 12 },
  description: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.cF9FAFB,
  },
  menuRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    minHeight: 74,
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cF9FAFB,
  },
  communityRow: {
    backgroundColor: '#EDF9FF',
    borderRadius: 12,
    borderBottomWidth: 0,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  menuIcon: { width: 44, height: 44, borderRadius: 10 },
  menuText: { flex: 1, marginLeft: 16, marginRight: 8 },
}));

export interface IMenuProfile {
  id: number;
  label: string;
  iconName: string;
  iconType: any;
  iconBg: string;
  iconColor: string;
  screenName: string;
}

const PartnerProfileScreen: React.FC<any> = ({ navigation }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const { user, userType }: any = useContext(AppContext);

  const handleSetting = () => {
    navigation.navigate(mainRoute.settingScreen);
  };

  const handleNotify = () => {
    navigation.navigate(mainRoute.notificationScreen);
  };

  const handleEditProfile = () => {
    navigation.navigate(partnerProfileTabRoute.partnerEditProfileScreen);
  };

  const renderKYCStatus = (status: number) => {
    const verified = status === 1;
    const failed = status === 2;
    const color = verified ? '#12B76A' : failed ? colors.error : colors.warning;
    const label = verified
      ? t('profile.verified', 'Hồ sơ đã xác minh')
      : failed
      ? t('profile.verifyingFailed', 'Xác minh thất bại')
      : t('profile.verifying', 'Đang xác minh');

    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: verified
              ? '#DCFAE6'
              : failed
              ? '#FEE4E2'
              : '#FEF0C7',
          },
        ]}
      >
        <CText h6 w600 color={color}>
          {label}
        </CText>
      </View>
    );
  };

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box40}
        resizeMode="contain"
      />
    );
  };

  const renderProfileMenu = () => {
    const {
      personalization: profile,
      full_name,
      username,
      numRating,
    } = user ?? {};
    const personalization = profile ?? {};
    const position =
      userType === UserTypes.doctor
        ? personalization.position
        : userType === UserTypes.nurse
        ? t('account.nurse', 'Nurse')
        : '';
    const contacts = [
      { icon: 'phone', value: user?.phone_number || user?.phone },
      { icon: 'mail', value: user?.email },
    ];

    return (
      <View style={styles.profile}>
        <Row start>
          <View style={styles.imgWrap}>
            <ImageHelper
              source={{ uri: personalization.avatar || '' }}
              renderErrorImage={renderErrorImage}
            />
          </View>
          <View style={styles.profileInfo}>
            <CText h4 w600 color={colors.c101828}>
              {full_name || username}
            </CText>
            {renderKYCStatus(personalization.status)}
            {!!position && (
              <CText h56 color={colors.c667085} style={screenStyles.mT3}>
                {position}
              </CText>
            )}
            <CText h56 color={colors.c667085} style={screenStyles.mT3}>
              {personalization.hospital_name || 'BV Nhi Đồng 2'}
            </CText>
            {!!personalization.practicing_certificate_number && (
              <CText h56 color={colors.c667085} style={screenStyles.mT3}>
                CCHN: {personalization.practicing_certificate_number}
              </CText>
            )}
          </View>
        </Row>
        <View style={styles.contactCard}>
          <Row start>
            <View style={styles.contactList}>
              {contacts.map(({ icon, value }) =>
                value ? (
                  <View key={icon} style={styles.contactItem}>
                    <IconX
                      type={IconType.ANT_DESIGN}
                      name={icon}
                      size={14}
                      color={colors.c667085}
                    />
                    <CText
                      h6
                      color={colors.c667085}
                      style={styles.contactText}
                      numberOfLines={1}
                    >
                      {value}
                    </CText>
                  </View>
                ) : null,
              )}
            </View>
            <Pressable style={styles.btnWrap} onPress={handleEditProfile}>
              <Image
                source={images.global.ico_edit}
                style={screenStyles.box16}
              />
              <CText h6 w600 color={colors.primary} style={screenStyles.mL5}>
                {t('profile.editProfile', 'Sửa hồ sơ')}
              </CText>
            </Pressable>
          </Row>
          <View style={styles.statRow}>
            <Row start>
              <Rating
                startingValue={5}
                readonly
                showRating={false}
                imageSize={18}
                ratingColor="#FDB022"
                ratingCount={1}
              />
              <CText h56 w600 color={colors.c101828} style={screenStyles.mL5}>
                {numRating || 5}
              </CText>
              {user?.statistics?.total_reviews != null && (
                <CText h6 color={colors.c667085} style={screenStyles.mL10}>
                  {user.statistics.total_reviews} Đánh giá
                </CText>
              )}
            </Row>
            <View style={styles.statDivider} />
            <CText h6 color={colors.c667085}>
              Công việc đã nhận{' '}
              <CText h56 w600 color={colors.c101828}>
                100
              </CText>
            </CText>
          </View>
        </View>
        {!!personalization.description && (
          <View style={styles.about}>
            <CText h56 w600 color={colors.c101828}>
              {t('doctorProfile.about', 'Giới thiệu')}
            </CText>
            <View style={styles.description}>
              <AnimatedReadMore
                text={personalization.description}
                numberOfLines={3}
                seeMoreText={t('common.seeMore', 'See more')}
                seeLessText={t('common.viewLess', 'View less')}
                seeStyle={{ color: colors.c98A2B3 }}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderVersion = () => {
    return (
      <Row style={screenStyles.pV22}>
        <CText h56 color={colors.c667085}>
          {t('common.appVersion', { appVersion: getVersion() })}
        </CText>
      </Row>
    );
  };

  const renderLeftHead = () => {
    return (
      <View style={screenStyles.leftWrapper}>
        <CText h4 w600>
          {t('studio.profile.title', 'Hồ sơ')}
        </CText>
      </View>
    );
  };

  const renderRightHead = () => (
    <View style={screenStyles.rightWrapper}>
      <Pressable
        style={screenStyles.mT3}
        hitSlop={screenStyles.hitSlop20}
        onPress={handleNotify}
      >
        <Image
          source={images.global.ico_notify}
          style={screenStyles.box26}
          resizeMode="contain"
        />
      </Pressable>
      <Pressable
        hitSlop={screenStyles.hitSlop20}
        onPress={handleSetting}
        style={screenStyles.mL18}
      >
        <Image source={images.account.setting} style={screenStyles.box30} />
      </Pressable>
    </View>
  );

  const renderContent = () => {
    const menuItems = [
      {
        key: 'mySpecialistPage',
        description: 'mySpecialistPageDes',
        image: images.account.my_specialist,
      },
      {
        key: 'myServices',
        description: 'myServicesDes',
        image: images.account.my_services,
      },
      {
        key: 'myContent',
        description: 'myContentDes',
        image: images.account.my_content,
      },
      {
        key: 'myWorkSchedule',
        description: 'myWorkScheduleDes',
        image: images.account.my_work_schedule,
      },
      {
        key: 'myIncome',
        description: 'myIncomeDes',
        image: images.account.my_income_management,
      },
      {
        key: 'myDr',
        description: 'myDrDes',
        image: images.account.my_doctor_network,
      },
      {
        key: 'mySupport',
        description: 'mySupportDes',
        image: images.account.my_support,
      },
    ];

    return (
      <Container>
        <CScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          {renderProfileMenu()}
          {menuItems.map(({ key, description, image }) => (
            <Pressable
              key={key}
              style={[styles.menuRow, key === 'myDr' && styles.communityRow]}
              onPress={() => {}}
            >
              <Image
                source={image}
                style={styles.menuIcon}
                resizeMode="contain"
              />
              <View style={styles.menuText}>
                <CText h56 w600 color={colors.c101828}>
                  {key === 'myDr'
                    ? 'Doctor Network'
                    : key === 'mySupport'
                    ? t('onboarding.support')
                    : t(`expert.${key}`)}
                </CText>
                <CText h56 color={colors.c667085} style={screenStyles.mT3}>
                  {t(`expert.${description}`)}
                </CText>
              </View>
              {key !== 'mySupport' &&
                (key == 'myDr' ? (
                  <IconX
                    type={IconType.ANT_DESIGN}
                    name={'export'}
                    size={18}
                    color={'#00A6E8'}
                  />
                ) : (
                  <IconX
                    name={'chevron-right'}
                    type={'octicons'}
                    color={colors.c98A2B3}
                    size={24}
                  />
                ))}
            </Pressable>
          ))}
          {renderVersion()}
        </CScrollView>
      </Container>
    );
  };

  return (
    <Wrapper>
      <ImageHeader />
      <CHeader
        rightComponent={renderRightHead()}
        leftComponent={renderLeftHead()}
      />
      {renderContent()}
    </Wrapper>
  );
};

export default PartnerProfileScreen;
