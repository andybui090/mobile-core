import { StyleSheet, ViewStyle } from 'react-native';

const layoutStyles = {
  flex1: { flex: 1 },
  fillParent: { width: '100%', height: '100%' },
  absoluteFill: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
} satisfies Record<string, ViewStyle>;

const rowStyles = {
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  rowBetweenCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
} satisfies Record<string, ViewStyle>;

export const appStyles = StyleSheet.create({
  ...layoutStyles,
  ...rowStyles,
});
