import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { CHeader, IconX, Wrapper } from '@/components';
import { CText } from '@/utils';

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white || '#FFFFFF',
    },
    headerRightBtn: {
      position: 'absolute',
      right: 16,
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    emptyIconWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: '#F2F4F7',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    emptyTitle: {
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtitle: {
      textAlign: 'center',
      lineHeight: 20,
    },
  })
);

export const PackageManageScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleCreatePackage = () => {
    navigation.navigate('CreatePackageScreen');
  };

  const renderHeaderRight = () => (
    <TouchableOpacity
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      activeOpacity={0.7}
      onPress={handleCreatePackage}
      style={styles.headerRightBtn}
    >
      <IconX
        type="ionicons"
        name="add"
        size={28}
        color={colors.c101828 || '#101828'}
      />
    </TouchableOpacity>
  );

  return (
    <Wrapper style={styles.container}>
      <CHeader
        title={t('partnerProfile.managePackages', 'Quản lý gói')}
        isBorderBottom
        leftComponentOnPress={handleBack}
        rightComponent={renderHeaderRight()}
      />

      <View style={styles.emptyContent}>
        <View style={styles.emptyIconWrap}>
          <IconX
            type="ionicons"
            name="cube-outline"
            size={36}
            color={colors.c98A2B3 || '#98A2B3'}
          />
        </View>
        <CText h4 w600 color={colors.c101828 || '#101828'} style={styles.emptyTitle}>
          {t('packageManage.emptyTitle', 'Chưa có gói dịch vụ nào')}
        </CText>
        <CText h5 color={colors.c667085 || '#667085'} style={styles.emptySubtitle}>
          {t('packageManage.emptyDesc', 'Nhấn dấu + ở góc trên bên phải để tạo gói dịch vụ')}
        </CText>
      </View>
    </Wrapper>
  );
};

export default PackageManageScreen;
