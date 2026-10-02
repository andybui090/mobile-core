import { Wrapper } from '@/components';
import { ScreenWidth, images, screenStyles } from '@/configs';
// import { updateNotifySetting } from '@/redux/slices/notificationSlice';
// import { useAppDispatch } from '@/redux/store/customReduxHook';
import { CText, Container } from '@/utils';
import { useTheme } from '@rneui/themed';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';

export const Complete = ({ onComplete }: any) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  // const styles = useStyles();

  // const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatch(
    //   updateNotifySetting({
    //     type: 'All',
    //     status: true,
    //   }),
    // );
    setTimeout(() => {
      onComplete();
    }, 300);
  }, []);

  // const handleComplete = () => {
  //   onComplete();
  // };

  return (
    <Wrapper>
      <Container isCenter>
        <Image
          source={images.global.complete}
          style={{
            width: ScreenWidth / 3,
            height: ScreenWidth / 3,
          }}
          resizeMode="contain"
        />
        <CText h4 w600 style={screenStyles.mT10} color={colors.c101828}>
          {t('auth.registerSuccess', 'Register success!')}
        </CText>
      </Container>
    </Wrapper>
  );
};
