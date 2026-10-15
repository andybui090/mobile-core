import { CEmptyData } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  container: { flex: 1, backgroundColor: colors.cF9FAFB },
}));


const Conversations: React.FC<any> = ({}) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  // STATE
  

  // RENDER
  return (
    <View style={styles.container}>
      <CEmptyData />
    </View>
  );
};

export default Conversations;
