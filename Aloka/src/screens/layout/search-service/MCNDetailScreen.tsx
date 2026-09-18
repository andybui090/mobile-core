import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconX, ImageHelper } from '@/components';
import { formatMoneyVND } from '@/configs/common';
import { images } from '@/configs/image';
import { homeTabRoute, mainRoute } from '@/constants';
import { CText } from '@/utils';
import { MCNDoctor, MCNHospital, MCNService, MOCK_MCN_LIST } from './MCNMockData';

const { width } = Dimensions.get('window');

export const MCNDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Nhận hospital hoặc mcnId từ params
  const { hospital: routeHospital, mcnId } = route.params || {};

  const hospital: MCNHospital =
    routeHospital ||
    MOCK_MCN_LIST.find(h => h.id === mcnId) ||
    MOCK_MCN_LIST[0];

  const [activeDoctorFilter, setActiveDoctorFilter] = useState<'ALL' | 'HAS_SERVICE'>('ALL');

  const doctors = hospital.doctors || [];
  const filteredDoctors =
    activeDoctorFilter === 'HAS_SERVICE'
      ? doctors.filter(d => d.hasServices && d.services.length > 0)
      : doctors;

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Thông báo', `Không thể gọi tới số ${phoneNumber}`);
    });
  };

  const handleEmail = (emailStr: string) => {
    Linking.openURL(`mailto:${emailStr}`).catch(() => {
      Alert.alert('Thông báo', `Không thể mở ứng dụng gửi thư tới ${emailStr}`);
    });
  };

  const handleBookService = (service: MCNService, doctor: MCNDoctor) => {
    // Chuyển sang màn hình chi tiết dịch vụ để xem thông tin và tiến hành đặt lịch
    navigation.navigate(homeTabRoute.carelyServiceDetailScreen || mainRoute.carelyServiceDetailScreen, {
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        time_package: service.duration,
        description: service.description,
        is_book_service: 1,
        mcn_id: doctor.mcn_id,
        mcn_name: doctor.mcn_name,
        channel_id: service.channel_id,
        user_id: doctor.id,
        doctor: {
          id: doctor.id,
          full_name: doctor.full_name,
          avatar: doctor.avatar,
          position: doctor.position,
        },
        channel: {
          name: doctor.mcn_name,
          owner_id: doctor.id,
        },
      },
    });
  };

  const renderDoctorItem = ({ item }: { item: MCNDoctor }) => {
    return (
      <View style={styles.doctorCard}>
        {/* Doctor Header Info */}
        <View style={styles.doctorHeaderRow}>
          <ImageHelper
            source={{ uri: item.avatar }}
            style={styles.doctorAvatar}
            resizeMode="cover"
          />
          <View style={styles.doctorInfoCol}>
            <View style={styles.doctorNameRow}>
              <CText style={styles.doctorName}>{item.full_name}</CText>
              <View style={styles.verifiedBadge}>
                <IconX type="ionicons" name="checkmark-circle" size={15} color="#14B8A6" />
              </View>
            </View>

            <CText style={styles.doctorPosition}>{item.position}</CText>
            <CText style={styles.doctorSpecialization} numberOfLines={1}>
              {item.specialization}
            </CText>

            {/* MCN ID Tag */}
            <View style={styles.mcnTagRow}>
              <View style={styles.mcnBadge}>
                <IconX type="ionicons" name="business-outline" size={11} color="#0284C7" />
                <CText style={styles.mcnBadgeText}>MCN: {item.mcn_id}</CText>
              </View>
              <View style={styles.ratingBadge}>
                <IconX type="ionicons" name="star" size={11} color="#F59E0B" />
                <CText style={styles.ratingText}>{item.rating.toFixed(1)}</CText>
                <CText style={styles.reviewCountText}>({item.total_reviews})</CText>
              </View>
            </View>
          </View>
        </View>

        {/* Doctor Services List */}
        {item.services && item.services.length > 0 ? (
          <View style={styles.servicesSection}>
            <CText style={styles.servicesTitle}>
              Gói dịch vụ khám & chăm sóc ({item.services.length}):
            </CText>
            {item.services.map((srv, idx) => (
              <View key={String(srv.id || idx)} style={styles.serviceItemBox}>
                <View style={styles.serviceLeft}>
                  <CText style={styles.serviceName} numberOfLines={2}>
                    {srv.name}
                  </CText>
                  <View style={styles.serviceMetaRow}>
                    <IconX type="ionicons" name="time-outline" size={12} color="#667085" />
                    <CText style={styles.serviceDuration}>{srv.duration} phút</CText>
                    <CText style={styles.serviceDivider}>•</CText>
                    <CText style={styles.servicePrice}>{formatMoneyVND(srv.price, '.')}</CText>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.bookNowBtn}
                  activeOpacity={0.7}
                  onPress={() => handleBookService(srv, item)}
                >
                  <CText style={styles.bookNowBtnText}>Đặt lịch</CText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noServiceBox}>
            <CText style={styles.noServiceText}>Bác sĩ hiện chưa cập nhật gói đặt lịch</CText>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle} numberOfLines={1}>
          Bệnh viện đối tác (MCN)
        </CText>
        <TouchableOpacity
          style={styles.shareBtn}
          activeOpacity={0.7}
          onPress={() => handleCall(hospital.phone)}
        >
          <IconX type="ionicons" name="call-outline" size={20} color="#14B8A6" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Hospital Cover & Banner Card */}
        <View style={styles.hospitalCard}>
          <Image
            source={{ uri: hospital.coverImage || hospital.avatar }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.hospitalHeaderInfo}>
            <View style={styles.hospitalAvatarWrap}>
              <ImageHelper
                source={{ uri: hospital.avatar }}
                style={styles.hospitalAvatar}
                resizeMode="cover"
              />
            </View>

            <View style={styles.hospitalTitleBlock}>
              <CText style={styles.hospitalName}>{hospital.name}</CText>
              <View style={styles.distanceBadgeRow}>
                <View style={styles.distanceChip}>
                  <IconX type="ionicons" name="navigate" size={12} color="#0D9488" />
                  <CText style={styles.distanceChipText}>Cách bạn {hospital.distanceKm} km</CText>
                </View>
                <View style={styles.ratingChip}>
                  <IconX type="ionicons" name="star" size={12} color="#F59E0B" />
                  <CText style={styles.ratingChipText}>{hospital.rating} ({hospital.totalReviews})</CText>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Contact & Info Box */}
          <View style={styles.hospitalMetaBox}>
            <View style={styles.metaRow}>
              <IconX type="ionicons" name="location-outline" size={16} color="#0D9488" />
              <CText style={styles.metaText}>{hospital.address}</CText>
            </View>
            <TouchableOpacity
              style={styles.metaRow}
              activeOpacity={0.7}
              onPress={() => handleEmail(hospital.email)}
            >
              <IconX type="ionicons" name="mail-outline" size={16} color="#0D9488" />
              <CText style={[styles.metaText, styles.linkText]}>{hospital.email}</CText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.metaRow}
              activeOpacity={0.7}
              onPress={() => handleCall(hospital.phone)}
            >
              <IconX type="ionicons" name="call-outline" size={16} color="#0D9488" />
              <CText style={[styles.metaText, styles.linkText]}>{hospital.phone}</CText>
            </TouchableOpacity>
            <View style={styles.metaRow}>
              <IconX type="ionicons" name="time-outline" size={16} color="#0D9488" />
              <CText style={styles.metaText}>{hospital.workingHours}</CText>
            </View>
          </View>

          <CText style={styles.hospitalDescription}>{hospital.description}</CText>
        </View>

        {/* Doctors Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <IconX type="ionicons" name="people" size={20} color="#14B8A6" />
            <CText style={styles.sectionTitle}>
              Danh sách Bác sĩ & Điều dưỡng ({doctors.length})
            </CText>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterPillsRow}>
            <TouchableOpacity
              style={[styles.filterPill, activeDoctorFilter === 'ALL' && styles.filterPillActive]}
              activeOpacity={0.7}
              onPress={() => setActiveDoctorFilter('ALL')}
            >
              <CText
                style={[
                  styles.filterPillText,
                  activeDoctorFilter === 'ALL' && styles.filterPillTextActive,
                ]}
              >
                Tất cả ({doctors.length})
              </CText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                activeDoctorFilter === 'HAS_SERVICE' && styles.filterPillActive,
              ]}
              activeOpacity={0.7}
              onPress={() => setActiveDoctorFilter('HAS_SERVICE')}
            >
              <CText
                style={[
                  styles.filterPillText,
                  activeDoctorFilter === 'HAS_SERVICE' && styles.filterPillTextActive,
                ]}
              >
                Có gói dịch vụ ({doctors.filter(d => d.hasServices).length})
              </CText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Doctor List */}
        <FlatList
          data={filteredDoctors}
          keyExtractor={item => String(item.id)}
          renderItem={renderDoctorItem}
          scrollEnabled={false}
          contentContainerStyle={styles.doctorList}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
  },
  scrollBody: {
    paddingBottom: 36,
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    paddingBottom: 16,
  },
  coverImage: {
    width: '100%',
    height: 140,
  },
  hospitalHeaderInfo: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -32,
    alignItems: 'flex-end',
  },
  hospitalAvatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#E6FAFA',
  },
  hospitalAvatar: {
    width: '100%',
    height: '100%',
  },
  hospitalTitleBlock: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 2,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 24,
  },
  distanceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  distanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  distanceChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  ratingChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  hospitalMetaBox: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  linkText: {
    color: '#0D9488',
    fontWeight: '500',
  },
  hospitalDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginHorizontal: 16,
    marginTop: 12,
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#0D9488',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  doctorList: {
    paddingHorizontal: 16,
    gap: 14,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  doctorHeaderRow: {
    flexDirection: 'row',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0FDFA',
  },
  doctorInfoCol: {
    flex: 1,
    marginLeft: 12,
  },
  doctorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  doctorPosition: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0D9488',
    marginTop: 2,
  },
  doctorSpecialization: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  mcnTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  mcnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  mcnBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  reviewCountText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  servicesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  servicesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  serviceItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  serviceLeft: {
    flex: 1,
    marginRight: 10,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 18,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  serviceDuration: {
    fontSize: 11,
    color: '#64748B',
  },
  serviceDivider: {
    fontSize: 11,
    color: '#94A3B8',
  },
  servicePrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  bookNowBtn: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  bookNowBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  noServiceBox: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  noServiceText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});

export default MCNDetailScreen;
