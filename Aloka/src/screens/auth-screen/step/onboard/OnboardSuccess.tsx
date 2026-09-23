import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { IconX, Wrapper } from '@/components';
import { CText } from '@/utils';

interface Props {
  onBookNow: () => void;
  onGoHome: () => void;
}

export const OnboardSuccess: React.FC<Props> = ({ onBookNow, onGoHome }) => {
  const { t } = useTranslation();

  return (
    <Wrapper safeTop safeBottom style={styles.wrapper}>
      {/* Center content */}
      <View style={styles.centerSection}>
        {/* Triple concentric circles with checkmark */}
        <View style={styles.outerCircle}>
          <View style={styles.middleCircle}>
            <View style={styles.innerCircle}>
              <IconX
                type="ionicons"
                name="checkmark"
                size={34}
                color="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Success heading & subtitle */}
        <CText style={styles.title}>
          {t('onboarding.successTitle', 'Bạn đã tạo tài khoản thành công')}
        </CText>
        <CText style={styles.subtitle}>
          {t('onboarding.successSubtitle', 'Tài khoản Aloka của bạn đã sẵn sàng')}
        </CText>
      </View>

      {/* Bottom action buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onBookNow}
          style={styles.btnBookNow}
        >
          <CText style={styles.btnBookNowText}>
            {t('onboarding.bookNow', 'Đặt lịch ngay')}
          </CText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onGoHome}
          style={styles.btnGoHome}
        >
          <CText style={styles.btnGoHomeText}>
            {t('onboarding.goHome', 'Về trang chủ')}
          </CText>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  outerCircle: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: '#EDFBF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#A6EBD8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#12B76A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#12B76A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
    marginTop: 28,
  },
  subtitle: {
    fontSize: 14,
    color: '#667085',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  btnBookNow: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#14988D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnBookNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  btnGoHome: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E0F7F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGoHomeText: {
    color: '#14988D',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default OnboardSuccess;
