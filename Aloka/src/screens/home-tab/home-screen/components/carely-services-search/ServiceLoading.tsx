import { ScreenWidth } from '@/configs';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';

const CARD_WIDTH = ScreenWidth / 2 - 24;
const IMAGE_HEIGHT = 130;
const GAP = 16;

export const ServiceLoading = () => {
  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
      {[0, 1].map(columnIndex => (
        <View key={columnIndex} style={{ marginRight: columnIndex === 0 ? GAP : 0 }}>
          {[0, 1].map(itemIndex => (
            <ContentLoader
              key={itemIndex}
              width={CARD_WIDTH}
              height={230}
              backgroundColor="#E6E6E6"
              foregroundColor="#FFFFFF"
              style={{ marginBottom: GAP }}
            >
              {/* Image */}
              <Rect
                x={0}
                y={0}
                rx={12}
                ry={12}
                width={CARD_WIDTH}
                height={IMAGE_HEIGHT}
              />

              {/* Title line 1 */}
              <Rect
                x={0}
                y={IMAGE_HEIGHT + 10}
                rx={4}
                ry={4}
                width={CARD_WIDTH * 0.9}
                height={12}
              />

              {/* Title line 2 */}
              <Rect
                x={0}
                y={IMAGE_HEIGHT + 28}
                rx={4}
                ry={4}
                width={CARD_WIDTH * 0.7}
                height={12}
              />

              {/* Rating */}
              <Rect
                x={0}
                y={IMAGE_HEIGHT + 48}
                rx={4}
                ry={4}
                width={60}
                height={10}
              />

              {/* Location */}
              {/* <Rect
                x={70}
                y={IMAGE_HEIGHT + 48}
                rx={4}
                ry={4}
                width={CARD_WIDTH * 0.35}
                height={10}
              /> */}

              {/* Price */}
              {/* <Rect
                x={0}
                y={IMAGE_HEIGHT + 70}
                rx={6}
                ry={6}
                width={80}
                height={14}
              /> */}
            </ContentLoader>
          ))}
        </View>
      ))}
    </View>
  );
};
