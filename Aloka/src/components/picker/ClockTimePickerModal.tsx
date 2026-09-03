import React, { useState, useEffect } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '../icons';
import { CText } from '@/utils';

export interface ClockTimePickerModalProps {
  visible: boolean;
  initialTime?: string; // Format "HH:mm" e.g. "08:00"
  onClose: () => void;
  onConfirm: (time: string) => void;
}

const CLOCK_SIZE = 256;
const RADIUS = CLOCK_SIZE / 2;
const R_OUTER = 96;
const R_INNER = 60;

// Outer: 00, 1..11
const OUTER_HOURS = [
  { val: 0, label: '00', deg: 0 },
  { val: 1, label: '1', deg: 30 },
  { val: 2, label: '2', deg: 60 },
  { val: 3, label: '3', deg: 90 },
  { val: 4, label: '4', deg: 120 },
  { val: 5, label: '5', deg: 150 },
  { val: 6, label: '6', deg: 180 },
  { val: 7, label: '7', deg: 210 },
  { val: 8, label: '8', deg: 240 },
  { val: 9, label: '9', deg: 270 },
  { val: 10, label: '10', deg: 300 },
  { val: 11, label: '11', deg: 330 },
];

// Inner: 12..23
const INNER_HOURS = [
  { val: 12, label: '12', deg: 0 },
  { val: 13, label: '13', deg: 30 },
  { val: 14, label: '14', deg: 60 },
  { val: 15, label: '15', deg: 90 },
  { val: 16, label: '16', deg: 120 },
  { val: 17, label: '17', deg: 150 },
  { val: 18, label: '18', deg: 180 },
  { val: 19, label: '19', deg: 210 },
  { val: 20, label: '20', deg: 240 },
  { val: 21, label: '21', deg: 270 },
  { val: 22, label: '22', deg: 300 },
  { val: 23, label: '23', deg: 330 },
];

const MINUTES_STEPS = [
  { val: 0, label: '00', deg: 0 },
  { val: 5, label: '05', deg: 30 },
  { val: 10, label: '10', deg: 60 },
  { val: 15, label: '15', deg: 90 },
  { val: 20, label: '20', deg: 120 },
  { val: 25, label: '25', deg: 150 },
  { val: 30, label: '30', deg: 180 },
  { val: 35, label: '35', deg: 210 },
  { val: 40, label: '40', deg: 240 },
  { val: 45, label: '45', deg: 270 },
  { val: 50, label: '50', deg: 300 },
  { val: 55, label: '55', deg: 330 },
];

export const ClockTimePickerModal: React.FC<ClockTimePickerModalProps> = ({
  visible,
  initialTime = '08:00',
  onClose,
  onConfirm,
}) => {
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  useEffect(() => {
    if (visible) {
      setMode('hour');
      setIsKeyboardMode(false);
      const [h, m] = initialTime.split(':').map(Number);
      setSelectedHour(!isNaN(h) ? h : 8);
      setSelectedMinute(!isNaN(m) ? m : 0);
    }
  }, [visible, initialTime]);

  const formattedHour = String(selectedHour).padStart(2, '0');
  const formattedMinute = String(selectedMinute).padStart(2, '0');

  const handleSelectHour = (h: number) => {
    setSelectedHour(h);
    // Smooth auto transition to minute selection
    setTimeout(() => {
      setMode('minute');
    }, 250);
  };

  const handleSelectMinute = (m: number) => {
    setSelectedMinute(m);
  };

  const handleConfirm = () => {
    const res = `${formattedHour}:${formattedMinute}`;
    onConfirm(res);
    onClose();
  };

  // Clock Hand Calculation
  let handAngle = 0;
  let handLength = R_OUTER;

  if (mode === 'hour') {
    const isInner = selectedHour >= 12;
    handLength = isInner ? R_INNER : R_OUTER;
    const hourStep = selectedHour % 12;
    handAngle = hourStep * 30; // 0..330 deg
  } else {
    handLength = R_OUTER;
    handAngle = (selectedMinute % 60) * 6; // 6 deg per minute
  }

  // Pointer indicator position
  const rad = ((handAngle - 90) * Math.PI) / 180;
  const pointerX = RADIUS + handLength * Math.cos(rad);
  const pointerY = RADIUS + handLength * Math.sin(rad);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.dialogCard} onPress={e => e.stopPropagation()}>
          {/* Header Title */}
          <CText style={styles.dialogTitle}>Thời gian</CText>

          {/* Digital Time Display (Hour : Minute) */}
          <View style={styles.digitalRow}>
            {/* Hour Box */}
            <TouchableOpacity
              style={[
                styles.digitBox,
                mode === 'hour' && !isKeyboardMode
                  ? styles.digitBoxActive
                  : styles.digitBoxInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => {
                setMode('hour');
                setIsKeyboardMode(false);
              }}
            >
              {isKeyboardMode ? (
                <TextInput
                  style={styles.digitInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={formattedHour}
                  onChangeText={val => {
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 0 && num <= 23) {
                      setSelectedHour(num);
                    } else if (val === '') {
                      setSelectedHour(0);
                    }
                  }}
                />
              ) : (
                <CText
                  style={[
                    styles.digitText,
                    mode === 'hour' ? styles.digitTextActive : styles.digitTextInactive,
                  ]}
                >
                  {formattedHour}
                </CText>
              )}
            </TouchableOpacity>

            <CText style={styles.colonText}>:</CText>

            {/* Minute Box */}
            <TouchableOpacity
              style={[
                styles.digitBox,
                mode === 'minute' && !isKeyboardMode
                  ? styles.digitBoxActive
                  : styles.digitBoxInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => {
                setMode('minute');
                setIsKeyboardMode(false);
              }}
            >
              {isKeyboardMode ? (
                <TextInput
                  style={styles.digitInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={formattedMinute}
                  onChangeText={val => {
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 0 && num <= 59) {
                      setSelectedMinute(num);
                    } else if (val === '') {
                      setSelectedMinute(0);
                    }
                  }}
                />
              ) : (
                <CText
                  style={[
                    styles.digitText,
                    mode === 'minute' ? styles.digitTextActive : styles.digitTextInactive,
                  ]}
                >
                  {formattedMinute}
                </CText>
              )}
            </TouchableOpacity>
          </View>

          {/* Radial Clock Face (when not in keyboard mode) */}
          {!isKeyboardMode && (
            <View style={styles.clockContainer}>
              <View style={styles.clockFace}>
                {/* Clock Hand / Pointer Line */}
                <View
                  style={[
                    styles.clockHand,
                    {
                      width: handLength,
                      transform: [
                        { translateX: 0 },
                        { translateY: -1 },
                        { rotate: `${handAngle - 90}deg` },
                      ],
                    },
                  ]}
                />

                {/* Center Pivot Dot */}
                <View style={styles.centerPivot} />

                {/* Selected Active Pointer Circle */}
                <View
                  style={[
                    styles.activePointerCircle,
                    {
                      left: pointerX - 18,
                      top: pointerY - 18,
                    },
                  ]}
                />

                {/* Mode === 'hour' */}
                {mode === 'hour' && (
                  <>
                    {/* Outer Ring (00, 1..11) */}
                    {OUTER_HOURS.map(item => {
                      const isSelected = selectedHour === item.val;
                      const itemRad = ((item.deg - 90) * Math.PI) / 180;
                      const x = RADIUS + R_OUTER * Math.cos(itemRad) - 16;
                      const y = RADIUS + R_OUTER * Math.sin(itemRad) - 16;
                      return (
                        <TouchableOpacity
                          key={`out_${item.val}`}
                          style={[styles.numberCell, { left: x, top: y }]}
                          activeOpacity={0.8}
                          onPress={() => handleSelectHour(item.val)}
                        >
                          <CText
                            style={[
                              styles.numberText,
                              isSelected && styles.numberTextActive,
                            ]}
                          >
                            {item.label}
                          </CText>
                        </TouchableOpacity>
                      );
                    })}

                    {/* Inner Ring (12..23) */}
                    {INNER_HOURS.map(item => {
                      const isSelected = selectedHour === item.val;
                      const itemRad = ((item.deg - 90) * Math.PI) / 180;
                      const x = RADIUS + R_INNER * Math.cos(itemRad) - 16;
                      const y = RADIUS + R_INNER * Math.sin(itemRad) - 16;
                      return (
                        <TouchableOpacity
                          key={`in_${item.val}`}
                          style={[styles.numberCell, { left: x, top: y }]}
                          activeOpacity={0.8}
                          onPress={() => handleSelectHour(item.val)}
                        >
                          <CText
                            style={[
                              styles.numberTextSmall,
                              isSelected && styles.numberTextActive,
                            ]}
                          >
                            {item.label}
                          </CText>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}

                {/* Mode === 'minute' */}
                {mode === 'minute' && (
                  <>
                    {MINUTES_STEPS.map(item => {
                      const isSelected = selectedMinute === item.val;
                      const itemRad = ((item.deg - 90) * Math.PI) / 180;
                      const x = RADIUS + R_OUTER * Math.cos(itemRad) - 16;
                      const y = RADIUS + R_OUTER * Math.sin(itemRad) - 16;
                      return (
                        <TouchableOpacity
                          key={`min_${item.val}`}
                          style={[styles.numberCell, { left: x, top: y }]}
                          activeOpacity={0.8}
                          onPress={() => handleSelectMinute(item.val)}
                        >
                          <CText
                            style={[
                              styles.numberText,
                              isSelected && styles.numberTextActive,
                            ]}
                          >
                            {item.label}
                          </CText>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}
              </View>
            </View>
          )}

          {/* Footer Action Row */}
          <View style={styles.footerRow}>
            {/* Keyboard mode toggle icon */}
            <TouchableOpacity
              style={styles.keyboardBtn}
              activeOpacity={0.7}
              onPress={() => setIsKeyboardMode(!isKeyboardMode)}
            >
              <IconX
                type="ionicons"
                name={isKeyboardMode ? 'time-outline' : 'keypad-outline'}
                size={22}
                color="#6750A4"
              />
            </TouchableOpacity>

            {/* Cancel & Save buttons */}
            <View style={styles.footerRightBtns}>
              <TouchableOpacity
                style={styles.actionTextBtn}
                activeOpacity={0.7}
                onPress={onClose}
              >
                <CText style={styles.actionBtnText}>Hủy</CText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionTextBtn}
                activeOpacity={0.7}
                onPress={handleConfirm}
              >
                <CText style={[styles.actionBtnText, styles.actionBtnTextBold]}>
                  Lưu
                </CText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 328,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  dialogTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#49454F',
    marginBottom: 16,
  },
  // Digital Time Display
  digitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  digitBox: {
    width: 86,
    height: 72,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitBoxActive: {
    backgroundColor: '#EADDFF',
    borderWidth: 2,
    borderColor: '#6750A4',
  },
  digitBoxInactive: {
    backgroundColor: '#ECE6F0',
    borderWidth: 0,
  },
  digitText: {
    fontSize: 44,
    fontWeight: '600',
  },
  digitTextActive: {
    color: '#21005D',
  },
  digitTextInactive: {
    color: '#1D1B20',
  },
  digitInput: {
    fontSize: 40,
    fontWeight: '600',
    color: '#21005D',
    textAlign: 'center',
    padding: 0,
    width: '100%',
  },
  colonText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1D1B20',
    marginHorizontal: 10,
    marginTop: -4,
  },
  // Radial Clock Face
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  clockFace: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    borderRadius: RADIUS,
    backgroundColor: '#F3EDF7',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockHand: {
    position: 'absolute',
    left: RADIUS,
    top: RADIUS,
    height: 2,
    backgroundColor: '#6750A4',
    transformOrigin: '0% 50%',
  },
  centerPivot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6750A4',
    zIndex: 10,
  },
  activePointerCircle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6750A4',
    zIndex: 2,
  },
  numberCell: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  numberText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1D1B20',
  },
  numberTextSmall: {
    fontSize: 13,
    fontWeight: '500',
    color: '#49454F',
  },
  numberTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // Footer
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  keyboardBtn: {
    padding: 8,
  },
  footerRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionTextBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6750A4',
  },
  actionBtnTextBold: {
    fontWeight: '700',
  },
});

export default ClockTimePickerModal;
