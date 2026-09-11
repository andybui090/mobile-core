import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '@/components';
import { CText } from '@/utils';

interface BookingSuccessProps {
  navigation?: any;
  route?: any;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ navigation, route }) => {
  const service = route?.params?.service;

  const transactionCode = '#CLY-2026-001122';
  const serviceTime = '15:30 PM - 17:00 PM,\nthứ 4, ngày 25/01/2026';
  const serviceTitle = service?.title || 'Dịch vụ Nuôi sinh & Chăm\nsóc mẹ bé tại bệnh viện';
  const nurseName = service?.subtitle || 'Thúy Ngọc';
  const purchaseDate = '08:47 AM - 24/01/2026';
  const paymentMethod = 'Ví điện tử/Thẻ nội điện';
  const totalPrice = service?.price || '219.000đ';

  const handleDownloadPdf = () => {
    // Action for downloading invoice PDF
  };

  const handleGoToMyPackages = () => {
    if (navigation?.navigate) {
      navigation.navigate('AppointmentList');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <CText style={styles.headerTitle}>Thông tin thanh toán</CText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Icon with concentric circles */}
        <View style={styles.iconContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.midCircle}>
              <View style={styles.innerCircle}>
                <IconX type="ionicons" name="checkmark" size={38} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </View>

        {/* Title & Subtitle */}
        <CText style={styles.successTitle}>Giao dịch thành công</CText>
        <CText style={styles.successSubtitle}>
          Cảm ơn bạn đã thanh toán dịch vụ của chúng tôi
        </CText>

        {/* Details List */}
        <View style={styles.detailsCard}>
          {/* Mã giao dịch */}
          <View style={styles.infoRow}>
            <CText style={styles.infoLabel}>Mã giao dịch</CText>
            <CText style={styles.infoValueBold}>{transactionCode}</CText>
          </View>

          {/* Thời gian */}
          <View style={styles.infoRow}>
            <CText style={styles.infoLabel}>Thời gian</CText>
            <CText style={[styles.infoValueBold, styles.textRight]}>
              {serviceTime}
            </CText>
          </View>

          {/* Dịch vụ */}
          <View style={styles.infoRow}>
            <CText style={styles.infoLabel}>Dịch vụ</CText>
            <CText style={[styles.infoValueBold, styles.textRight]}>
              {serviceTitle}
            </CText>
          </View>

          {/* Tên điều dưỡng */}
          <View style={styles.infoRow}>
            <CText style={styles.infoLabel}>Tên điều dưỡng</CText>
            <CText style={styles.nurseNameText}>{nurseName}</CText>
          </View>

          {/* Ngày mua */}
          <View style={styles.infoRow}>
            <CText style={styles.infoLabel}>Ngày mua</CText>
            <CText style={styles.infoValueBold}>{purchaseDate}</CText>
          </View>

          {/* Phương thức */}
          <View style={styles.infoRow}>
            <CText style={styles.infoLabel}>Phương thức</CText>
            <CText style={styles.infoValueBold}>{paymentMethod}</CText>
          </View>

          {/* Tổng thanh toán */}
          <View style={styles.infoRowTotal}>
            <CText style={styles.infoLabel}>Tổng thanh toán</CText>
            <CText style={styles.totalPriceText}>{totalPrice}</CText>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.downloadPdfBtn}
          activeOpacity={0.7}
          onPress={handleDownloadPdf}
        >
          <CText style={styles.downloadPdfText}>Tải hóa đơn PDF</CText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.myPackagesBtn}
          activeOpacity={0.8}
          onPress={handleGoToMyPackages}
        >
          <CText style={styles.myPackagesText}>Gói dịch vụ của tôi</CText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 24,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  outerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E6F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  midCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#B2EBE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 13.5,
    color: '#475467',
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsCard: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#667085',
    flex: 1,
  },
  infoValueBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
    maxWidth: '65%',
  },
  textRight: {
    textAlign: 'right',
    lineHeight: 20,
  },
  nurseNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0080FF',
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D9488',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  downloadPdfBtn: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#0D9488',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadPdfText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D9488',
  },
  myPackagesBtn: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPackagesText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
