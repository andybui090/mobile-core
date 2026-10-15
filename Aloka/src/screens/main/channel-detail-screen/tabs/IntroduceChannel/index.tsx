import { AnimatedReadMore } from '@/components';
import { screenStyles } from '@/configs';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Specialists from './../../components/specialists';

interface Props {
  description?: string;
  categories: any;
  onShowSpecName: any;
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
    onShowSpecName,
  }: Props) => {
    const {t} = useTranslation();

    const {
      theme: {colors},
    } = useTheme();

    const styles = useStyles();

    //ACTION

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
        {renderSpecialists()}
      </>
    );
  },
);
