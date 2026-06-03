import { useThemeContext } from '@/shared/theme/ThemeProvider';
import { Header, Screen, Text } from '@/shared/ui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { FontScaleDemo } from './FontScaleDemo';

export const TestDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { type } = route.params;

  const { theme } = useThemeContext();
  const { colors } = theme;

  const renderContent = () => {
    switch (type) {
      case 'text':
        return <Text variant="h1">Text Demo</Text>;

      case 'button':
        return <Text>Button demo</Text>;

      case 'theme':
        return <Text>Theme demo</Text>;

      case 'fontScale':
        return <FontScaleDemo />;

      default:
        return <Text>Unknown</Text>;
    }
  };

  return (
    <Screen>
      <Header
        title="TestDetailScreen"
        onBack={() => navigation.goBack()}
      />

      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: colors.background,
        }}
      >
        <Text variant="h1" weight="bold" color={colors.textPrimary}>
          {type?.toUpperCase()}
        </Text>

        <View style={{ marginTop: 20 }}>{renderContent()}</View>
      </View>
    </Screen>
  );
};