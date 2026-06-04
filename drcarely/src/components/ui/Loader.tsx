import React from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';

interface Props {
  visible: boolean;
}

export const Loader = ({visible}: Props) => {
  return (
    <Modal 
      style={styles.modalStyle} 
      animationIn={{ from: { opacity: 1 }, to: { opacity: 1 } }}
      animationOut={{ from: { opacity: 0 }, to: { opacity: 0 } }}
      animationInTiming={0}
      animationOutTiming={0}
      isVisible={visible}>
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
  modalStyle:{
    margin:0,
  },
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(256, 256, 256, 0.05)',
  },
});
