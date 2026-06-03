import { getBottomSpace, screenStyles } from '@/configs';
import { CText } from '@/utils';
import { ScreenWidth } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from 'react-native-wheel-pick';

export const useStyles = makeStyles(({ colors }) => ({
  MainContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  contentWrapper: {
    backgroundColor: colors.white,
    paddingBottom: getBottomSpace() + 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleWrapper: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cD0D5DD,
  },
}));

export const CYearPicker = React.memo((props: any) => {
  const { isModalVisible, closeModal, onChange, yearValue, isMin } = props;
  const { t } = useTranslation();

  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  
  const [yearChoose, setYearChoose] = useState(yearValue);

  const [listData, setListData] = useState<any>([]);

  useEffect(() => {
    const initData = () => {
      let currentYear:string = moment(new Date(), 'DD/MM/YYYY').format('YYYY');
      let year = parseInt(currentYear);
      let arr = [];
     
      if (isMin) {
        for (let i = year - 10; i <= year; i++) {
          arr.push(i);
        }
      } else {
        for (let j = year; j <= year + 10; j++) {
          arr.push(j);
        }
      }
      setListData(arr);
    }
    initData();
  }, [isMin]);

  const handleDongY = () => {
    onChange(yearChoose);
    closeModal();
  };

  const handleChangeValue = (value: any) => {
    setYearChoose(value);
  };

  return (
    <Modal isVisible={isModalVisible} onBackdropPress={closeModal} style={styles.MainContainer}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleWrapper}>
          <View style={{ width: ScreenWidth / 4 }}>
            <CText h5 w500 color={colors.c101828}>
              {''}
            </CText>
          </View>
          <View style={[screenStyles.centerWrap, { width: ScreenWidth / 4 }]}>
            <CText h5 w500 color={colors.c101828}>
              {t("onboarding.year")}
            </CText>
          </View>
          <View style={[screenStyles.centerWrap, { width: ScreenWidth / 4, alignItems: 'flex-end' }]}>
            <Pressable onPress={handleDongY} hitSlop={screenStyles.hitSlop20}>
              <CText h5 w500 color={colors.primary}>
                {t('common.choose', 'Choose')}
              </CText>
            </Pressable>
          </View>
        </View>
        <View style={screenStyles.centerWrap}>
          <Picker
            style={{ backgroundColor: 'white', width: ScreenWidth/2, height: 200 }}
            selectedValue={yearChoose}
            pickerData={listData}
            onValueChange={handleChangeValue}
          />
        </View>
      </View>
    </Modal>
  );
});
