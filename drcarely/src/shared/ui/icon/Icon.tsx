import React from 'react';

// ✅ import kiểu mới (named export)
import { Ionicons } from '@react-native-vector-icons/ionicons';

import { useThemeContext } from '@/shared/theme/ThemeProvider';
import { SizeKey } from '@/shared/theme/tokens/sizes';

// 👉 map icon
const ICON_MAP = {
  ionicons: Ionicons,
};

export type IconType = keyof typeof ICON_MAP;

// 👉 base props
type BaseProps = {
  size?: number | SizeKey; // 🔥 dùng global sizes
  color?: string;
  style?: any;
  onPress?: () => void;
};

// 👉 type-safe name
type IconProps = {
  type?: 'ionicons';
  name: React.ComponentProps<typeof Ionicons>['name'];
} & BaseProps;

export const Icon = ({
  type = 'ionicons',
  name,
  size = 'md',
  color,
  style,
  onPress,
}: IconProps) => {
  const Component = ICON_MAP[type];

  const { theme, fontSizeMode } = useThemeContext();

  // 🔥 base size từ global sizes
  const baseSize =
    typeof size === 'number'
      ? size
      : theme.sizes[size];

  // 🔥 scale theo font mode (bạn đã có config rồi)
  const scale =
    fontSizeMode === 'small'
      ? 0.9
      : fontSizeMode === 'large'
      ? 1.1
      : 1;

  const finalSize = baseSize * scale;

  return (
    <Component
      name={name as any}
      size={finalSize}
      color={color ?? theme.colors.textPrimary}
      onPress={onPress}
      style={style}
    />
  );
};