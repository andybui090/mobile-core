import { APILoading, HeaderBar, ImageHeader, Wrapper } from '@/components';
import { isIOS, ScreenWidth } from '@/configs';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { CText, EmptyBooking } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import UpcomingTab from './UpcomingTab';
import RequestTab from './RequestTab';
import CompletedTab from './CompletedTab';
import CancelTab from './CancelTab';
import ExpiredTab from './ExpiredTab';
import { ModalSheetSupport } from './ModalSheetSupport';
// import WorkInformation from './work-information';

export enum statusAppoinment {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',

  ON_THE_WAY = 'ON_THE_WAY', // đang di chuyển đến điểm hẹn
  ARRIVED = 'ARRIVED', // đã đến điểm hẹn (check-in)

  REJECTED = 'REJECTED', // từ chối bởi doctor
  CANCELED = 'CANCELED', // hủy bởi khách
  COMPLETED = 'COMPLETED', // hoàn thành
}

export const STATUS_COLORS = {
  completed: '#28A745',
  cancel: '#F87171',
  reject: '#DC2626',
  upcoming: '#0D6EFD',
  request: '#F59E0B',
  expired: '#DC2626',
};

const useStyles = makeStyles(({ colors }) => ({
  tabStyle: {
    width: 'auto',
  },
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 2,
  },
}));

const AppointmentScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const dispatch = useAppDispatch();

  // -------------------------------
  // STATE
  // -------------------------------
  const [index, setIndex] = useState<number>(0);

  const [routes] = useState([
    { key: 'upcoming', title: t('booking.upcoming', 'Upcoming') },
    { key: 'request', title: t('booking.request', 'Request') },
    { key: 'done', title: t('booking.completed', 'Completed') },
    { key: 'cancel', title: t('common.cancel', 'Cancel') },
    { key: 'expired', title: t('booking.expired', 'Expired') },
  ]);

  const [refreshIdx, setRefreshIdx] = useState<number>(-1);

  const [visibleDetail, setVisibleDetail] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  // -------------------------------
  // ACTION
  // -------------------------------

  const handleChatNurse = (item: any) => {};

  const handleSupportContact = () => {
    setVisibleDetail(true);
  };

  const handleRating = (service: any) => {
    // navigation.navigate(mainRoute.carelyReviewScreen, { service });
  };

  const handleReschedule = (service: any) => {
    // if (service.channel_id)
    //   GALogEvent(GAEvents.profile_doctor_viewed, {
    //     method: 'App profile doctor viewed',
    //   });
    // // navigation.navigate(mainRoute.channelDetailScreen, {
    // //   channelId: service.channel_id,
    // // });
    // // navigation.navigate(mainRoute.carelyServiceDetailScreen, {
    // //   channelId: service.channel_id,
    // // });
    // navigation.navigate(mainRoute.carelyServiceDetailScreen, {
    //   channelId: service.channel_id,
    //   packageId: service.package_id,
    // });
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------

  const renderTabBar = (props: any) => {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          // paddingHorizontal: isIOS ? 8 : 0,
          borderBottomColor: colors.cEAECF0,
        }}
      >
        <TabBar
          {...props}
          scrollEnabled
          style={{
            backgroundColor: 'transparent',
          }}
          activeColor={colors.primary}
          inactiveColor={colors.c667085}
          tabStyle={styles.tabStyle}
          indicatorStyle={styles.indicatorStyle}
          renderLabel={({ route, focused, color }: any) => {
            const labelColor = focused ? colors.primary : colors.c667085;
            return (
              <CText
                h5
                w500
                style={{
                  color: labelColor,
                }}
              >
                {route.title}
              </CText>
            );
          }}
        />
      </View>
    );
  };

  const renderScene = ({ route, jumpTo }: any) => {
    switch (route.key) {
      case 'upcoming':
        return (
          <UpcomingTab
            navigation={navigation}
            refreshIdx={refreshIdx}
            onChatNurse={handleChatNurse}
            onContactSupport={handleSupportContact}
          />
        );
      case 'request':
        return (
          <RequestTab
            refreshIdx={refreshIdx}
            onChatNurse={handleChatNurse}
            onContactSupport={handleSupportContact}
          />
        );
      case 'done':
        return (
          <CompletedTab
            refreshIdx={refreshIdx}
            onReview={handleRating}
            onReschedule={handleReschedule}
            onChatNurse={handleChatNurse}
          />
        );
      case 'cancel':
        return (
          <CancelTab refreshIdx={refreshIdx} onChatNurse={handleChatNurse} />
        );
      case 'expired':
        return (
          <ExpiredTab
            refreshIdx={refreshIdx}
            onChatNurse={handleChatNurse}
            onContactSupport={handleSupportContact}
          />
        );
      default:
        break;
    }
  };

  return (
    <Wrapper>
      <ImageHeader />
      <HeaderBar />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: ScreenWidth }}
        lazy={true}
      />
      {showAlert ? (
        <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
      ) : null}
      <ModalSheetSupport
        isVisible={visibleDetail}
        hideModal={() => setVisibleDetail(false)}
      />
    </Wrapper>
  );
};

export default AppointmentScreen;
