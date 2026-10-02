import { CHeader, ImageHelper, Wrapper } from '@/components';
import ImageHeader from '@/components/header/ImageHeader';
import { screenStyles, images, keyExtractor } from '@/configs';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { makeStyles, useTheme } from '@rneui/themed';
import { Pressable, Image, View, FlatList } from 'react-native';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mainRoute } from '@/constants';
import { Container, CScrollView, CText, Row } from '@/utils';
import { AppContext } from '@/contexts';
import { ListMenu } from './ListMenu';
import { getVersion } from 'react-native-device-info';
import MenuItem from './MenuItem';

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
    height: 64,
    width: 64,
    borderRadius: 50,
    overflow: 'hidden' as const,
  },
  line: { height: 7, backgroundColor: colors.cF9FAFB, marginTop: 16 },
  btnWrap: {
    marginTop: 20,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    ...screenStyles.rowCenter,
  },
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

  const handleShowFollowingList = () => {
    // navigation.navigate(mainRoute.followingList);
  };

  const handleEditProfile = () => {
    // navigation.navigate(mainRoute.editProfileScreen);
  };

  const handlePressMenuItem = (item: IMenuProfile) => {
    if (item.screenName) {
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
    const { username, full_name } = user ?? {};
    const { total_following } = user?.statistics ?? {};
    return (
      <View style={screenStyles.pH24}>
        <Row start>
          <View
            style={[
              styles.imgWrap,
              {
                // borderWidth: 1,
                // borderColor: colors.cF9FAFB,
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
            <Row start style={{ marginTop: 4 }}>
              <Pressable onPress={handleShowFollowingList}>
                <CText color={colors.black} h5>
                  {total_following || 0}
                  <CText h5 color={colors.c98A2B3} style={screenStyles.mL5}>
                    {` ${t('profile.followed')}`}
                  </CText>
                </CText>
              </Pressable>
            </Row>
          </View>
        </Row>
        <Pressable style={styles.btnWrap} onPress={handleEditProfile}>
          <Image source={images.global.ico_edit} style={screenStyles.box16} />
          <CText h5 w500 color={colors.primary} style={screenStyles.mL10}>
            {t('profile.editProfile', 'Edit Profile')}
          </CText>
        </Pressable>
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

  const renderItemList = (item: any) => {
    return <MenuItem {...item.item} onPress={handlePressMenuItem} />;
  };

  const renderListMenu = () => {
    return (
      <FlatList
        style={{ flex: 1, paddingHorizontal: 16 }}
        data={ListMenu as IMenuProfile[]}
        extraData={ListMenu}
        keyExtractor={keyExtractor}
        renderItem={renderItemList}
        ListFooterComponent={renderVersion()}
        scrollsToTop={false}
      />
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
        <CScrollView>
          {/* <MenuSection title="Hoạt động của tôi" items={activityItems} /> */}
          {renderSession('Hoạt động của tôi')}
          <MenuItem
            {...ListMenu[0]}
            onPress={handlePressMenuItem}
            isBorderBottom
          />
          <MenuItem {...ListMenu[1]} onPress={handlePressMenuItem} />
          {/* {renderSession('Lưu trữ')}
          <MenuItem
            {...ListMenu[2]}
            onPress={handlePressMenuItem}
            isBorderBottom
          />
          <MenuItem {...ListMenu[3]} onPress={handlePressMenuItem} /> */}
          {renderSession('Kết nối & Khác')}
          <MenuItem
            {...ListMenu[4]}
            onPress={handlePressMenuItem}
            isBorderBottom
          />
          {/* <MenuItem {...ListMenu[5]} onPress={handlePressMenuItem} isBorderBottom/> */}
          <MenuItem
            {...ListMenu[6]}
            onPress={handlePressMenuItem}
            isBorderBottom
          />
          {renderVersion()}
        </CScrollView>
        {/* {renderListMenu()} */}
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
      {/* {renderVersion()} */}
    </Wrapper>
  );
};

export default AccountScreen;
