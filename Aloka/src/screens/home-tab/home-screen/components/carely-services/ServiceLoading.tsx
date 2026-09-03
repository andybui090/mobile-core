import { ScreenWidth } from '@/configs';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';

const CARD_WIDTH = ScreenWidth * 0.4;
const CARD_HEIGHT = 72; // gần với card thật
const GAP = 16;

export const ServiceLoading = () => {
  return (
    <View style={{ flexDirection: 'row', marginTop: 12 }}>
      {[0, 1, 2].map((_, columnIndex) => (
        <ContentLoader
          key={columnIndex}
          width={CARD_WIDTH}
          height={CARD_HEIGHT * 2 + GAP}
          backgroundColor="#E3E3E3"
          foregroundColor="#FFFFFF"
          style={{ marginRight: 16 }}
        >
          {/* item 1 */}
          <Rect
            x={0}
            y={0}
            rx={12}
            ry={12}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
          />

          {/* item 2 */}
          <Rect
            x={0}
            y={CARD_HEIGHT + GAP}
            rx={12}
            ry={12}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
          />
        </ContentLoader>
      ))}
    </View>
  );
};