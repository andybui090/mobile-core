import { IconType, IconX } from '@/components';
import { images } from '@/configs';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, ScrollView, View } from 'react-native';
import UpcomingTab from './UpcomingTab';

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
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {renderHeadTabs()}
      {renderContentTab()}
    </View>
  );
};

export default WorkInformation;
