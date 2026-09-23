/**
 * SimpleTimePickerModal – Grid bấm giờ trực tiếp
 * Dễ dùng hơn clock tròn và scroll wheel:
 *  - Hàng 1: chọn giờ (0-23) dạng grid nút bấm
 *  - Hàng 2: chọn phút (00, 15, 30, 45) dạng 4 nút
 * Props 100% tương thích ClockTimePickerModalProps.
 */
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CText } from '@/utils';

export interface ClockTimePickerModalProps {
  visible: boolean;
  initialTime?: string; // "HH:mm"
  onClose: () => void;
  onConfirm: (time: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);   // 0..23
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const pad = (n: number) => String(n).padStart(2, '0');

const snapMinute = (m: number): number =>
  MINUTES.reduce((prev, cur) =>
    Math.abs(cur - m) < Math.abs(prev - m) ? cur : prev,
  );

export const ClockTimePickerModal: React.FC<ClockTimePickerModalProps> = ({
  visible,
  initialTime = '08:00',
  onClose,
  onConfirm,
}) => {
  const [selHour, setSelHour] = useState(8);
  const [selMinute, setSelMinute] = useState(0);

  useEffect(() => {
    if (visible) {
      const [h = '8', m = '0'] = initialTime.split(':');
      setSelHour(Math.max(0, Math.min(parseInt(h, 10), 23)));
      setSelMinute(snapMinute(parseInt(m, 10)));
    }
  }, [visible, initialTime]);

  const handleConfirm = () => {
    onConfirm(`${pad(selHour)}:${pad(selMinute)}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={s.backdrop} onPress={onClose} />

      <View style={s.sheet}>
        {/* Header */}
        <View style={s.handle} />
        <CText style={s.title}>Chọn giờ</CText>

        {/* Live preview */}
        <View style={s.previewRow}>
          <CText style={s.previewText}>
            {pad(selHour)}:{pad(selMinute)}
          </CText>
        </View>

        {/* Hour grid */}
        <CText style={s.sectionLabel}>Giờ</CText>
        <ScrollView
          contentContainerStyle={s.hourGrid}
          showsVerticalScrollIndicator={false}
          style={s.hourScroll}
        >
          {HOURS.map(h => {
            const active = h === selHour;
            return (
              <TouchableOpacity
                key={h}
                activeOpacity={0.7}
                style={[s.hourBtn, active && s.hourBtnActive]}
                onPress={() => setSelHour(h)}
              >
                <CText style={[s.hourText, active && s.hourTextActive]}>
                  {pad(h)}
                </CText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Minute grid: 6 cols × 2 rows */}
        <CText style={s.sectionLabel}>Phút</CText>
        <View style={s.minuteGrid}>
          {MINUTES.map(m => {
            const active = m === selMinute;
            return (
              <TouchableOpacity
                key={m}
                activeOpacity={0.7}
                style={[s.minuteBtn, active && s.minuteBtnActive]}
                onPress={() => setSelMinute(m)}
              >
                <CText style={[s.minuteText, active && s.minuteTextActive]}>
                  {pad(m)}
                </CText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action buttons */}
        <View style={s.footer}>
          <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7} onPress={onClose}>
            <CText style={s.cancelText}>Hủy</CText>
          </TouchableOpacity>
          <TouchableOpacity style={s.confirmBtn} activeOpacity={0.8} onPress={handleConfirm}>
            <CText style={s.confirmText}>Lưu  {pad(selHour)}:{pad(selMinute)}</CText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const TEAL = '#14B8A6';

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D0D5DD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
    marginBottom: 6,
  },
  previewRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  previewText: {
    fontSize: 48,
    fontWeight: '800',
    color: TEAL,
    letterSpacing: 3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#98A2B3',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  // Hour grid: 6 cols × 4 rows
  hourScroll: {
    maxHeight: 160,
    marginBottom: 12,
  },
  hourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hourBtn: {
    width: '14%',
    aspectRatio: 1.2,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#EAECF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourBtnActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  hourText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#344054',
  },
  hourTextActive: {
    color: '#FFFFFF',
  },
  // Minute grid: 6 cols × 2 rows
  minuteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  minuteBtn: {
    width: '14%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#EAECF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minuteBtnActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  minuteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#344054',
  },
  minuteTextActive: {
    color: '#FFFFFF',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#344054',
  },
  confirmBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ClockTimePickerModal;
