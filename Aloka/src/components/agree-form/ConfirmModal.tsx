// ConfirmModal.tsx
import { ScreenWidth } from '@/configs';
import { CText } from '@/utils';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ConfirmModalProps {
    visible: boolean;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    message,
    onCancel,
    onConfirm,
    cancelText,
    confirmText,
    showCancelButton = true,
    showConfirmButton = true,
}) => {
    const { t } = useTranslation();
    const {
        theme: { colors },
    } = useTheme();
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <CText h5 color={colors.c101828} center>{message}</CText>
                    <View style={styles.actions}>
                        {showCancelButton && onCancel && (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#E5E7EB' }]}
                                onPress={onCancel}
                            >
                                <CText h5 w600 color={colors.c344054}>
                                    {cancelText ?? t('common.cancel', 'Cancel')}
                                </CText>
                            </TouchableOpacity>
                        )}
                        {showConfirmButton && onConfirm && (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.primary }]}
                                onPress={onConfirm}
                            >
                                <CText h5 w600 color={colors.white}>
                                    {confirmText ?? t('common.ok', 'OK')}
                                </CText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: ScreenWidth - 80,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
        gap: 12, // RN >= 0.71, nếu thấp hơn dùng marginRight
    },
    button: {
        flex: 1, // chia đều 2 nút
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
});
