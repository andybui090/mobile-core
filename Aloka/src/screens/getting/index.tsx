import { CHeader, IconX, ImageHelper, Wrapper } from '@/components';
import { ScreenWidth, getBottomSpace, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import useI18n from '@/hooks/useI18n';
import { getTutorials } from '@/redux/slices/globalSlice';
import { getSettingsOnboarding } from '@/redux/slices/settingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CLoading, CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import AppIntroSlider from './AppIntroSlider';

const useStyles = makeStyles(() => ({
  imgWrap: {
    ...screenStyles.centerWrap,
    height: ScreenWidth,
    width: ScreenWidth,
  },
  leftWrapper: {
    position: 'absolute' as const,
    left: 16,
    ...screenStyles.rowCenter,
    alignItems: 'center' as const,
  },
  rightWrapper: { right: 20, position: 'absolute' as const, ...screenStyles.rowCenter },
  txtWrap: { justifyContent: 'center' as const, flex: 1, paddingHorizontal: 24 },
  txtSubtitle: { marginTop: 15 },
  title: { marginTop: 15 },
}));

const GettingScreen = () => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { lang } = useI18n();

  const slideRef = useRef<any>(null);
  const [listIntro, setListIntro] = useState<any>([]);

  const [showBackBtn, setShowBackBtn] = useState(false);
  const [nextIndex, setNextIndex] = useState(1);

  const { closeGettingStart } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const tutorialData = useAppSelector(
    state => state.globalReducer.tutorialData,
  );

  const [firstRender, setFirstRender] = useState<boolean>(false);
  // -------------------------------
  // LOAD API WHEN LANGUAGE CHANGES
  // -------------------------------
  useEffect(() => {
    if (!lang) return;
    const params = { fq: 'type:onboard', sort: 'order' };
    dispatch(getTutorials(params));
    dispatch(getSettingsOnboarding({ fq: 'type:onboard' }));
  }, [dispatch, lang]);

  // -------------------------------
  // HANDLE API RESPONSE
  // -------------------------------
  useEffect(() => {
    const { loading, data, error } = tutorialData;
    if (loading) return;
    if (data) {
      setListIntro(data.items ?? []);
      setFirstRender(false);
    } else if (error) {
      setFirstRender(false);
    }
  }, [tutorialData]);

  // -------------------------------
  // ACTION
  // -------------------------------
  const handleSliderChange = (index: number) => {
    setShowBackBtn(index !== 0);
    setNextIndex(index + 1);
  };

  const handleNextSlide = () => {
    slideRef.current?.goToSlide(nextIndex, true);
  };

  const handleCloseGettingStart = () => {
    closeGettingStart();
  };

  const handleBackSlide = () => {
    if (nextIndex > 1) slideRef.current?.goToSlide(nextIndex - 2, true);
  };

  const renderItem = ({ item }: any) => {
    const { image, title, description } = item;
    return (
      <View style={screenStyles.flex1}>
        <View style={styles.imgWrap}>
          <ImageHelper source={{ uri: image ?? '' }} resizeMode="contain" />
        </View>
        <View style={styles.txtWrap}>
          <CText center h3 w600 color={colors.c101828} style={styles.title}>
            {title ?? ''}
          </CText>
          <CText h5 center color={colors.c667085} style={styles.txtSubtitle}>
            {description ?? ''}
          </CText>
          <View style={{ height: getBottomSpace() + 140 }} />
        </View>
      </View>
    );
  };

  const renderNextButton = () => (
    <CButton
      onPress={handleNextSlide}
      title={t('common.continue')}
      btnWidth="100%"
    />
  );

  const renderDoneButton = () => (
    <CButton
      onPress={handleCloseGettingStart}
      title={t('course.getStarted')}
      btnWidth="100%"
    />
  );

  const renderContent = () => {
    if (firstRender) return <CLoading />;

    return (
      <AppIntroSlider
        ref={slideRef}
        data={listIntro}
        renderItem={renderItem}
        showNextButton
        showDoneButton
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        onSlideChange={handleSliderChange}
      />
    );
  };

  const renderLeftHead = () =>
    showBackBtn && (
      <View style={styles.leftWrapper}>
        <Pressable onPress={handleBackSlide}>
          <IconX
            type="ionicons"
            name="chevron-back"
            size={26}
            color={colors.c667085}
            style={{ marginLeft: 3 }}
          />
        </Pressable>
      </View>
    );

  const renderRightHead = () => (
    <View style={styles.rightWrapper}>
      <Pressable onPress={handleCloseGettingStart}>
        <CText h5 w400 color={colors.c667085}>
          {t('tutorial.skip', 'Skip')}
        </CText>
      </Pressable>
    </View>
  );

  return (
    <Wrapper>
      <CHeader
        rightComponent={renderRightHead()}
        leftComponent={renderLeftHead()}
        leftComponentDisable={!showBackBtn}
      />
      {renderContent()}
    </Wrapper>
  );
};

export default GettingScreen;
