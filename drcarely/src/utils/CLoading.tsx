import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { CText } from './CText';
import { useTranslation } from 'react-i18next';

export enum typeLoading {
  small = 'small',
  large = 'large',
}
interface Props {
  title?: string;
  loadingSize?: typeLoading;
  colorLoading?: string;
}

export const CLoading = ({ title, loadingSize, colorLoading = '#0080F6' }: Props) => {
  const { t } = useTranslation();
  return (
    <View style={styles.viewLoading}>
      <ActivityIndicator size={loadingSize || 'large'} color={colorLoading} />
      {loadingSize == typeLoading.small ? (
        <CText h7 w500 style={{ color: colorLoading, marginTop: 5 }}>
          {title || t("common.loading", 'Loading...')}
        </CText>
      ) : (
        <CText h6 w500 style={{ color: colorLoading, marginTop: 5 }}>
          {title || t("common.loading", 'Loading...')}
        </CText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
