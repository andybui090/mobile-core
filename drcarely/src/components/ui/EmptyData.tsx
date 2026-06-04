import { ScreenWidth, getBottomSpace } from '@/config';
import { Row, Text } from '@/components/ui';
import LottieView from 'lottie-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface EmptyDataProps {
  title?: string;
  style?: ViewStyle | object;
  isSmall?: boolean;
}

export const EmptyData: React.FC<EmptyDataProps> = ({ title, style = {}, isSmall = false }) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.container, style]}>
      <LottieView
        style={isSmall ? styles.imgLandscape : styles.img}
        source={require('./lottie-json/empty_data.json')}
        autoPlay
        loop={true}
      />
      <Row style={{ paddingHorizontal: 24 }}>
        <Text
          h5
          w500
          center
          style={
            isSmall
              ? {
                  color: '#667085',
                  top: -20,
                }
              : styles.txt
          }>
          {/* {title ?? 'Hiện tại chưa có dữ liệu nào !'} */}
          {title ?? t('common.noDataAvailable', 'No data available')}
        </Text>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: getBottomSpace(),
    // backgroundColor:'red'
  },
  img: {
    width: ScreenWidth / 1.5,
    height: ScreenWidth / 1.5,
  },
  imgLandscape: {
    width: ScreenWidth / 2,
    height: ScreenWidth / 2,
    marginTop: 20,
  },
  rowText: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  txt: {
    color: '#667085',
    top: -30,
  },
});
