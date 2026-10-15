import { Dimensions, StyleSheet } from 'react-native';
import { makeStyles } from '@rneui/themed';

const { width: ScreenWidth } = Dimensions.get('window');

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.white || '#FFFFFF',
    },
    footer: {
      position: 'absolute',
      bottom: 24,
      backgroundColor: colors.cF2F4F7 || '#F2F4F7',
      width: ScreenWidth - 48,
      borderRadius: 15,
      marginHorizontal: 24,
      paddingVertical: 8,
      paddingHorizontal: 8,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 3,
    },
    btnActive: {
      backgroundColor: colors.primary || '#19A2A7',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 4,
    },
    btn: {
      backgroundColor: 'transparent',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 4,
    },
    btnTextActive: {
      color: colors.white || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
    btnTextInactive: {
      color: colors.c667085 || '#667085',
      fontSize: 14,
      fontWeight: '500',
      marginLeft: 8,
    },
  })
);

export default useStyles;
