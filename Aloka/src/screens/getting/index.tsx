import { makeStyles, useTheme } from '@rneui/themed';
import { ScreenWidth, screenStyles } from '@/configs';
import React, { useCallback, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { ImageHelper, Wrapper } from '@/components';
import AppIntroSlider from './AppIntroSlider';

const useStyles = makeStyles(({ colors }) => ({
  imgWrap: {
    ...screenStyles.centerWrap,
    height: ScreenWidth,
    width: ScreenWidth,
  },
}));

const GettingScreen = () => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const slideRef = useRef<any>(null);
  const [listIntro, setListIntro] = useState<any[]>([]);

  const [showBackBtn, setShowBackBtn] = useState(false);
  const [nextIndex, setNextIndex] = useState(1);
  
  // -------------------------------
  // ACTION
  // -------------------------------
  const handleSliderChange = useCallback((index: number) => {
    setShowBackBtn(index !== 0);
    setNextIndex(index + 1);
  }, []);

  // -------------------------------
  // RENDER
  // -------------------------------
  const renderItem = useCallback(
    ({ item }: any) => (
      <View style={screenStyles.flex1}>
        <View style={styles.imgWrap}>
          <ImageHelper source={{ uri: item.image }} resizeMode="contain" />
        </View>

        {/* <View style={styles.txtWrap}>
          <CText center h3 w600 color={colors.c101828} style={styles.title}>
            {item.title}
          </CText>
          <CText h5 center color={colors.c667085} style={styles.txtSubtitle}>
            {item.description}
          </CText>

          <View style={{ height: getBottomSpace() + 140 }} />
        </View> */}
      </View>
    ),
    [colors],
  );

  const renderNextButton = () => {
    return null;
  };

  const renderDoneButton = () => {
    return null;
  };

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default GettingScreen;
