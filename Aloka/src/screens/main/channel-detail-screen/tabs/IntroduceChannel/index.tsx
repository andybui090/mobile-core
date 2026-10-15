import {AnimatedReadMore} from '@/components';
import {screenStyles} from '@/configs';
import {mainRoute} from '@/constants/route_key';
import {CLoading, CText} from '@/utils';
import {typeLoading} from '@/utils/CLoading';
import {useIsFocused} from '@react-navigation/native';
import {makeStyles, useTheme} from '@rneui/themed';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
// import ListSocials from './../../components/listSocials';
import Specialists from './../../components/specialists';
// import {Outstanding} from './outstanding';

interface Props {
  description?: string;
  categories: any;
  listVideosIntro?: any;
  navigation: any;
  links: any;
  firstRenderVideo: boolean;
  onShowSpecName: any;
  onSeeMoreVideo: any;
}

const useStyles = makeStyles(({colors}) => ({
  aboutWrapper: {
    backgroundColor: colors.cF9FAFB,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
}));

export const IntroduceChannel = React.memo(
  ({
    description = '',
    categories,
    listVideosIntro,
    navigation,
    links,
    firstRenderVideo,
    onShowSpecName,
    onSeeMoreVideo,
  }: Props) => {
    const {t} = useTranslation();

    const {
      theme: {colors},
    } = useTheme();

    const styles = useStyles();

    const isFocusScreen = useIsFocused();

    //ACTION
    const handlePressItemVideo = (item: any, index: number) => {
      // navigation.navigate(mainRoute.videoPlayStaticScreen, {
      //   firstIndex: index,
      //   data: listVideosIntro || [],
      //   type: 'expertOutstanding',
      //   isFromDetail: true,
      // });
    };

    // const _renderListVideo = () => {
    //   if (firstRenderVideo) {
    //     return (
    //       <View style={screenStyles.pV12}>
    //         <CLoading loadingSize={typeLoading.small} />
    //       </View>
    //     );
    //   } else if (listVideosIntro?.length > 0) {
    //     const isPlay = isFocusScreen;
    //     return (
    //       <Outstanding
    //         listData={listVideosIntro}
    //         isPlayTop={isPlay}
    //         onPressItem={handlePressItemVideo}
    //         onSeeMoreVideo={onSeeMoreVideo}
    //       />
    //     );
    //   }
    // };

    //RENDER
    const renderDescription = () => {
      return (
        <View style={[screenStyles.pH16, screenStyles.mT12]}>
          <CText color={colors.c101828} h5 w600>
            {t('doctorProfile.about')}
          </CText>
          <View style={styles.aboutWrapper}>
            {description ? (
              <AnimatedReadMore
                text={description}
                numberOfLines={3}
                seeMoreText={t('common.seeMore', 'See more')}
                seeLessText={t('common.viewLess', 'View less')}
                seeStyle={{color: colors.c98A2B3}}
              />
            ) : (
              <CText h5 color={colors.c98A2B3}>
                {t('common.noDataAvailable', 'No data available')}
              </CText>
            )}
          </View>
        </View>
      );
    };

    // const renderLinks = () => {
    //   if (links?.length > 0) {
    //     return <ListSocials socials={links} />;
    //   }
    // };

    const renderSpecialists = () => {
      const specialists = categories || [];
      if (specialists?.length > 0) {
        return (
          <Specialists
            specialists={specialists}
            onShowSpecName={onShowSpecName}
          />
        );
      }
    };

    return (
      <>
        {renderDescription()}
        {/* {_renderListVideo()} */}
        {renderSpecialists()}
        {/* {renderLinks()} */}
      </>
    );
  },
);
