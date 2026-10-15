import { CHeader, Wrapper } from '@/components';
import { goBack } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { CEmptyData } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({}));

const MyServicesScreen: React.FC<any> = ({ navigation, route }: any) => {
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

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={goBack}
        rightComponentDisable
        isBorderBottom
        title={t('expert.myServices')}
      />
      {renderContent()}
    </Wrapper>
  );
};

export default MyServicesScreen;
