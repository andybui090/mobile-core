import React, { useEffect } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { images } from '@/configs';
import { Wrapper } from '@/components';
import { CText } from '@/utils';
import { useIsFocused } from '@react-navigation/native';
import { openDoctorNetworkApp } from '@/navigation/app-helper';

const DrNetworkScreen: React.FC<any> = ({ navigation }: any) => {
  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      openDoctorNetworkApp();
      const timer = setTimeout(() => {
        navigation.navigate('HomeTab');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFocus, navigation]);

  return (
    <Wrapper>
      <View style={styles.container}>
        <Image
          source={images.bottomTab.drnetwork}
          style={styles.logo}
          resizeMode="contain"
        />
        <CText style={styles.title}>Doctor Network</CText>
        <CText style={styles.subtitle}>
          Đang kết nối và mở ứng dụng Doctor Network...
        </CText>

        <TouchableOpacity
          style={styles.openButton}
          activeOpacity={0.8}
          onPress={openDoctorNetworkApp}
        >
          <CText style={styles.openButtonText}>Mở ứng dụng Doctor Network</CText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <CText style={styles.backButtonText}>Quay lại trang chủ</CText>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  openButton: {
    backgroundColor: '#19A2A7',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#19A2A7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#667085',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DrNetworkScreen;
