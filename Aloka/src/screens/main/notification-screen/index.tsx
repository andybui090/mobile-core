import { Wrapper } from '@/components';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import NotificationList from '@/screens/layout/notification';

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
  },
}));

const NotificationScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const dispatch = useAppDispatch();

  // -------------------------------
  // STATE
  // -------------------------------

  // -------------------------------
  // ACTION
  // -------------------------------

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------

  const renderContent = () => {
    return <NotificationList onBack={handleBack} />;
  };

  return (
    <Wrapper style={styles.container}>
      {renderContent()}
    </Wrapper>
  );
};

export default NotificationScreen;
