import {
  AnimatedReadMore,
  CHeader,
  IconType,
  ImageHelper,
  Wrapper,
} from '@/components';
import ImageHeader from '@/components/header/ImageHeader';
import { images, screenStyles } from '@/configs';
import { mainRoute, partnerProfileTabRoute } from '@/constants';
import { AppContext } from '@/contexts';
import { UserTypes } from '@/navigation/root-store';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { Container, CScrollView, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { getVersion } from 'react-native-device-info';
// import { ListMenu } from './ListMenu';
// import MenuItem from './MenuItem';
import { Rating } from 'react-native-ratings';
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.cFCFCFD,
  },
  sessionWrapper: {
    // backgroundColor: colors.white,
    // borderRadius: 8,
    // marginBottom: 16,
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

const PartnerProfileScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const { user, userType }: any = useContext(AppContext);

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
    navigation.navigate(partnerProfileTabRoute.partnerEditProfileScreen);
  };

  const handlePressMenuItem = (item: IMenuProfile) => {
    if (item.screenName) {
      navigation.navigate(item.screenName);
    }
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------

  const renderKYCStatus = (status: number, rejected_reason: string) => {
    let statusText = t('profile.verifying', 'Verifying');
    let iconKYC = images.global.kyc_0;
    let textColor = colors.warning;
    if (status == 1) {
      statusText = t('profile.verified', 'Verified');
      iconKYC = images.global.kyc_1;
      textColor = colors.primary;
    } else if (status == 2) {
      statusText = t('profile.verifyingFailed', 'Verifying Failed');
      iconKYC = images.global.kyc_2;
      textColor = colors.error;
    }
    return (
      <Row start style={screenStyles.mT3}>
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

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box40}
        resizeMode="contain"
      />
    );
  };

  const renderDescription = (des: string) => {
    if (des) {
      return (
        <View style={screenStyles.mT15}>
          <CText color={colors.c101828} h5 w500>
            {t('doctorProfile.about', 'About')}
          </CText>
          <View style={screenStyles.mT5}>
            <AnimatedReadMore
              text={des}
              numberOfLines={2}
              seeMoreText={t('common.seeMore', 'See more')}
              seeLessText={t('common.viewLess', 'View less')}
              seeStyle={{ color: colors.c98A2B3 }}
            />
          </View>
        </View>
      );
    }
  };

  const renderProfileMenu = () => {
    const { avatar } = user?.personalization ?? {};
    // const { username, full_name } = user ?? {};
    // const { total_following } = user?.statistics ?? {};
    const { personalization, full_name, username, numRating } = user;
    let position = '';
    if (userType === UserTypes.doctor) {
      position = personalization?.position || '';
    } else if (userType === UserTypes.nurse) {
      position = t('account.nurse', 'Nurse');
    }
    return (
      <View style={screenStyles.pH24}>
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
            {position && (
              <CText
                h5
                w400
                color={colors.c98A2B3}
                style={screenStyles.mT3}
                numberOfLines={2}
              >
                {position}
              </CText>
            )}
            <Row start style={{ marginTop: 4 }}>
              <Pressable onPress={handleShowFollowingList}>
                <CText color={colors.c101828} h5>
                  {'BV Nhi Đồng 2'}
                </CText>
              </Pressable>
            </Row>
            {renderKYCStatus(
              personalization?.status,
              personalization?.rejected_reason,
            )}
          </View>
        </Row>
        {/* Line */}
        {/* <Divider color={colors.cEAECF0} width={1} style={screenStyles.pV10} /> */}
        {/* Phone */}
        <Pressable style={styles.btnWrap} onPress={handleEditProfile}>
          <Image source={images.global.ico_edit} style={screenStyles.box16} />
          <CText h5 w500 color={colors.primary} style={screenStyles.mL10}>
            {t('profile.editProfile', 'Edit Profile')}
          </CText>
        </Pressable>
        <Row start style={screenStyles.mT15}>
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
            {numRating || 5}
          </CText>
          <CText style={screenStyles.mL5} color={colors.cEAECF0} h56 w500>
            {'|'}
          </CText>
          <CText style={screenStyles.mL5} color={colors.c101828} h56 w500>
            {'Công việc đã nhận: 100'}
          </CText>
        </Row>
        {renderDescription(personalization?.description || '')}
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

  // const renderItemList = (item: any) => {
  //   return <MenuItem {...item.item} onPress={handlePressMenuItem} />;
  // };

  // const renderListMenu = () => {
  //   return (
  //     <FlatList
  //       style={{ flex: 1, paddingHorizontal: 16 }}
  //       data={ListMenu as IMenuProfile[]}
  //       extraData={ListMenu}
  //       keyExtractor={keyExtractor}
  //       renderItem={renderItemList}
  //       ListFooterComponent={renderVersion()}
  //       scrollsToTop={false}
  //     />
  //   );
  // };

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

  // const renderContent = () => {
  //   return (
  //     <Container>
  //       {renderProfileMenu()}
  //       <View style={styles.line} />
  //       <CScrollView>
  //         {/* <MenuSection title="Hoạt động của tôi" items={activityItems} /> */}
  //         {renderSession('Hoạt động của tôi')}
  //         <MenuItem
  //           {...ListMenu[0]}
  //           onPress={handlePressMenuItem}
  //           isBorderBottom
  //         />
  //         <MenuItem {...ListMenu[1]} onPress={handlePressMenuItem} />
  //         {/* {renderSession('Lưu trữ')}
  //         <MenuItem
  //           {...ListMenu[2]}
  //           onPress={handlePressMenuItem}
  //           isBorderBottom
  //         />
  //         <MenuItem {...ListMenu[3]} onPress={handlePressMenuItem} /> */}
  //         {renderSession('Kết nối & Khác')}
  //         <MenuItem
  //           {...ListMenu[4]}
  //           onPress={handlePressMenuItem}
  //           isBorderBottom
  //         />
  //         {/* <MenuItem {...ListMenu[5]} onPress={handlePressMenuItem} isBorderBottom/> */}
  //         <MenuItem
  //           {...ListMenu[6]}
  //           onPress={handlePressMenuItem}
  //           isBorderBottom
  //         />
  //         {renderVersion()}
  //       </CScrollView>
  //       {/* {renderListMenu()} */}
  //     </Container>
  //   );
  // };

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

  const renderContent = () => {
    return (
      <Container>
        {renderProfileMenu()}
        <View style={styles.line} />
        <CScrollView style={styles.container}>
          <View style={styles.sessionWrapper}>
            <MenuItem
              label={t('expert.mySpecialistPage')}
              des={t('expert.mySpecialistPageDes')}
              imgSrc={images.account.my_specialist}
              isBorderBottom
              onPress={() => {}}
            />
            <MenuItem
              label={t('expert.myServices')}
              des={t('expert.myServicesDes')}
              imgSrc={images.account.my_services}
              isBorderBottom
              onPress={() => {}}
            />
            <MenuItem
              label={t('expert.myContent')}
              des={t('expert.myContentDes')}
              imgSrc={images.account.my_content}
              isBorderBottom
              onPress={() => {}}
            />
            <MenuItem
              label={t('expert.myWorkSchedule')}
              des={t('expert.myWorkScheduleDes')}
              imgSrc={images.account.my_work_schedule}
              isBorderBottom
              onPress={() => {}}
            />
            <MenuItem
              label={t('expert.myIncome')}
              des={t('expert.myIncomeDes')}
              imgSrc={images.account.my_income_management}
              isBorderBottom
              onPress={() => {}}
            />
            <MenuItem
              label={'Doctor Network'}
              des={t('expert.myDrDes')}
              imgSrc={images.account.my_doctor_network}
              isBorderBottom
              onPress={() => {}}
            />
            <MenuItem
              label={t('onboarding.support')}
              des={t('expert.mySupportDes')}
              imgSrc={images.account.my_support}
              isBorderBottom
              onPress={() => {}}
            />
          </View>
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
      {/* {renderVersion()} */}
    </Wrapper>
  );
};

export default PartnerProfileScreen;
