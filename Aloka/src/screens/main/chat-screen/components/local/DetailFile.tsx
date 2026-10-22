import { CHeader } from '@/components';
import { ScreenHeight, screenStyles } from '@/configs';
import { CScrollView } from '@/utils';
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import Modal from '@gadhiyamanan/react-native-modal';
import { WebView } from 'react-native-webview';

export const DetailFile = ({
  isVisible,
  hideModal,
  fileUriDetail,
  type,
}: any) => {
  const [webViewHeight, setWebViewHeight] = useState(10);

  const onWebViewMessage = (event: any) => {
    setWebViewHeight(Number(event.nativeEvent.data));
  };
  //ACTION

  //RENDER
  const renderBody = () => {
    return (
      <CScrollView style={{ flex: 1 }}>
        <WebView
          onMessage={onWebViewMessage}
          injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
          source={{ uri: fileUriDetail }}
          style={{
            width: Dimensions.get('window').width,
            height: ScreenHeight + 10,
          }}
          originWhitelist={['*']}
          automaticallyAdjustContentInsets={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={false}
          startInLoadingState={false}
          panGestureEnabled={false}
          nestedScrollEnabled={true}
          androidHardwareAccelerationDisabled={false}
          androidLayerType={'hardware'}
          setSupportMultipleWindows={false}
        />
      </CScrollView>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <CHeader
          leftComponentOnPress={hideModal}
          isBorderBottom
          rightComponentDisable
        />
        {renderBody()}
      </View>
    );
  };

  return (
    <Modal
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      isVisible={isVisible}
      onBackdropPress={hideModal}
      style={screenStyles.modalFullScreen}
    >
      {renderContent()}
    </Modal>
  );
};
