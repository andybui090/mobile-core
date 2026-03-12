import { FontScaleProvider } from '@/ui/providers/FontScaleProvider';
import { ThemeProvider } from '@/ui/providers/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation';

export default function ContainerApp() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FontScaleProvider>
          {/* các provider khác */}
          <RootNavigator />
        </FontScaleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
