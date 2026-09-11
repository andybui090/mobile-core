import { CHeader, Wrapper } from '@/components';
import { appointmentTabRoute, homeTabRoute } from '@/constants';
import { CButton, CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import EmptyBooking from './EmptyBooking';

const useStyles = makeStyles(({ colors }) => ({
  tabBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0 || '#EAECF0',
    backgroundColor: colors.white || '#FFFFFF',
  },
  tabBarScroll: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 6,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
  },
  tabText: {
    fontSize: 14,
    color: colors.c667085 || '#667085',
  },
  tabTextActive: {
    color: '#0D6EFD',
    fontWeight: '600' as const,
  },
  indicatorStyle: {
    position: 'absolute' as const,
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: '#0D6EFD',
    borderRadius: 1,
  },
  contentContainer: {
    flex: 1,
  },
  bottomBtnWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white || '#FFFFFF',
  },
}));

const AppointmentScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const [index, setIndex] = useState<number>(route?.params?.idxTab || 0);

  const routes = [
    { key: 'upcoming', title: t('booking.upcoming', 'Sắp tới') },
    { key: 'request', title: t('booking.request', 'Yêu cầu') },
    { key: 'done', title: t('booking.completed', 'Đã hoàn thành') },
    { key: 'cancel', title: t('booking.cancel', 'Hủy') },
    { key: 'expired', title: t('booking.expired', 'Đã hết hạn') },
  ];

  // -------------------------------
  // ACTION
  // -------------------------------
  const handleFindService = () => {
    navigation.navigate('HomeTab');
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------
  const renderTabBar = () => {
    return (
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {routes.map((tab, idx) => {
            const isFocused = index === idx;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => setIndex(idx)}
                style={styles.tabItem}
              >
                <CText
                  h5
                  w500
                  style={StyleSheet.flatten([
                    styles.tabText,
                    isFocused && styles.tabTextActive,
                  ])}
                >
                  {tab.title}
                </CText>
                {isFocused && <View style={styles.indicatorStyle} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const handleGoToAppointmentList = () => {
    navigation.navigate(appointmentTabRoute.appointmentList);
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <EmptyBooking onPress={handleGoToAppointmentList} />
      </View>
    );
  };

  return (
    <Wrapper>
      <CHeader
        title={t('profile.appoints', 'Lịch hẹn')}
        isBorderBottom
        leftComponentDisable
      />
      {renderTabBar()}
      {renderContent()}
      <View style={styles.bottomBtnWrap}>
        <CButton
          title={t('carely.findService', 'Tìm dịch vụ mới')}
          onPress={handleFindService}
          paddingVertical={12}
          backgroundColor={colors.c19A2A7 || '#19A2A7'}
          btnWidth={'100%'}
        />
      </View>
    </Wrapper>
  );
};

export default AppointmentScreen;
