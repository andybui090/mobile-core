import {ImageHelper} from '@/components';
import {screenStyles} from '@/configs';
import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {TouchableOpacity, StyleSheet, View} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  index?: number;
  showIndex?: boolean;
  item?: any;
  onViewDetail: (item: any) => void;
}

export const SBImageItem: React.FC<Props> = ({style, item, index: _index, onViewDetail}) => {
  return (
    <TouchableOpacity onPress={onViewDetail} style={[screenStyles.flex1, style]}>
      <View style={styles.imageWrapper}>
        <ImageHelper source={{uri: item?.image}} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
