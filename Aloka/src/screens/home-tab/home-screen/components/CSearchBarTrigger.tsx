import { IconX } from '@/components';
import { images, screenStyles } from '@/configs';
import { CText } from '@/utils';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

interface Props {
  placeholder?: string;
  onPress?: () => void;
  onPressFilter?: () => void;
}

const CSearchBarTrigger = ({
  placeholder = 'Tìm kiếm',
  onPress,
  onPressFilter,
}: Props) => {
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Search input area */}
        <Pressable onPress={onPress} style={styles.searchArea}>
          <IconX
            name="search-outline"
            type="ionicons"
            size={20}
            color={colors.c98A2B3}
          />
          <CText h5 style={styles.text} color={colors.c98A2B3}>
            {placeholder}
          </CText>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Filter button */}
        <Pressable
          onPress={onPressFilter}
          hitSlop={10}
          style={styles.filterBtn}
        >
          <Image
            source={images.home.ic_filter_disable}
            style={screenStyles.fillParent}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  searchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    flex: 1,
    marginHorizontal: 8,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  filterBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CSearchBarTrigger;
