import { getBottomSpace, ScreenWidth } from '@/configs';
import { useTheme } from '@rneui/themed';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CText } from './CText';

export const Improve = () => {
  const {
    theme: {colors},
  } = useTheme();
  return (
    <View style={styles.container}>
      <LottieView
        style={{
          width: ScreenWidth / 1.5,
          height: ScreenWidth / 1.5,
        }}
        source={require('./lottie-json/empty_data.json')}
        autoPlay
        loop
      />
      <CText h5 w500 color={colors.c667085} style={{marginTop: -30}}>
        {'Comming soon!'}
      </CText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: getBottomSpace(),
  },
});
