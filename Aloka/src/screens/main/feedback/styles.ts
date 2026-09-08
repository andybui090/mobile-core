import { screenStyles, widthPercentageToDP } from '@/configs';
import { spacings } from '@/theme';
import { makeStyles } from '@rneui/themed';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    paddingHorizontal: spacings.md,
  } as ViewStyle,
  rightWrapper: {
    right: widthPercentageToDP('5%'),
    position: 'absolute',
    ...screenStyles.rowCenter,
  } as ViewStyle,
  btn: {
    backgroundColor: colors.white,
    color: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  } as ViewStyle,
  scrollViewStyle: {
    flexGrow: 1,
    backgroundColor: colors.white,
  } as ViewStyle,
  textInputContainerStyle: {
    padding: 16,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  } as ViewStyle,
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.c667085,
    minHeight: 100,
  } as TextStyle,
  imageStyle: {
    width: 64,
    height: 64,
    borderRadius: 8,
  } as ImageStyle,
  imageContainerStyle: {
    flexDirection: 'row',
    position: 'relative',
    paddingHorizontal: 10,
  } as ViewStyle,
  removeImageButtonStyle: {
    position: 'absolute',
    right: 0,
    top: -10,
    backgroundColor: 'white',
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  } as ViewStyle,
  supportContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  } as ViewStyle,
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  } as ViewStyle,
}));

export default useStyles;
