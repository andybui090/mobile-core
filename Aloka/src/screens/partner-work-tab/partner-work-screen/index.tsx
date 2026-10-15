import { CHeader, Wrapper } from '@/components';
import { ScreenWidth } from '@/configs';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabBar, TabView } from 'react-native-tab-view';
import WorkInformation from './work-information';
import Conversations from './conversations';

const useStyles = makeStyles(({ colors }) => ({
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 2,
  },
}));

const PartnerWorkScreen: React.FC<any> = ({ navigation, route }: any) => {
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
    {
      key: 'WorkInformation',
      title: t('work.workInformation', 'Work Information'),
    },
    {
      key: 'Conversations',
      title: t('work.conversations', 'Conversations'),
    },
  ]);

  // -------------------------------
  // ACTION
  // -------------------------------

  // -------------------------------
  // RENDER UI
  // -------------------------------

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        scrollEnabled={false}
        style={{
          backgroundColor: colors.white,
        }}
        activeColor={colors.primary}
        inactiveColor={colors.c667085}
        indicatorStyle={styles.indicatorStyle}
        renderLabel={({ route, focused, color }: any) => {
          const labelColor = focused ? colors.primary : colors.c667085;
          return (
            <CText
              h5
              style={{
                color: labelColor,
              }}
            >
              {route.title}
            </CText>
          );
        }}
      />
    );
  };

  const renderScene = ({ route, jumpTo }: any) => {
    switch (route.key) {
      case 'WorkInformation':
        return <WorkInformation />;
      case 'Conversations':
        return <Conversations />;
      default:
        break;
    }
  };

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={() =>
          navigation.getParent()?.getParent()?.goBack()
        }
        rightComponentDisable
        title={t('common.work')}
        isBorderBottom
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: ScreenWidth }}
        lazy={true}
      />
    </Wrapper>
  );
};

export default PartnerWorkScreen;
