import {
  CHeader,
  ICON_TYPE,
  IconX,
  ImageHelper,
  Toast,
  Wrapper,
} from '@/components';
import { images, keyExtractor, screenStyles, shareInviteFriend, showToast } from '@/configs';
import { mainRoute } from '@/constants/route_key';
import { AppContext } from '@/contexts';
import { getProfile } from '@/redux/slices/profileSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { spacings } from '@/theme';
import { CText, Row } from '@/utils';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, TouchableOpacity, View } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { RenderItem } from './Components/ItemFlatlist';
import { ProfileMenu } from './functions';
import useStyles from './styles';

export interface IMenuProfile {
  id: number;
  title: string;
  icon: string;
  iconType?: any;
  iconBg: string;
  screen?: string;
  sharing?: boolean;
  isOnlyDoctor?: boolean;
}

const AccountScreen: React.FC<any> = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { user, linkInviteFriend }: any = useContext(AppContext);
  const {
    theme: { colors },
  } = useTheme();

  const styles = useStyles();
  const toastEl = useRef<any>(null);

  const isFocusScreen = useIsFocused();
  const dispatch = useAppDispatch();

  const { firebaseConfig } = useAppSelector(state => state.globalReducer);
  const { profileData } = useAppSelector(state => state.profileReducer);

  useEffect(() => {
    if (isFocusScreen && user?.username) {
      dispatch(getProfile(null));
    }
  }, [isFocusScreen, user?.username]);

  const currentUser =
    (profileData as any)?.data?.result || (profileData as any)?.data || user || {};

  // ACTION
  const renderItemList = (item: any) => {
    const {
      title,
      icon,
      iconType,
      iconBg,
      screen,
      sharing,
      caption,
      id,
      nameAlias,
    } = item?.item || {};

    if (firebaseConfig?.isReviewApp && id === 3) return null;

    return (
      <RenderItem
        title={title}
        nameAlias={nameAlias}
        nameIcon={icon}
        typeIcon={iconType}
        iconBg={iconBg}
        onPress={async () => {
          if (sharing) {
            shareInviteFriend(
              linkInviteFriend || 'https://download.doctornetwork.us',
              t(title) || title,
              caption || '',
            );
            return;
          }

          // Lịch hẹn: Chuyển sang Tab Appointment
          if (id === 4 || screen === 'AppointmentScreen' || screen === 'AppointmentTab' || screen === mainRoute.myAppointment) {
            navigation.getParent()?.navigate('AppointmentTab');
            return;
          }

          if (screen) {
            navigation.navigate(screen);
          }
        }}
      />
    );
  };

  const handleSetting = () => {
    navigation.navigate(mainRoute.settingScreen);
  };

  const handleEditDoctorProfile = () => {
    navigation.navigate(mainRoute.editProfileScreen);
  };

  // RENDER
  const renderContent = () => {
    return (
      <FlatList
        disableVirtualization
        style={{ flex: 1, paddingHorizontal: spacings.md }}
        data={ProfileMenu as IMenuProfile[]}
        extraData={ProfileMenu}
        keyExtractor={keyExtractor}
        renderItem={renderItemList}
        ListFooterComponent={renderVersion()}
        scrollsToTop={false}
      />
    );
  };

  const renderVersion = () => {
    let appVersion = '1.0.0';
    try {
      if (typeof getVersion === 'function') {
        appVersion = getVersion();
      }
    } catch {
      appVersion = '1.0.0';
    }

    return (
      <Row style={screenStyles.pV22}>
        <CText h6 color={colors.c667085}>
          {t('common.appVersion', { appVersion })}
        </CText>
      </Row>
    );
  };

  const renderRightHead = () => (
    <TouchableOpacity
      hitSlop={screenStyles.hitSlop20}
      onPress={handleSetting}
      style={styles.rightWrapper}
    >
      <Image source={images.doctor.setting} style={screenStyles.box26} />
    </TouchableOpacity>
  );

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
    const { avatar } = currentUser?.personalization ?? {};
    const { username, full_name, name } = currentUser ?? {};
    const { total_following } = currentUser?.statistics ?? {};

    return (
      <View style={screenStyles.pH24}>
        <Row start>
          <View
            style={[
              styles.imgWrap,
              {
                borderWidth: 1,
                borderColor: colors.cF9FAFB,
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
          <View style={{ flex: 1, marginLeft: spacings.md }}>
            <CText h4 w600 color={colors.c101828}>
              {full_name || name || username || ''}
            </CText>
            <Row start style={{ marginTop: 4 }}>
              <Pressable
                onPress={() => {
                  navigation.navigate(mainRoute.followingList);
                }}
              >
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
        <Pressable style={styles.btnWrap} onPress={handleEditDoctorProfile}>
          <Image source={images.doctor.ic_edit} style={screenStyles.box16} />
          <CText h5 w500 color={colors.primary} style={screenStyles.mL10}>
            {t('profile.editProfile', 'Edit Profile')}
          </CText>
        </Pressable>
      </View>
    );
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.getParent()?.navigate('HomeTab');
    }
  };

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={handleBack}
        rightComponent={renderRightHead()}
      />
      {renderProfileMenu()}
      <View style={styles.line} />
      {renderContent()}
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

export default AccountScreen;
