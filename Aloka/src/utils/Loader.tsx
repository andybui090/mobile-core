import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';

interface Props {
  visible: boolean;
}

export const Loader = ({visible}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={() => {}}>
      <View style={styles.viewLoading}>
        <LottieView
          style={{
            width: 77,
            height: 77,
          }}
          source={require('./lottie-json/loading.json')}
          autoPlay
          loop
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
