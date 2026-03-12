import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { Row } from '@/ui/primitives/Row';
import { CText } from '@/ui/primitives/CText';
import { useTheme } from '@/ui/providers/ThemeProvider';
import { Icon, ICON_TYPE } from '../icon';

type HeaderIcon = 'back' | 'close' | 'menu';

interface HeaderProps {
  title?: string;
  titleComponent?: React.ReactNode;

  left?: React.ReactNode;
  right?: React.ReactNode;

  leftIcon?: HeaderIcon;
  rightIcon?: HeaderIcon;

  onLeftPress?: () => void;
  onRightPress?: () => void;

  height?: number;
  backgroundColor?: string;
  border?: boolean;

  style?: StyleProp<ViewStyle>;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  titleComponent,

  left,
  right,

  leftIcon,
  rightIcon,

  onLeftPress,
  onRightPress,

  height = 44,
  backgroundColor,
  border = false,

  style,
}) => {
  const { colors } = useTheme();

  const renderIcon = (type?: HeaderIcon) => {
    if (!type) return null;

    const nameMap: Record<HeaderIcon, string> = {
      back: 'chevron-back',
      close: 'close',
      menu: 'menu',
    };

    return (
      <Icon
        type={ICON_TYPE.IONICONS}
        name={nameMap[type]}
        size={24}
        color={colors.textPrimary}
      />
    );
  };

  return (
    <Row
      align="center"
      justify="center"
      style={[
        {
          height,
          backgroundColor: backgroundColor ?? colors.background,
          borderBottomWidth: border ? 1 : 0,
          borderBottomColor: colors.border,
          paddingHorizontal: 16,
        },
        style,
      ]}
    >
      {/* LEFT */}
      <Row style={{ position: 'absolute', left: 16 }}>
        {left ? (
          left
        ) : leftIcon ? (
          <Pressable onPress={onLeftPress} hitSlop={20}>
            {renderIcon(leftIcon)}
          </Pressable>
        ) : null}
      </Row>

      {/* TITLE */}
      {titleComponent ? (
        titleComponent
      ) : title ? (
        <CText variant="title" weight="semibold">
          {title}
        </CText>
      ) : null}

      {/* RIGHT */}
      <Row style={{ position: 'absolute', right: 16 }}>
        {right ? (
          right
        ) : rightIcon ? (
          <Pressable onPress={onRightPress} hitSlop={20}>
            {renderIcon(rightIcon)}
          </Pressable>
        ) : null}
      </Row>
    </Row>
  );
};
