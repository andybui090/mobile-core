import { IconType, IconX } from '@/components';
import { keyExtractor, screenStyles } from '@/configs';
import { CButton, CEmptyData, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View, Modal, StyleSheet } from 'react-native';
import { useTheme, makeStyles } from '@rneui/themed';

const useStyles = makeStyles(({ colors }) => ({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end' as const,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  contentContainer: {
    width: '100%' as const,
    height: '87%' as const,
  },
}));

export const ModalPackageSuggest = ({
  isVisible,
  hideModal,
  listOption,
  optionChoose,
  onChooseOption,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();

  const [itemChoose, setItemChoose] = useState<any>({});

  useEffect(() => {
    setItemChoose(optionChoose || {});
  }, [optionChoose]);

  //ACTION
  const handleUpdatePackage = (item: any) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    onChooseOption(itemChoose);
  };

  //RENDER
  const renderItemList = ({ item }: any) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.cD0D5DD,
          borderRadius: 8,
          padding: 16,
          marginTop: 16,
        }}
      >
        <Pressable
          onPress={() => handleUpdatePackage(item)}
          style={[screenStyles.rowBettween]}
        >
          <Row start style={screenStyles.flex1}>
            <IconX
              name="medical-services"
              size={20}
              type={IconType.MATERIAL_ICONS}
              color={colors.c98A2B3}
            />
            <CText h5 color={colors.c101828} style={screenStyles.mL10}>
              {item.name}
            </CText>
          </Row>
          {itemChoose.id !== item.id ? (
            <IconX
              name="circle"
              size={20}
              type={IconType.ENTYPO}
              color={colors.c98A2B3}
            />
          ) : (
            <IconX
              name="radio-btn-active"
              size={20}
              type={IconType.FONTISTO}
              color={colors.primary}
            />
          )}
        </Pressable>
      </View>
    );
  };

  const renderListOption = () => {
    return (
      <FlatList
        contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH16]}
        data={listOption}
        extraData={listOption}
        keyExtractor={keyExtractor}
        renderItem={renderItemList}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={160}
        keyboardDismissMode="on-drag"
        ListEmptyComponent={<CEmptyData />}
        scrollsToTop={false}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX
              name={'close'}
              type={IconType.ANT_DESIGN}
              color={colors.c667085}
              size={24}
            />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('package.suggest')}
          </CText>
          <View style={{ width: 24 }} />
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        {renderListOption()}
        <View style={screenStyles.pH14}>
          <CButton
            title={t('common.choose', 'Choose')}
            btnWidth={'100%'}
            onPress={handleSubmit}
            isBottom
            isDisable={itemChoose.id == -1}
          />
        </View>
      </View>
    );
  };

  return (
    // <Modal
    //   isVisible={isVisible}
    //   onBackdropPress={hideModal}
    //   style={screenStyles.containerModalTop}
    // >
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={hideModal}
    >
      <View style={styles.modalContainer}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hideModal}>
          <View style={styles.backdrop} />
        </Pressable>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>
      {/* {renderContent()} */}
    </Modal>
  );
};
