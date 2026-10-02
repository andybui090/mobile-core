import { Toast } from '@/components';
import { getBottomSpace, screenStyles } from '@/configs';
import { CText } from '@/utils';
import { ScreenWidth } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

export const useStyles = makeStyles(({ colors }) => ({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  backdrop: {
    flex: 1,
  },

  contentWrapper: {
    backgroundColor: colors.white,
    paddingBottom: getBottomSpace() + 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  titleWrapper: {
    flexDirection: 'row' as const,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'space-between' as const,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cD0D5DD,
  },
}));

export const CDatePicker = React.memo((props: any) => {
  const { isModalVisible, closeModal, onChangeDate, dateTimeValue } = props;

  const { t } = useTranslation();
  const styles = useStyles();

  const {
    theme: { colors },
  } = useTheme();

  const toastEl = useRef<any>(null);

  const [date_Atmometer] = useState<any>(moment(new Date(), 'DD/MM/YYYY'));

  const [dateChoose, setDateChoose] = useState(new Date());

  const [maximumDateChoose] = useState<any>(
    moment(new Date(), 'DD/MM/YYYY').format('YYYY'),
  );

  useEffect(() => {
    const dateFormat = moment(dateTimeValue, 'DD/MM/YYYY').format('YYYY-MM-DD');

    setDateChoose(new Date(dateFormat));
  }, [dateTimeValue]);

  const handleDongY = () => {
    onChangeDate(dateChoose);
    closeModal();
  };

  const handleDateChange = (data: Date) => {
    const date = new Date(data);
    const maximumDate = new Date(date_Atmometer - 1, 1);

    if (date.getTime() > maximumDate.getTime()) {
      setDateChoose(maximumDate);
    } else {
      setDateChoose(date);
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.contentWrapper}>
          <View style={styles.titleWrapper}>
            <View style={{ width: ScreenWidth / 4 }}>
              <CText h5 w500 color={colors.c101828}>
                {''}
              </CText>
            </View>

            <View style={[screenStyles.centerWrap, { width: ScreenWidth / 4 }]}>
              <CText h5 w500 color={colors.c101828}>
                {t('onboarding.birthday')}
              </CText>
            </View>

            <View
              style={[
                screenStyles.centerWrap,
                {
                  width: ScreenWidth / 4,
                  alignItems: 'flex-end',
                },
              ]}
            >
              <Pressable onPress={handleDongY} hitSlop={screenStyles.hitSlop20}>
                <CText h5 w500 color={colors.primary}>
                  {t('common.choose', 'Choose')}
                </CText>
              </Pressable>
            </View>
          </View>

          <View style={screenStyles.centerWrap}>
            <DatePicker
              date={dateChoose}
              onDateChange={handleDateChange}
              mode="date"
              locale="vi"
              minimumDate={new Date(maximumDateChoose - 100, 1)}
              maximumDate={new Date(date_Atmometer)}
              theme="light"
            />
          </View>
        </View>

        <Toast ref={toastEl} position="bottom" />
      </View>
    </Modal>
  );
});
