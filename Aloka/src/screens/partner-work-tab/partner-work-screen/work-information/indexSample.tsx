import { IconType, IconX } from '@/components';
import { images } from '@/configs';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';

export type WorkStatus = 'request' | 'scheduled' | 'completed' | 'cancelled';

export type WorkInformationItem = {
  id: string;
  status: WorkStatus;
  customerName: string;
  customerAvatar?: string;
  serviceName: string;
  cancellationLabel?: string;
  note?: string;
  dateLabel: string;
  timeLabel: string;
  address: string;
  amount: number;
};

type Props = {
  items?: WorkInformationItem[];
  onCall?: (item: WorkInformationItem) => void;
  onChat?: (item: WorkInformationItem) => void;
  onReject?: (item: WorkInformationItem) => void;
  onAccept?: (item: WorkInformationItem) => void;
};

const statusTabs: { key: WorkStatus; label: string }[] = [
  { key: 'request', label: 'Yêu cầu' },
  { key: 'scheduled', label: 'Lịch hẹn' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Huỷ' },
];

const sampleItems: WorkInformationItem[] = [{
  id: 'sample-request',
  status: 'request',
  customerName: 'Tên Khách hàng',
  serviceName: 'Tắm bé - Massage',
  cancellationLabel: 'Tự động huỷ: 01:00',
  note: 'Đến gọi trước, bé bị dị ứng xà bông .....',
  dateLabel: 'Thứ 4, Ngày 25/01/2026',
  timeLabel: '15:30 PM - 17:00 PM',
  address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
  amount: 219000,
}];

const useStyles = makeStyles(({ colors }) => ({
  container: { flex: 1, backgroundColor: colors.cF9FAFB },
  tabs: {
    flexDirection: 'row' as const,
    paddingHorizontal: 12,
    paddingVertical: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F2F4F7',
  },
  activeTab: { backgroundColor: colors.primary },
  list: { padding: 16, paddingTop: 0 },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cEAECF0,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: 'hidden' as const,
  },
  customerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0,
    backgroundColor: colors.cF9FAFB,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  customerName: { flex: 1, marginHorizontal: 10 },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginLeft: 12,
  },
  body: { padding: 16 },
  serviceRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: 8,
  },
  serviceName: { flex: 1 },
  cancellation: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FFF3F3',
  },
  note: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFF3F3',
    gap: 8,
  },
  noteText: { flex: 1 },
  details: {
    marginTop: 8,
    paddingVertical: 12,
    gap: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.cEAECF0,
  },
  detailRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  detailText: { flex: 1 },
  amountRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: 10,
  },
  actions: { flexDirection: 'row' as const, gap: 8, marginTop: 24 },
  actionButton: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
  },
  rejectButton: { borderColor: '#FF3B30' },
  acceptButton: { borderColor: colors.primary, backgroundColor: colors.primary },
  empty: { textAlign: 'center' as const, marginTop: 32 },
}));

const WorkInformation: React.FC<Props> = ({
  items = sampleItems,
  onCall,
  onChat,
  onReject,
  onAccept,
}) => {
  const styles = useStyles();
  const { theme: { colors } } = useTheme();
  const [status, setStatus] = useState<WorkStatus>('request');

  const renderItem = ({ item }: { item: WorkInformationItem }) => (
    <View style={styles.card}>
      <View style={styles.customerRow}>
        <Image
          source={item.customerAvatar ? { uri: item.customerAvatar } : images.global.no_avatar}
          style={styles.avatar}
        />
        <CText h56 w500 color={colors.c101828} style={styles.customerName}>
          {item.customerName}
        </CText>
        {[
          { icon: 'phone', label: 'Gọi khách hàng', callback: onCall },
          { icon: 'chat', label: 'Trò chuyện với khách hàng', callback: onChat },
        ].map(({ icon, label, callback }) => (
          <Pressable
            key={icon}
            accessibilityRole="button"
            accessibilityLabel={label}
            style={styles.contactButton}
            disabled={!callback}
            onPress={() => callback?.(item)}
          >
            <IconX type={IconType.ENTYPO} name={icon} size={24} color={colors.white} />
          </Pressable>
        ))}
      </View>
      <View style={styles.body}>
        <View style={styles.serviceRow}>
          <CText h56 w500 color={colors.c101828} style={styles.serviceName}>
            {item.serviceName}
          </CText>
          {item.status === 'request' && !!item.cancellationLabel && (
            <View style={styles.cancellation}>
              <CText h6 color="#FF3B30">{item.cancellationLabel}</CText>
            </View>
          )}
        </View>
        {!!item.note && (
          <View style={styles.note}>
            <IconX type={IconType.ENTYPO} name="text-document" size={16} color="#FF3B30" />
            <CText h6 color="#FF3B30" style={styles.noteText} numberOfLines={1}>
              {item.note}
            </CText>
          </View>
        )}
        <View style={styles.details}>
          {[
            { icon: 'calendar', value: item.dateLabel },
            { icon: 'clock', value: item.timeLabel },
            { icon: 'location-pin', value: item.address },
          ].map(({ icon, value }) => (
            <View key={icon} style={styles.detailRow}>
              <IconX type={IconType.ENTYPO} name={icon} size={18} color={colors.c667085} />
              <CText h6 color={colors.c101828} style={styles.detailText}>{value}</CText>
            </View>
          ))}
        </View>
        <View style={styles.amountRow}>
          <CText h56 color={colors.c101828}>Tổng tiền nhận được</CText>
          <CText h56 w600 color="#FF3B30">
            {item.amount.toLocaleString('vi-VN')}đ
          </CText>
        </View>
        {item.status === 'request' && (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              style={[styles.actionButton, styles.rejectButton]}
              disabled={!onReject}
              onPress={() => onReject?.(item)}
            >
              <CText h6 color="#FF3B30">Từ chối</CText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[styles.actionButton, styles.acceptButton]}
              disabled={!onAccept}
              onPress={() => onAccept?.(item)}
            >
              <CText h6 color={colors.white}>Chấp nhận</CText>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {statusTabs.map(({ key, label }) => (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: status === key }}
            style={[styles.tab, status === key && styles.activeTab]}
            onPress={() => setStatus(key)}
          >
            <CText h56 color={status === key ? colors.white : colors.c667085}>{label}</CText>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={items.filter(item => item.status === status)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<CText h56 color={colors.c667085} style={styles.empty}>Chưa có công việc</CText>}
      />
    </View>
  );
};

export default WorkInformation;
