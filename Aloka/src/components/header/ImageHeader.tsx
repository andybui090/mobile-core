import { images, ScreenWidth } from '@/configs';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const ImageHeader = () => (
  <Image
    source={images.global.bg_header}
    style={styles.imgBg}
    resizeMode="cover"
  />
);

const styles = StyleSheet.create({
  imgBg: {
    position: 'absolute',
    top: 0,
    width: ScreenWidth,
    height: (ScreenWidth / 1500) * 960,
    zIndex: 0,
  },
});

export default ImageHeader;
