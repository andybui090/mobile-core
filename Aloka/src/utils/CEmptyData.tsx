import { ScreenWidth, getBottomSpace, images } from '@/configs';
import { CText, Row } from '@/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';

interface CEmptySearchProps {
  title?: string;
  style?: ViewStyle | object;
  isSmall?: boolean;
}

export const CEmptyData: React.FC<CEmptySearchProps> = ({
  title,
  style = {},
  isSmall,
}) => {
  const { t } = useTranslation();
  return (
    <View style={[isSmall ? styles.containerSmall : styles.container, style]}>
      <View
        style={{
          width: ScreenWidth / 2.5,
          height: ScreenWidth / 2.5,
        }}
      >
        <Image
          source={images.global.empty_data}
          resizeMode="contain"
          style={styles.img}
        />
      </View>
      <Row style={styles.rowText}>
        <CText h5 w500 center style={{ color: '#667085' }}>
          {title ?? t('common.noDataAvailable', 'No data available')}
        </CText>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: getBottomSpace() + 50,
    backgroundColor: 'white',
  },
  containerSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 30,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  rowText: {
    paddingHorizontal: 20,
  },
});
