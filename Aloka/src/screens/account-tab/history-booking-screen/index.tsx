import { CHeader, Wrapper } from '@/components';
import { isIOS, ScreenWidth } from '@/configs';
import { goBack } from '@/navigation/RootNavigation';
import { CEmptyData, CText } from '@/utils';
import { useIsFocused } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
// import HistoryChatTab from './HistoryChatTab';
import PackageTab from './PackageTab';
import HistoryChatTab from './HistoryChatTab';

const useStyles = makeStyles(({ colors }) => ({
  bgRow: {
    borderBottomColor: colors.cEAECF0,
    borderBottomWidth: 1,
    paddingLeft: 20,
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabStyle: {
    width: 'auto',
  },
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 2,
  },
}));

const HistoryBookingScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const toastEl = useRef<any>(null);
  const {
    theme: { colors },
  } = useTheme();

  const styles = useStyles();

  //State & Props

  //update
  // const [index, setIndex] = useState<number>(0);
  const [index, setIndex] = useState<number>(route.params?.idxTab || 0);
  const [refreshIdx, setRefreshIdx] = useState<number>(-1);

  const [routes] = useState([
    { key: 'packages', title: t('profile.myPackage', 'Gói dịch vụ của tôi') },
    { key: 'historyChat', title: t('package.chatHistory', 'Chat history') },
  ]);

  const isFocusScreen = useIsFocused();

  useEffect(() => {
    if (isFocusScreen) {
      if (route.params?.idxTab) {
        setIndex(route.params?.idxTab || 0);
        setRefreshIdx(route.params?.idxTab || -1);
      }
    }
  }, [route.params, isFocusScreen]);

  //ACTION

  //RENDER
  const renderTabBar = (props: any) => {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          paddingHorizontal: isIOS ? 8 : 0,
          borderBottomColor: colors.cEAECF0,
        }}
      >
        <TabBar
          {...props}
          scrollEnabled
          style={{
            backgroundColor: colors.white,
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

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'packages':
        return (
          <PackageTab
            navigation={navigation}
            refreshIdx={refreshIdx}
            isFocusScreen={isFocusScreen}
          />
        );
      case 'historyChat':
        return (
          <HistoryChatTab navigation={navigation} refreshIdx={refreshIdx} />
        );
      default:
        return null;
    }
  };

  const renderTab = () => {
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: ScreenWidth }}
        lazy={false}
      />
    );
  };

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={goBack}
        title={t('profile.serviceBookingHistory', 'Lịch sử đặt dịch vụ')}
        isBorderBottom
      />
      {renderTab()}
    </Wrapper>
  );
};

export default HistoryBookingScreen;
