import React from 'react';

import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Fontisto } from '@react-native-vector-icons/fontisto';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Octicons } from '@react-native-vector-icons/octicons';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Entypo } from '@react-native-vector-icons/entypo';

export const IconType = {
  IONICONS: 'ionicons',
  FONTISTO: 'fontisto',
  ANT_DESIGN: 'antdesign',
  OCTICONS: 'octicons',
  MATERIAL_ICONS: 'materialicons',
  MATERIAL_DESIGN_ICONS: 'materialdesignicons',
  ENTYPO: 'entypo',
} as const;

export type IconType = typeof IconType[keyof typeof IconType];

const ICON_MAP = {
  [IconType.IONICONS]: Ionicons,
  [IconType.FONTISTO]: Fontisto,
  [IconType.ANT_DESIGN]: AntDesign,
  [IconType.OCTICONS]: Octicons,
  [IconType.MATERIAL_ICONS]: MaterialIcons,
  [IconType.MATERIAL_DESIGN_ICONS]: MaterialDesignIcons,
  [IconType.ENTYPO]: Entypo,
};

type BaseProps = {
  size?: number;
  color?: string;
  style?: any;
  onPress?: () => void;
};

type IconProps = {
  type?: IconType;
  name: string;
} & BaseProps;

export const IconX = ({
  type = IconType.IONICONS,
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