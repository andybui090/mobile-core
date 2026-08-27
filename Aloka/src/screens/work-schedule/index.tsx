import { CHeader, IconX, Wrapper } from '@/components';
import { CText } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface MenuItem {
  id: string;
  title: string;
  iconName: string;
  iconType: 'ionicons' | 'fontisto' | 'antdesign' | 'octicons' | 'materialicons';
  iconBgColor: string;
  route?: string;
  onPress?: () => void;
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    flex: 1,
    marginLeft: 14,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cEAECF0,
    marginLeft: 50,
  },
}));

export const WorkScheduleManageScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const {
    theme: { colors },
  } = useTheme();

  const menuItems: MenuItem[] = [
    {
      id: 'working-hours',
      title: 'Thời gian làm việc',
      iconName: 'time',
      iconType: 'ionicons',
      iconBgColor: colors.cFDB022 || '#FDB022',
      route: 'WorkingHoursScreen',
    },
    {
      id: 'work-schedule',
      title: 'Lịch làm việc',
      iconName: 'calendar',
      iconType: 'ionicons',
      iconBgColor: colors.cF04438 || '#F04438',
      route: 'WorkScheduleScreen',
    },
  ];

  const handlePressItem = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <Wrapper style={styles.container}>
      <CHeader
        title="Quản lý lịch làm việc"
        isBorderBottom
        leftComponentOnPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

      <View style={styles.content}>
        {menuItems.map(item => (
          <React.Fragment key={item.id}>
            <TouchableOpacity
              style={styles.itemContainer}
              activeOpacity={0.7}
              onPress={() => handlePressItem(item)}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: item.iconBgColor },
                ]}
              >
                <IconX
                  type={item.iconType}
                  name={item.iconName as any}
                  size={20}
                  color={colors.white}
                />
              </View>

              <CText h5 w500 style={styles.itemTitle} color={colors.c1D2939}>
                {item.title}
              </CText>

              <IconX
                type="ionicons"
                name="chevron-forward"
                size={18}
                color={colors.c98A2B3}
              />
            </TouchableOpacity>

            <View style={styles.divider} />
          </React.Fragment>
        ))}
      </View>
    </Wrapper>
  );
};

export default WorkScheduleManageScreen;
