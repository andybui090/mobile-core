import {CHeader, 
  // ICON_TYPE, IconX, 
  ImageHelper, Wrapper} from '@/components';
import {
  // GAEvents,
  // GALogEvent,
  ScreenWidth,
  getBottomSpace,
  screenStyles,
} from '@/configs';
import {AppContext} from '@/contexts/AppContext';
import useI18n from '@/hooks/useI18n';
import {getTutorials} from '@/redux/slices/globalSlice';
// import {getSettingsOnboarding} from '@/redux/slices/settingSlice';
import {useAppDispatch, useAppSelector} from '@/redux/store/customReduxHook';
import {CButton, CText} from '@/utils';
import {makeStyles, useTheme} from '@rneui/themed';
import {useContext, useEffect, useRef, useState, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, View} from 'react-native';
import AppIntroSlider from './AppIntroSlider';

const useStyles = makeStyles(({colors}) => ({
  imgWrap: {
    ...screenStyles.centerWrap,
    height: ScreenWidth,
    width: ScreenWidth,
  },
  txtWrap: {justifyContent: 'center', flex: 1, paddingHorizontal: 24},
  txtSubtitle: {marginTop: 15},
  title: {marginTop: 15},
  rightWrapper: {right: 20, position: 'absolute', ...screenStyles.rowCenter},
  leftWrapper: {
    position: 'absolute',
    left: 16,
    ...screenStyles.rowCenter,
    alignItems: 'center',
  },
}));

// -------------------------------
// MAIN
// -------------------------------
const GettingScreen = () => {
  const {t} = useTranslation();
  const styles = useStyles();

  const {
    theme: {colors},
  } = useTheme();

  const {lang} = useI18n();
  const dispatch = useAppDispatch();
  const slideRef = useRef<any>(null);
  const {tutorialList} = useAppSelector(state => state.globalReducer);

  const {closeGettingStart} = useContext(AppContext);

  const [showBackBtn, setShowBackBtn] = useState(false);
  const [nextIndex, setNextIndex] = useState(1);
  const [listIntro, setListIntro] = useState<any[]>([]);

  // -------------------------------
  // LOAD API WHEN LANGUAGE CHANGES
  // -------------------------------
  useEffect(() => {
    if (!lang) return;
    const params = {fq: 'type:onboard', sort: 'order'};
    dispatch(getTutorials(params));
    // dispatch(getSettingsOnboarding({fq: 'type:onboard'}));
  }, [lang]);

  // -------------------------------
  // HANDLE API RESPONSE
  // -------------------------------
  useEffect(() => {
    const {loading, data, error} = tutorialList || {};
    // console.log("🚀 ~ GettingScreen ~ tutorialList:", tutorialList)
    if (loading) return;
    if (data?.items) setListIntro(data.items);
  }, [tutorialList]);

  // -------------------------------
  // ACTIONS
  // -------------------------------
  const handleSkip = useCallback(() => {
    // GALogEvent(GAEvents.ONBOARDING_SKIPPED, {method: 'App Onboarding Skipped'});
    closeGettingStart();
  }, []);

  const handleDone = useCallback(() => {
    // GALogEvent(GAEvents.ONBOARDING_STARTED, {method: 'App Onboarding Started'});
    closeGettingStart();
  }, []);

  const handleBackSlide = useCallback(() => {
    if (nextIndex > 1) slideRef.current?.goToSlide(nextIndex - 2, true);
  }, [nextIndex]);

  const handleNextSlide = useCallback(() => {
    slideRef.current?.goToSlide(nextIndex, true);
  }, [nextIndex]);

  const handleSliderChange = useCallback((index: number) => {
    setShowBackBtn(index !== 0);
    setNextIndex(index + 1);
  }, []);

  // -------------------------------
  // RENDER ITEM
  // -------------------------------
  const renderItem = useCallback(
    ({item}: any) => (
      <View style={screenStyles.flex1}>
        <View style={styles.imgWrap}>
          <ImageHelper source={{uri: item.image}} resizeMode="contain" />
        </View>

        <View style={styles.txtWrap}>
          <CText center h3 w600 color={colors.c101828} style={styles.title}>
            {item.title}
          </CText>
          <CText h5 center color={colors.c667085} style={styles.txtSubtitle}>
            {item.description}
          </CText>

          <View style={{height: getBottomSpace() + 140}} />
        </View>
      </View>
    ),
    [colors],
  );

  // -------------------------------
  // HEADER COMPONENTS
  // -------------------------------
  const renderRightHead = () => (
    <View style={styles.rightWrapper}>
      <Pressable onPress={handleSkip}>
        <CText h5 w400 color={colors.c667085}>
          {t('tutorial.skip', 'Skip')}
        </CText>
      </Pressable>
    </View>
  );

  const renderLeftHead = () =>
    showBackBtn && (
      <View style={styles.leftWrapper}>
        <Pressable onPress={handleBackSlide}>
          {/* <IconX
            origin={ICON_TYPE.FEATHER_ICONS}
            name="chevron-left"
            size={26}
            color={colors.c667085}
            style={{marginLeft: 3}}
          /> */}
        </Pressable>
      </View>
    );

  // -------------------------------
  // NEXT & DONE BUTTON
  // -------------------------------
  const renderNextButton = () => (
    <CButton
      onPress={handleNextSlide}
      title={t('common.continue')}
      btnWidth="100%"
    />
  );

  const renderDoneButton = () => (
    <CButton
      onPress={handleDone}
      title={t('course.getStarted')}
      btnWidth="100%"
    />
  );

  // -------------------------------
  // RENDER CONTENT
  // -------------------------------
  return (
    <Wrapper>
      <View style={screenStyles.flex1}>
        <CHeader
          rightComponent={renderRightHead()}
          leftComponent={renderLeftHead()}
          leftComponentDisable={!showBackBtn}
        />

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
      </View>
    </Wrapper>
  );
};

export default GettingScreen;
