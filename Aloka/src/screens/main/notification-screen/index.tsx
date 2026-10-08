import { CHeader, Wrapper } from '@/components';
import { goBack } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { CEmptyData } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
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

  // -------------------------------
  // RENDER UI
  // -------------------------------

  const renderContent = () => {
    return <CEmptyData />;
  };

  const renderLeftHead = () => null;

  const renderRightHead = () => null;

  return (
    <Wrapper>
      <CHeader
        title={t('settings.notifications')}
        rightComponent={renderRightHead()}
        leftComponent={renderLeftHead()}
        leftComponentOnPress={goBack}
        isBorderBottom
      />
      {renderContent()}
    </Wrapper>
  );
};

export default NotificationScreen;
