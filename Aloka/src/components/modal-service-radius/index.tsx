import { IconType, IconX } from '@/components';
import { screenStyles } from '@/configs';
import { CButton, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface ServiceRadiusItem {
  value: number;
  label: string;
}

interface ModalServiceRadiusProps {
  isVisible: boolean;
  hideModal: () => void;
  chooseServiceRadius: (item: ServiceRadiusItem) => void;
  serviceRadiusChoose?: ServiceRadiusItem;
}

const SERVICE_RADIUS_LIST: ServiceRadiusItem[] = [
  {
    value: 5,
    label: '5 km',
  },
  {
    value: 10,
    label: '10 km',
  },
  {
    value: 15,
    label: '15 km',
  },
  {
    value: 20,
    label: '20 km',
  },
  {
    value: 30,
    label: '30 km',
  },
  {
    value: 50,
    label: '50 km',
  },
];

export const ModalServiceRadius = ({
  isVisible,
  hideModal,
  chooseServiceRadius,
  serviceRadiusChoose,
}: ModalServiceRadiusProps) => {
  const {
    theme: { colors },
  } = useTheme();

  const { t } = useTranslation();

  const [itemChoose, setItemChoose] = useState<ServiceRadiusItem | undefined>(
    serviceRadiusChoose,
  );

  useEffect(() => {
    setItemChoose(serviceRadiusChoose);
  }, [serviceRadiusChoose, isVisible]);

  const handleChoose = (item: ServiceRadiusItem) => {
    setItemChoose(item);
  };

  const handleSubmit = () => {
    if (!itemChoose) {
      return;
    }

    chooseServiceRadius(itemChoose);
    hideModal();
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ServiceRadiusItem;
    index: number;
  }) => {
    const paddingCommon =
      index !== 0 ? screenStyles.pV13 : screenStyles.pFirstRow;

    const isSelected = itemChoose?.value === item.value;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleChoose(item)}
        style={[
          screenStyles.rowBettween,
          paddingCommon,
          screenStyles.pR8,
          screenStyles.bottomLine,
        ]}
      >
        <Row start>
          <CText h5 color={colors.c1D2939}>
            {item.label}
          </CText>
        </Row>

        {isSelected ? (
          <IconX
            name="radio-btn-active"
            size={20}
            type={IconType.FONTISTO}
            color={colors.primary}
          />
        ) : (
          <IconX
            name="circle"
            size={20}
            type={IconType.ENTYPO}
            color={colors.c98A2B3}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX
              name="close"
              type={IconType.ANT_DESIGN}
              color={colors.c667085}
              size={24}
            />
          </Pressable>

          <CText h4 w600 color={colors.c101828}>
            {t('onboarding.serviceRadius', 'Bán kính phục vụ')}
          </CText>

          <View style={{ width: 24 }} />
        </Row>

        <Divider color={colors.cD0D5DD} width={1} />
        <FlatList
          contentContainerStyle={[
            screenStyles.flexGrow1,
            screenStyles.pH24,
            screenStyles.pT8,
          ]}
          data={SERVICE_RADIUS_LIST}
          keyExtractor={item => item.value.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
        <View style={screenStyles.pH24}>
          <CButton
            title={t('common.choose', 'Choose')}
            btnWidth={'100%'}
            onPress={handleSubmit}
            isBottom
          />
        </View>
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  contentContainer: {
    width: '100%',
    height: '87%',
  },
});
