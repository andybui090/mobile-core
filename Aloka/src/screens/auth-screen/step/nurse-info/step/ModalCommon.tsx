import { IconType, IconX } from '@/components';
import {
  getStatusBarHeight,
  ifIphoneX,
  keyExtractor,
  screenStyles,
} from '@/configs';
import { CEmptyData, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  footer: {
    flexDirection: 'row' as const,
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    gap: 16,
    backgroundColor: colors.white,
    ...screenStyles.flexEndBottomBtn,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center' as const,
    borderColor: colors.primary,
    justifyContent: 'center' as const,
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end' as const,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  contentContainer: {
    width: '100%',
    height: '87%',
  },
}));

type Item = { id: number; name: string; code: string };

type ModalCommonProps = {
  isVisible: boolean;
  hideModal: () => void;
  title: string;
  listData: Item[];
  itemChoose: Item;
  onSubmit: (itemChoose: Item) => void;
};

export const ModalCommon: React.FC<ModalCommonProps> = ({
  isVisible,
  hideModal,
  title,
  listData,
  itemChoose,
  onSubmit,
}) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const styles = useStyles();

  // const [searchValue, setSearchValue] = useState<string>('');

  const [itemLocalChoose, setItemLocalChoose] = useState<any>({});

  useEffect(() => {
    setItemLocalChoose(itemChoose);
  }, [itemChoose]);

  //ACTION
  const handleChooseItem = (item: any) => {
    setItemLocalChoose(item);
  };

  const handleReset = () => {
    setItemLocalChoose({});
  };

  const handleSubmit = () => {
    onSubmit(itemLocalChoose);
  };

  //RENDER
  const renderItemList = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleChooseItem(item);
        }}
        style={[
          screenStyles.rowBettween,
          screenStyles.pV12,
          screenStyles.pR8,
          screenStyles.bottomLine,
        ]}
      >
        <CText h5 color={colors.c1D2939}>
          {item.name}
        </CText>
        {itemLocalChoose.id !== item.id ? (
          <IconX
            name="circle"
            size={20}
            type={IconType.ENTYPO}
            color={colors.grey3}
          />
        ) : (
          <IconX
            name="radio-btn-active"
            size={20}
            type={IconType.FONTISTO}
            color={colors.primary}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderListData = () => {
    return (
      <FlatList
        contentContainerStyle={[
          screenStyles.flexGrow1,
          { paddingHorizontal: 24 },
        ]}
        data={listData}
        extraData={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItemList}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={160}
        scrollsToTop={false}
      />
    );
  };

  const renderList = () => {
    if (listData.length > 0) {
      return renderListData();
    } else {
      return <CEmptyData />;
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <Pressable style={styles.resetBtn} onPress={handleReset}>
          <CText h5 w500 color={colors.primary}>
            {t('carely.resetFilter', 'Reset filters')}
          </CText>
        </Pressable>

        <Pressable style={styles.applyBtn} onPress={handleSubmit}>
          <CText h5 w500 color={colors.white}>
            {t('common.choose', 'Choose')}
          </CText>
        </Pressable>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.wrapper}>
        <Row
          between
          style={[
            screenStyles.pV16,
            {
              borderBottomWidth: 1,
              paddingHorizontal: 24,
              borderBottomColor: colors.cEAECF0,
            },
          ]}
        >
          <Pressable onPress={hideModal}>
            <IconX
              name={'close'}
              type={IconType.ANT_DESIGN}
              color={colors.c667085}
              size={24}
            />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {title}
          </CText>
          <View style={{ width: 24 }} />
        </Row>
        {renderList()}
        {renderFooter()}
      </View>
    );
  };

  return (
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
    </Modal>
  );
};
