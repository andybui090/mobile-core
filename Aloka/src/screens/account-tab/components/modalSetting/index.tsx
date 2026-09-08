import { CHeader } from '@/components';
import { makeStyles } from '@rneui/themed';
import React from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

export type ModalModel = {
  style?: any;
  containerStyle?: any;
  children: React.ReactElement | React.ReactElement[];
  onClose?: () => void;
  onBackdropPress?: () => void;
  title?: string;
  isVisible?: boolean;
  isFullScreen?: boolean;
  isBorderHeader?: boolean;
  isAutoWrap?: boolean;
  rightHeader?: React.ReactNode;
  isHeader?: boolean;
  leftHeader?: React.ReactElement;
  onShow?: () => void;
  isTransparent?: boolean;
  isRightClose?: boolean;
};

const ModalSetting = ({
  style,
  containerStyle,
  children,
  onClose,
  onBackdropPress,
  title,
  isVisible = false,
  isFullScreen = false,
  isBorderHeader,
  isAutoWrap = false,
  isHeader = false,
  rightHeader,
  leftHeader,
  isTransparent = false,
  isRightClose,
}: ModalModel) => {
  const styles = useStyles();

  const handleClose = onBackdropPress || onClose;

  const renderHeader = () => {
    return <CHeader title={title || ''} isBorderBottom={isBorderHeader} />;
  };

  return (
    <Modal
      visible={isVisible}
      transparent={isTransparent || !isFullScreen}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={[styles.container, containerStyle]}>
        {/* Backdrop for transparent / dialog mode */}
        {(isTransparent || !isFullScreen) && (
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
            <View style={styles.backdrop} />
          </Pressable>
        )}

        {isFullScreen && !isTransparent ? (
          <SafeAreaView style={styles.fullScreenWrapper}>
            {isHeader && renderHeader()}
            {children}
          </SafeAreaView>
        ) : (
          <View style={[styles.dialogWrapper, style]}>
            {isHeader && renderHeader()}
            {children}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ModalSetting;

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
}));
