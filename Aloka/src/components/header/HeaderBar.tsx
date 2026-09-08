import { ScreenWidth, images, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import { CText, Row } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { useAppSelector } from '@/redux/store/customReduxHook';
import CHeader from './CHeader';

const useStyles = makeStyles(({ colors }) => ({
  rightWrapper: {
    position: 'absolute' as const,
    right: 16,
    ...screenStyles.rowCenter,
  },
  leftWrapper: {
    position: 'absolute' as const,
    left: 16,
    ...screenStyles.rowCenter,
    alignItems: 'center' as const,
  },
  row: {
    maxWidth: ScreenWidth / 1.7,
  },
  hasNoti: {
    position: 'absolute' as const,
    right: 3,
    top: 1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
  },
}));

type HeaderProps = {
  isBorderBottom?: boolean;
};

const HeaderBarCarely: React.FC<HeaderProps> = props => {
  const navigation = useNavigation();
  const { isBorderBottom = false } = props;

  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  const { t } = useTranslation();
  const { user } = useContext(AppContext);

  const [totalUnread, setTotalUnread] = useState(0);

  //PROPS
  const { totalNotifyUnRead } = useAppSelector(state => state.notifyReducer);
  const [txtHeader, setTxtHeader] = useState<string>(t('common.welcome', 'Hi'));

  useEffect(() => {
    const processAPITotalNotify = () => {
      const { loading, data, error } = totalNotifyUnRead;
      if (!loading) {
        if (data) {
          let dataP: any = data;
          if (dataP?.result?.total !== undefined) {
            setTotalUnread(dataP.result.total || 0);
          } else if (typeof dataP?.total === 'number') {
            setTotalUnread(dataP.total);
          } else if (typeof dataP === 'number') {
            setTotalUnread(dataP);
          }
        } else if (error) {
        }
      }
    };
    processAPITotalNotify();
  }, [totalNotifyUnRead]);

  useEffect(() => {
    const initWelcome = () => {
      let txt: string = t('common.welcome', 'Hi');
      if (user.id && user.full_name) {
        txt = txt + ', ' + user.full_name + '!';
      }
      setTxtHeader(txt);
    };
    initWelcome();
  }, [user]);

  const handleNotify = () => {
    navigation.navigate('NotificationScreen' as never);
  };

  // const handleOpenProfile = () => {
  //   if (userType == UserTypes.doctor) {
  //     navigation.navigate(mainRoute.doctorAccountScreen as never);
  //   } else if (userType == UserTypes.student) {
  //     navigation.navigate(mainRoute.studentAccountScreen as never);
  //   } else {
  //     navigation.navigate(mainRoute.accountScreen as never);
  //   }
  // };

  //render
  const renderRightHead = () => (
    <View style={styles.rightWrapper}>
      <Pressable
        hitSlop={screenStyles.hitSlop20}
        onPress={handleNotify}
        style={screenStyles.mL16}
      >
        <Image
          source={images.global.ico_notify}
          style={screenStyles.box22}
          resizeMode="contain"
        />
        {totalUnread != 0 && <View style={styles.hasNoti} />}
      </Pressable>
    </View>
  );

  const renderLeftHead = () => (
    <View style={styles.leftWrapper}>
      <Image
        source={images.global.logo_app_trans}
        style={screenStyles.box28}
        resizeMode="contain"
      />
      <View style={screenStyles.flex1}>
        <Row start style={styles.row}>
          <CText
            h5
            w600
            color={colors.black}
            style={screenStyles.mL8}
            numberOfLines={1}
          >
            {txtHeader}
          </CText>
        </Row>
      </View>
    </View>
  );

  return (
    <CHeader
      isBorderBottom={isBorderBottom}
      leftComponent={renderLeftHead()}
      rightComponent={renderRightHead()}
    />
  );
};

export default HeaderBarCarely;
