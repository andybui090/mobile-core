import React from 'react';

// ✅ import kiểu mới (named export)
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Fontisto } from '@react-native-vector-icons/fontisto';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Octicons } from '@react-native-vector-icons/octicons';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Entypo } from '@react-native-vector-icons/entypo';

// 👉 map icon
const ICON_MAP = {
  ionicons: Ionicons,
  fontisto: Fontisto,
  antdesign: AntDesign,
  octicons: Octicons,
  materialicons: MaterialIcons,
  entypo: Entypo,
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
  type?: 'ionicons' | 'fontisto' | 'antdesign' | 'octicons' | 'materialicons' | 'entypo';
  name: React.ComponentProps<typeof Ionicons>['name'];
} & BaseProps;

export const IconX = ({
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
