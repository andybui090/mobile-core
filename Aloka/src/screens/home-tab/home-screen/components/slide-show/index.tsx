import { ScreenWidth } from '@/configs';
import { AppContext } from '@/contexts';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Carousel } from 'react-native-reanimated-carousel';
import { SBItem } from './SBItem';

const useStyles = makeStyles(({ colors }) => ({
  bgBlur: {
    width: '100%',
    alignItems: 'center' as const,
  },
  slideWrapper: {
    marginTop: -10,
    height: ScreenWidth * 0.5,
  },
}));

interface SlideShowProps {
  onViewDetail: (item: any, idx: number) => void;
  onChangeImgIndex: (item: any) => void;
  DATABANNER?: any;
  page: string;
}

const baseOptions = {
  vertical: false,
  width: ScreenWidth,
  height: ScreenWidth * 0.5, //chuan la 0.6, nhung chua 1 khoang de hien thi text
} as const;

export const SlideShow: React.FC<SlideShowProps> = ({
  onViewDetail,
  onChangeImgIndex,
  DATABANNER,
  page,
}) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  const slideRef = useRef<any>(null);
  const progressValue = useSharedValue<number>(0);

  const [slideIndex, setSlideIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  // const [pagingEnabled, setPagingEnabled] = useState<boolean>(true);
  // const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { user } = useContext(AppContext);

  //ACTION
  // const handleChangeSlide = (e: any, absoluteProgress: any) => {
  const handleChangeSlide = (progress: any) => {
    progressValue.value = progress;
    const index = slideRef?.current?.getCurrentIndex();
    setSlideIndex(index);
    //chinh sua them version 2 thay doi bg image
    if (DATABANNER[index]) {
      onChangeImgIndex(DATABANNER[index].image);
    }
  };

  const handleViewDetail = () => {
    onViewDetail(DATABANNER[slideIndex], slideIndex);
  };

  const handleSnapToItem = (index: number) => {
    // Reset the flag after handling the event
    if (isAutoPlaying) {
      // console.log('This transition was caused by auto-play.');
    } else {
      setIsAutoPlaying(true);
    }
  };

  //RENDER
  const renderCarousel = () => {
    if (DATABANNER?.length == 1) {
      return (
        <View
          style={[
            {
              paddingVertical: 14,
              height: (ScreenWidth - 24) * 0.5,
              width: ScreenWidth - 24,
            },
          ]}
        >
          <SBItem
            item={DATABANNER[0]}
            index={0}
            onViewDetail={handleViewDetail}
          />
        </View>
      );
    }
    return (
      <View style={styles.slideWrapper}>
        <Carousel
          ref={slideRef}
          {...baseOptions}
          style={{
            width: ScreenWidth,
          }}
          loop
          snapMode="page"
          autoplay={autoPlay}
          autoplayInterval={3000}
          onProgressChange={handleChangeSlide}
          layout={{
            type: 'parallax',
            offset: 100,
            scale: 0.78,
            adjacentScale: 0.62,
          }}
          data={DATABANNER}
          renderItem={({ item, index }: any) => {
            return (
              <SBItem
                item={item}
                index={index}
                onViewDetail={handleViewDetail}
              />
            );
          }}
          onScrollStart={() => {
            // When the user starts scrolling, disable auto-play
            setIsAutoPlaying(false);
          }}
          onSnapToItem={handleSnapToItem}
        />
      </View>
    );
  };

  const renderPagination = () => {
    return (
      !!progressValue && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignSelf: 'center',
            top: -10,
          }}
        >
          {DATABANNER.map((item: any, index: number) => {
            return (
              <PaginationItem
                backgroundColor={colors.primary}
                animValue={progressValue}
                index={index}
                key={index}
                isRotate={false}
                length={DATABANNER.length}
              />
            );
          })}
        </View>
      )
    );
  };

  return (
    <View style={styles.bgBlur}>
      {renderCarousel()}
      {DATABANNER.length > 2 && renderPagination()}
    </View>
  );
};

const PaginationItem: React.FC<{
  index: number;
  backgroundColor: string;
  length: number;
  animValue: SharedValue<number>;
  isRotate?: boolean;
}> = props => {
  const {
    theme: { colors },
  } = useTheme();

  const { animValue, index, length, backgroundColor, isRotate } = props;

  const width = 8;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);

  return (
    <View
      style={{
        backgroundColor: colors.cD0D5DD,
        width,
        height: width,
        borderRadius: 5,
        overflow: 'hidden',
        transform: [
          {
            rotateZ: isRotate ? '90deg' : '0deg',
          },
        ],
        marginHorizontal: 3,
      }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 5,
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};
