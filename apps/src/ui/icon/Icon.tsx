import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { iconMap } from './iconMap';
import { IconType, ICON_TYPE } from './iconTypes';
import { useTheme } from '@/ui/providers/ThemeProvider';

interface IconProps {
  type?: IconType;
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const Icon: React.FC<IconProps> = ({
  type = ICON_TYPE.FEATHER,
  name,
  size = 24,
  color,
  style,
}) => {
  const { colors } = useTheme();
  const IconComponent = iconMap[type];

  return (
    <IconComponent
      name={name}
      size={size}
      color={color ?? colors.textPrimary}
      style={style}
    />
  );
};