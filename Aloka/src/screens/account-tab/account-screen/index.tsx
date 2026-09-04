import { Wrapper } from '@/components';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { AppContext } from '@/contexts';
import PartnerProfileScreen from '@/screens/layout/partner-profile/PartnerProfileScreen';

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
  },
}));

const AccountScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const dispatch = useAppDispatch();
  const { user } = useContext<any>(AppContext) || {};

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
    return <PartnerProfileScreen />;
  };

  return (
    <Wrapper>
      {renderContent()}
    </Wrapper>
  );
};

export default AccountScreen;
