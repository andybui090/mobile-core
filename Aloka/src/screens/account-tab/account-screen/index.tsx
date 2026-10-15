import { CHeader, IconType, IconX, ImageHelper, Wrapper } from '@/components';
import ImageHeader from '@/components/header/ImageHeader';
import { images, screenStyles } from '@/configs';
import { accountTabRoute, mainRoute } from '@/constants';
import { AppContext } from '@/contexts';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { Container, CScrollView, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { ListMenu } from './ListMenu';
import MenuItem from './MenuItem';
import Share from 'react-native-share';

const useStyles = makeStyles(({ colors }) => ({
  hasNoti: {
    position: 'absolute' as const,
    right: 3,
    top: 1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
  },
  imgWrap: {
    ...screenStyles.centerWrap,
    height: 56,
    width: 56,
    borderRadius: 50,
    overflow: 'hidden' as const,
  },
  line: { height: 7, backgroundColor: colors.cF9FAFB, marginTop: 16 },
  btnWrap: {
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    ...screenStyles.rowCenter,
  },
  profileWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  contactRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderTopWidth: 1,
    borderTopColor: colors.cEAECF0,
    marginTop: 16,
    paddingTop: 12,
  },
  contactInfo: {
    flex: 1,
    minWidth: 0,
  },
  contactItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 2,
  },
  contactText: {
    flex: 1,
    marginLeft: 4,
    fontSize: 12,
  },
}));

export interface IMenuProfile {
  id: number;
  label: string;
  alias: string;
  iconName: string;
  iconType: any;
  iconBg: string;
  iconColor: string;
  screenName: string;
}

const AccountScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const { user }: any = useContext(AppContext);

  const dispatch = useAppDispatch();

  // -------------------------------
  // STATE
  // -------------------------------

  const [totalUnread, setTotalUnread] = useState<number>(0);

  // -------------------------------
  // ACTION
  // -------------------------------
  const handleSetting = () => {
    navigation.navigate(mainRoute.settingScreen);
  };

  const handleNotify = () => {
    navigation.navigate(mainRoute.notificationScreen);
  };

  const handleEditProfile = () => {
    navigation.navigate(accountTabRoute.editProfileScreen);
  };

  const handlePressMenuItem = (item: IMenuProfile) => {
    if (item.alias == 'Invite friends') {
      const shareOption = {
        title: 'Kết nối Aloka',
        message: 'Chăm sóc sức khoẻ tại nhà',
        url: '',
      };
      Share.open(shareOption)
        .then((res: any) => {})
        .catch(error => console.log(error));
    } else if (item.screenName) {
      navigation.navigate(item.screenName);
    }
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------

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
    const { avatar } = user?.personalization ?? {};
    const { username, full_name, phone, email } = user ?? {};
    // const { total_following } = user?.statistics ?? {};
    return (
      <View style={styles.profileWrap}>
        <Row start>
          <View
            style={[
              styles.imgWrap,
              {
                backgroundColor: colors.cEAECF0,
              },
            ]}
          >
            <ImageHelper
              source={{
                uri: avatar || '',
              }}
              renderErrorImage={renderErrorImage}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <CText h4 w600 color={colors.c101828}>
              {full_name || username}
            </CText>
            {/* <Row start style={{ marginTop: 4 }}>
              <Pressable onPress={handleShowFollowingList}>
                <CText color={colors.black} h5>
                  {total_following || 0}
                  <CText h5 color={colors.c98A2B3} style={screenStyles.mL5}>
                    {` ${t('profile.followed')}`}
                  </CText>
                </CText>
              </Pressable>
            </Row> */}
          </View>
        </Row>
        <View style={styles.contactRow}>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <IconX
                type={IconType.IONICONS}
                name="call-outline"
                size={14}
                color={colors.c98A2B3}
              />
              <CText
                color={colors.c98A2B3}
                style={styles.contactText}
                numberOfLines={1}
              >
                {phone || '—'}
              </CText>
            </View>
            <View style={styles.contactItem}>
              <IconX
                type={IconType.IONICONS}
                name="mail-outline"
                size={14}
                color={colors.c98A2B3}
              />
              <CText
                color={colors.c98A2B3}
                style={styles.contactText}
                numberOfLines={1}
              >
                {email || '—'}
              </CText>
            </View>
          </View>
          <Pressable style={styles.btnWrap} onPress={handleEditProfile}>
            <Image source={images.global.ico_edit} style={screenStyles.box16} />
            <CText h56 w600 color={colors.primary} style={screenStyles.mL5}>
              {t('profile.editProfile', 'Sửa hồ sơ')}
            </CText>
          </Pressable>
        </View>
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

  const renderSession = (title: string) => {
    return (
      <View
        style={{
          backgroundColor: '#50CACF33',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <CText h5 w500 color={colors.c101828}>
          {title}
        </CText>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <Container>
        {renderProfileMenu()}
        <View style={styles.line} />
        <CScrollView contentContainerStyle={screenStyles.flexGrowBottom}>
          {/* <MenuSection title="Hoạt động của tôi" items={activityItems} /> */}
          {renderSession(t('profile.myActivities', 'Hoạt động của tôi'))}
          {/* <MenuItem
            {...ListMenu[0]}
            onPress={handlePressMenuItem}
            isBorderBottom
          /> */}
          <MenuItem
            {...ListMenu[1]}
            onPress={() => handlePressMenuItem(ListMenu[1])}
          />
          {renderSession(t('profile.connectionsAndMore','Kết nối & Khác'))}
          <MenuItem
            {...ListMenu[2]}
            onPress={() => handlePressMenuItem(ListMenu[2])}
            isBorderBottom
          />
          <MenuItem
            {...ListMenu[3]}
            onPress={() => handlePressMenuItem(ListMenu[3])}
            isBorderBottom
          />
          {renderVersion()}
        </CScrollView>
      </Container>
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
        {totalUnread != 0 && <View style={styles.hasNoti} />}
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

export default AccountScreen;
