import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { Root } from './Root';

export default function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}