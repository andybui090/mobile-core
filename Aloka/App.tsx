import { CHeader, Wrapper } from '@/components';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
}));

const App: React.FC<any> = ({ navigation, route }: any) => {
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
    return null;
  };

  const renderLeftHead = () => null;

  const renderRightHead = () => null;

  return (
    <Wrapper>
      <CHeader
        rightComponent={renderRightHead()}
        leftComponent={renderLeftHead()}
      />
      {renderContent()}
    </Wrapper>
  );
};

export default App;
