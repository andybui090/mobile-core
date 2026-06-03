import { images } from '@/configs';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export function NoImage() {
  const [layout, setLayout] = useState({width: 50, height: 50});

  const renderImageDefault = () => {
    const size = layout.width >= layout.height ? layout.height : layout.width;
    return (
      <View style={styles.bgDefault}>
        <Image
          style={{
            height: size - 20,
            width: size - 20,
          }}
          source={images.global.img_default}
        />
      </View>
    );
  };
  return (
    <View
      onLayout={event => {
        const {width, height} = event.nativeEvent.layout;
        setLayout({width, height});
      }}
      style={[styles.cont, styles.imageStyle]}>
      {renderImageDefault()}
    </View>
  );
}

const styles = StyleSheet.create({
  bgDefault: {
    backgroundColor: '#F4F4F4',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {width: '100%', height: '100%'},
  cont: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
