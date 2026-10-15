import { IconType, IconX } from '@/components';
import { images } from '@/configs';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, ScrollView, View } from 'react-native';
import UpcomingTab from './UpcomingTab';
import RequestTab from './RequestTab';
import CompletedTab from './CompletedTab';
import CancelTab from './CancelTab';
import ExpiredTab from './ExpiredTab';
import { ModalSheetSupport } from './ModalSheetSupport';

const useStyles = makeStyles(({ colors }) => ({
  container: { flex: 1, backgroundColor: colors.cF9FAFB },
  tabScroll: { flexGrow: 0 },
  tabs: {
    flexDirection: 'row' as const,
    paddingHorizontal: 12,
    paddingVertical: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F2F4F7',
  },
  activeTab: { backgroundColor: colors.primary },
}));

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

export type WorkStatus = 'upcoming' | 'request' | 'done' | 'cancel' | 'expired';

type Props = {
  //   items?: WorkInformationItem[];
  //   onCall?: (item: WorkInformationItem) => void;
  //   onChat?: (item: WorkInformationItem) => void;
  //   onReject?: (item: WorkInformationItem) => void;
  //   onAccept?: (item: WorkInformationItem) => void;
};

const WorkInformation: React.FC<Props> = ({}) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  // STATE
  const statusTabs: { key: WorkStatus; label: string }[] = [
    { key: 'upcoming', label: t('booking.upcoming', 'Upcoming') },
    { key: 'request', label: t('booking.request', 'Request') },
    { key: 'done', label: t('booking.completed', 'Completed') },
    { key: 'cancel', label: t('common.cancel', 'Cancel') },
    { key: 'expired', label: t('booking.expired', 'Expired') },
  ];

  const [status, setStatus] = useState<WorkStatus>('upcoming');

  const [refreshIdx, setRefreshIdx] = useState<number>(-1);

  const [visibleDetail, setVisibleDetail] = useState(false);
  
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

  // RENDER

  const renderHeadTabs = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabs}
      >
        {statusTabs.map(({ key, label }) => (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: status === key }}
            style={[styles.tab, status === key && styles.activeTab]}
            onPress={() => setStatus(key)}
          >
            <CText h56 color={status === key ? colors.white : colors.c667085}>
              {label}
            </CText>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const renderContentTab = () => {
    switch (status) {
      case 'upcoming':
        return <UpcomingTab />;
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
    <View style={styles.container}>
      {renderHeadTabs()}
      {renderContentTab()}
      <ModalSheetSupport
        isVisible={visibleDetail}
        hideModal={() => setVisibleDetail(false)}
      />
    </View>
  );
};

export default WorkInformation;
