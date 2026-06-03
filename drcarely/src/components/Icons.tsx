import React from 'react';

// ✅ import kiểu mới (named export)
import { Ionicons } from '@react-native-vector-icons/ionicons';

// 👉 map icon
const ICON_MAP = {
  ionicons: Ionicons,
};

export type IconType = keyof typeof ICON_MAP;

// 👉 base props
type BaseProps = {
  size?: number; // 🔥 dùng global sizes
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
  size = 24,
  color,
  style,
  onPress,
}: IconProps) => {
  const Component = ICON_MAP[type];

  return (
    <Component
      name={name as any}
      size={size}
      color={color}
      onPress={onPress}
      style={style}
    />
  );
};