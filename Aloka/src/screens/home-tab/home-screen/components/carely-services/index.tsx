import { ImageHelper } from '@/components';
import { images, isIOS, screenStyles, ScreenWidth } from '@/configs';
import { CEmptyData, CText } from '@/utils';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  View,
} from 'react-native';
import { ServiceLoading } from './ServiceLoading';

const useStyles = makeStyles(({ colors }) => ({
  column: {
    marginRight: 16,
  },
  card: {
    width: ScreenWidth * 0.4,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.cE6FAFA,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    overflow: 'hidden' as const,
    // padding:8,
  },
}));

const CarelyServices = (props: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();

  const flatRef = useRef<any>(null);

  //
  const {
    loading,
    listData,
    onLoadMore,
    finalLoad,
    onEndReached,
    setOnEndReached,
    onPressItem,
  } = props;

  const [listGroup, setListGroup] = useState<any>([]);

  // group 2 item / column
  const groupIntoColumns = (data: any, size = 2) => {
    const result = [];
    for (let i = 0; i < data.length; i += size) {
      result.push(data.slice(i, i + size));
    }
    return result;
  };

  useEffect(() => {
    if (listData.length > 0) {
      const columns = groupIntoColumns(listData);
      setListGroup(columns);
    }
  }, [listData]);

  //

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.img_default}
        style={screenStyles.box28}
        resizeMode="contain"
      />
    );
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <View style={styles.column}>
        {item.map((service: any) => (
          <Pressable
            key={service.id}
            style={styles.card}
            onPress={() => onPressItem(service)}
          >
            <View style={styles.iconBox}>
              <ImageHelper
                source={{ uri: service.thumbnail || '' }}
                renderErrorImage={renderErrorImage}
              />
            </View>
            <View style={[screenStyles.flex1, screenStyles.mL10]}>
              <CText
                h5
                w400
                color={colors.c101828}
                style={{ flexShrink: 1 }}
                numberOfLines={2}
              >
                {service.name || 'Service'}
              </CText>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  const _renderSearchResultsFooter = () => {
    return !finalLoad && !onEndReached ? (
      <View style={[screenStyles.centerWrap, { height: 140 }]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    ) : null;
  };

  const renderList = () => {
    if (loading) {
      return <ServiceLoading />;
    }
    return (
      <View style={screenStyles.mT12}>
        <FlatList
          ref={flatRef}
          contentContainerStyle={[screenStyles.flexGrow1]}
          data={listGroup}
          extraData={listGroup}
          keyExtractor={(_, index) => `column-${index}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={isIOS ? 160 : 16}
          scrollsToTop={false}
          ListEmptyComponent={<CEmptyData isSmall />}
          ListFooterComponent={_renderSearchResultsFooter}
          onMomentumScrollBegin={() => setOnEndReached(false)}
          onEndReached={onLoadMore}
        />
        <Divider color={colors.cF9FAFB} width={7} />
      </View>
    );
  };
  return (
    <View style={[screenStyles.pH14, screenStyles.pV12]}>
      <CText h46 w600 color={colors.c101828}>
        {t('carely.service', 'Service')}
      </CText>
      {renderList()}
    </View>
  );
};

export default CarelyServices;
