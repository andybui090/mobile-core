import React, { useEffect, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { G, Line, Rect } from 'react-native-svg';
import { IconX, Wrapper } from '@/components';
import { CButton, CText } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { getMedicaltypes } from '@/redux/slices/onboardSlice';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface AccountTypeItem {
  id: number | string;
  code: string;
  name: string;
  description?: string;
  icon?: 'person' | 'pill' | 'school' | string;
  parentCode: 'Normal' | 'Expert';
  parentName?: string;
  raw?: any;
}

interface Props {
  goBack: () => void;
  onSelectUser: (item: AccountTypeItem) => void;
  onSelectExpert: (item: AccountTypeItem) => void;
  selectedItem?: AccountTypeItem | null;
}

// Custom Capsule / Pill SVG matching mockup
const PillIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <G origin="12, 12" rotation={-45}>
      <Rect
        x={7.5}
        y={3}
        width={9}
        height={18}
        rx={4.5}
        stroke="#FFFFFF"
        strokeWidth={2}
        fill="none"
      />
      <Line
        x1={7.5}
        y1={12}
        x2={16.5}
        y2={12}
        stroke="#FFFFFF"
        strokeWidth={2}
      />
    </G>
  </Svg>
);

export const ChooseAccountType: React.FC<Props> = ({
  goBack,
  onSelectUser,
  onSelectExpert,
  selectedItem: initialSelected,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { medicalTypesList } = useAppSelector(state => state.onboardReducer);

  const [openNormal, setOpenNormal] = useState<boolean>(true);
  const [openExpert, setOpenExpert] = useState<boolean>(true);
  const [selected, setSelected] = useState<AccountTypeItem | null>(initialSelected || null);

  // Default items matching mockup and backend exactly
  const defaultNormalItems: AccountTypeItem[] = [
    {
      id: 58,
      code: 'User',
      name: t('onboarding.userItemTitle', 'Người dùng'),
      description: t(
        'onboarding.userItemDesc',
        'Diam etiam commodo augue eget quis posuere lacus.',
      ),
      icon: 'person',
      parentCode: 'Normal',
      parentName: t('onboarding.userGroup', 'Người dùng'),
    },
  ];

  const defaultExpertItems: AccountTypeItem[] = [
    {
      id: 46,
      code: 'Nurse',
      name: t('onboarding.nurseItemTitle', 'Điều dưỡng'),
      description: t(
        'onboarding.nurseItemDesc',
        'Diam etiam commodo augue eget quis posuere lacus.',
      ),
      icon: 'pill',
      parentCode: 'Expert',
      parentName: t('onboarding.expertGroup', 'Chuyên gia'),
    },
    {
      id: 47,
      code: 'Doctor',
      name: t('onboarding.doctorItemTitle', 'Bác sĩ'),
      description: t(
        'onboarding.doctorItemDesc',
        'Diam etiam commodo augue eget quis posuere lacus.',
      ),
      icon: 'school',
      parentCode: 'Expert',
      parentName: t('onboarding.expertGroup', 'Chuyên gia'),
    },
  ];

  const [normalItems, setNormalItems] = useState<AccountTypeItem[]>(defaultNormalItems);
  const [expertItems, setExpertItems] = useState<AccountTypeItem[]>(defaultExpertItems);

  useEffect(() => {
    dispatch(getMedicaltypes(null));
  }, [dispatch]);

  // Sync backend IDs from API medicalTypesList while preserving mockup text & icons
  useEffect(() => {
    const data = medicalTypesList?.data?.items;
    if (Array.isArray(data) && data.length > 0) {
      let userApi: any = null;
      let nurseApi: any = null;
      let caregiverApi: any = null;

      data.forEach((group: any) => {
        const groupCode = (group.code || '').toLowerCase();
        const children = group.children || [];
        if (groupCode === 'normal') {
          children.forEach((c: any) => {
            const code = (c.code || '').toLowerCase();
            const name = (c.name || '').toLowerCase();
            if (!code.includes('student') && !name.includes('sinh viên')) {
              userApi = c;
            }
          });
        } else if (groupCode === 'expert') {
          children.forEach((c: any) => {
            const code = (c.code || '').toLowerCase();
            const name = (c.name || '').toLowerCase();
            if (code.includes('nurse') || name.includes('điều dưỡng')) {
              nurseApi = c;
            } else if (
              code.includes('caregiver') ||
              code.includes('care') ||
              name.includes('chăm sóc') ||
              code.includes('other')
            ) {
              caregiverApi = c;
            } else if (!caregiverApi && !code.includes('nurse')) {
              caregiverApi = c;
            }
          });
        }
      });

      setNormalItems([
        {
          id: userApi?.id ? Number(userApi.id) : 58,
          code: userApi?.code || 'User',
          name: t('onboarding.userItemTitle', 'Người dùng'),
          description: t(
            'onboarding.userItemDesc',
            'Diam etiam commodo augue eget quis posuere lacus.',
          ),
          icon: 'person',
          parentCode: 'Normal',
          parentName: t('onboarding.userGroup', 'Người dùng'),
          raw: userApi,
        },
      ]);

      setExpertItems([
        {
          id: nurseApi?.id ? Number(nurseApi.id) : 46,
          code: nurseApi?.code || 'Nurse',
          name: t('onboarding.nurseItemTitle', 'Điều dưỡng'),
          description: t(
            'onboarding.nurseItemDesc',
            'Diam etiam commodo augue eget quis posuere lacus.',
          ),
          icon: 'pill',
          parentCode: 'Expert',
          parentName: t('onboarding.expertGroup', 'Chuyên gia'),
          raw: nurseApi,
        },
        {
          id: caregiverApi?.id ? Number(caregiverApi.id) : 47,
          code: caregiverApi?.code || 'Doctor',
          name: t('onboarding.caregiverItemTitle', 'Chuyên viên chăm sóc'),
          description: t(
            'onboarding.caregiverItemDesc',
            'Diam etiam commodo augue eget quis posuere lacus.',
          ),
          icon: 'school',
          parentCode: 'Expert',
          parentName: t('onboarding.expertGroup', 'Chuyên gia'),
          raw: caregiverApi,
        },
      ]);
    }
  }, [medicalTypesList, t]);

  const toggleNormal = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenNormal(!openNormal);
  };

  const toggleExpert = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenExpert(!openExpert);
  };

  const handleSelect = (item: AccountTypeItem) => {
    setSelected(item);
  };

  const handleContinue = () => {
    if (!selected) return;
    if (selected.parentCode === 'Normal') {
      onSelectUser(selected);
    } else {
      onSelectExpert(selected);
    }
  };

  const renderCardIcon = (icon?: string) => {
    if (icon === 'pill') {
      return <PillIcon />;
    }
    if (icon === 'school') {
      return (
        <IconX
          type="ionicons"
          name="school-outline"
          size={24}
          color="#FFFFFF"
        />
      );
    }
    return (
      <IconX
        type="ionicons"
        name="person-outline"
        size={24}
        color="#FFFFFF"
      />
    );
  };

  const renderCardItem = (item: AccountTypeItem) => {
    const isSelected = selected?.id === item.id || selected?.code === item.code;
    return (
      <TouchableOpacity
        key={String(item.id)}
        activeOpacity={0.8}
        onPress={() => handleSelect(item)}
        style={[
          styles.card,
          isSelected ? styles.cardActive : styles.cardInactive,
        ]}
      >
        <View style={styles.iconCircle}>
          {renderCardIcon(item.icon)}
        </View>

        <View style={styles.cardContent}>
          <CText style={styles.cardTitle}>{item.name}</CText>
          <CText style={styles.cardSubtitle} numberOfLines={2}>
            {item.description}
          </CText>
        </View>

        {isSelected && (
          <View style={styles.checkmarkBadge}>
            <IconX
              type="ionicons"
              name="checkmark-circle"
              size={24}
              color="#0E9384"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Wrapper safeTop safeBottom style={styles.wrapper}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <IconX type="ionicons" name="chevron-back" size={26} color="#101828" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CText style={styles.pageTitle}>
          {t('onboarding.chooseAccountType', 'Chọn loại tài khoản')}
        </CText>

        {/* Section 1: Người dùng */}
        <View style={styles.sectionWrap}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={toggleNormal}
            activeOpacity={0.7}
          >
            <CText style={styles.sectionTitle}>
              {t('onboarding.userGroup', 'Người dùng')}
            </CText>
            <IconX
              type="ionicons"
              name={openNormal ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#101828"
            />
          </TouchableOpacity>
          {openNormal && (
            <View style={styles.sectionBody}>
              {normalItems.map(renderCardItem)}
            </View>
          )}
        </View>

        {/* Divider between sections */}
        <View style={styles.sectionDivider} />

        {/* Section 2: Chuyên gia */}
        <View style={styles.sectionWrap}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={toggleExpert}
            activeOpacity={0.7}
          >
            <CText style={styles.sectionTitle}>
              {t('onboarding.expertGroup', 'Chuyên gia')}
            </CText>
            <IconX
              type="ionicons"
              name={openExpert ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#101828"
            />
          </TouchableOpacity>
          {openExpert && (
            <View style={styles.sectionBody}>
              {expertItems.map(renderCardItem)}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <CButton
          btnWidth="100%"
          title={t('onboarding.btnContinue', 'Tiếp tục')}
          isDisable={!selected}
          onPress={handleContinue}
          backgroundColor={selected ? '#0E9384' : '#C4E9E8'}
          style={styles.continueBtn}
        />
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#101828',
    marginTop: 14,
    marginBottom: 24,
  },
  sectionWrap: {
    marginBottom: 6,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginVertical: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E9384',
  },
  sectionBody: {
    marginTop: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    position: 'relative',
  },
  cardInactive: {
    borderColor: '#EAECF0',
  },
  cardActive: {
    borderColor: '#0E9384',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#14988D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#667085',
    lineHeight: 18,
  },
  checkmarkBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  continueBtn: {
    borderRadius: 10,
    height: 50,
  },
});

export default ChooseAccountType;
