import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { CText } from '@/utils';
import { getBottomSpace, screenStyles } from '@/configs';

export interface CDatePickerProps {
  isModalVisible: boolean;
  closeModal: () => void;
  onChangeDate: (date: Date) => void;
  dateTimeValue?: any;
  title?: string;
  cancelText?: string;
  confirmText?: string;
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    contentWrapper: {
      backgroundColor: colors.white,
      paddingBottom: getBottomSpace() + 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    titleWrapper: {
      flexDirection: 'row',
      paddingVertical: 14,
      paddingHorizontal: 24,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.cD0D5DD || '#EAECF0',
    },
    datePickerCenter: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
    },
  })
);

export const CDatePicker = React.memo<CDatePickerProps>(props => {
  const {
    isModalVisible,
    closeModal,
    onChangeDate,
    dateTimeValue,
    title = 'Ngày sinh',
    cancelText = 'Huỷ',
    confirmText = 'Chọn',
  } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const [dateChoose, setDateChoose] = useState<Date>(new Date());

  useEffect(() => {
    if (dateTimeValue) {
      if (dateTimeValue instanceof Date && !isNaN(dateTimeValue.getTime())) {
        setDateChoose(dateTimeValue);
      } else {
        const m = moment(dateTimeValue, [
          'DD/MM/YYYY',
          'YYYY-MM-DD',
          'YYYY-MM-DDTHH:mm:ss.SSSZ',
        ]);
        setDateChoose(m.isValid() ? m.toDate() : new Date());
      }
    } else {
      setDateChoose(new Date());
    }
  }, [dateTimeValue, isModalVisible]);

  const handleDongY = () => {
    onChangeDate(dateChoose);
    closeModal();
  };

  const handleDateChange = (data: any) => {
    let date = new Date(data);
    if (date.getTime() > new Date().getTime()) {
      setDateChoose(new Date());
    } else {
      setDateChoose(date);
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal}>
          <View style={styles.backdrop} />
        </Pressable>
        <View style={styles.contentWrapper}>
          <View style={styles.titleWrapper}>
            <Pressable onPress={closeModal} hitSlop={screenStyles.hitSlop20}>
              <CText h5 w500 color={colors.c667085 || '#667085'}>
                {cancelText}
              </CText>
            </Pressable>
            <View style={screenStyles.centerWrap}>
              <CText h4 w600 color={colors.c101828}>
                {title}
              </CText>
            </View>
            <Pressable onPress={handleDongY} hitSlop={screenStyles.hitSlop20}>
              <CText h5 w600 color={colors.primary}>
                {confirmText}
              </CText>
            </Pressable>
          </View>
          <View style={styles.datePickerCenter}>
            <DatePicker
              date={dateChoose}
              onDateChange={handleDateChange}
              mode="date"
              locale="vi"
              theme="light"
              maximumDate={new Date()}
              minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});
