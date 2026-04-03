import React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/ui';
import { useThemeContext } from '@/shared/theme/ThemeProvider';

export const FontScaleDemo = () => {
  const { fontSizeMode, setFontSizeMode } = useThemeContext();

  return (
    <View style={{ marginTop: 20 }}>
      {/* Toggle */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Text
          style={{ marginRight: 12 }}
          weight={fontSizeMode === 'small' ? 'bold' : 'regular'}
          onPress={() => setFontSizeMode('small')}
        >
          Small
        </Text>

        <Text
          style={{ marginRight: 12 }}
          weight={fontSizeMode === 'normal' ? 'bold' : 'regular'}
          onPress={() => setFontSizeMode('normal')}
        >
          Normal
        </Text>

        <Text
          weight={fontSizeMode === 'large' ? 'bold' : 'regular'}
          onPress={() => setFontSizeMode('large')}
        >
          Large
        </Text>
      </View>

      {/* Demo text */}
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="body">Body text</Text>
      <Text variant="caption">Caption text</Text>
    </View>
  );
};