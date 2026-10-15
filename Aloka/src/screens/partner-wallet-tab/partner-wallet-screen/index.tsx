import { CHeader, Wrapper } from '@/components';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { CEmptyData } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({}));

const PartnerWalletScreen: React.FC<any> = ({ navigation, route }: any) => {
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
        leftComponentOnPress={() =>
          navigation.getParent()?.getParent()?.goBack()
        }
        rightComponentDisable
        title={t('common.wallet', 'Wallet')}
        isBorderBottom
      />
      {renderContent()}
    </Wrapper>
  );
};

export default PartnerWalletScreen;
