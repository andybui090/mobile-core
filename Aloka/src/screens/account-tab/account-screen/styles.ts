import { screenStyles, widthPercentageToDP } from '@/configs';
import { spacings } from '@/theme';
import { makeStyles } from '@rneui/themed';

const useStyles = makeStyles(({ colors }) => ({
  container: {
    backgroundColor: colors.cF9FAFB,
    padding: 0,
    margin: 0,
    borderWidth: 1,
    borderColor: colors.cF9FAFB,
    borderTopColor: colors.cF9FAFB,
    borderBottomColor: colors.cF9FAFB,
    borderRadius: 8,
  },
  textTitle: {},
  leftWrapper: {
    position: 'absolute' as const,
    left: widthPercentageToDP('5%'),
  },
  rightWrapper: {
    position: 'absolute' as const,
    right: widthPercentageToDP('5%'),
  },
  btnStyle: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  imgWrap: {
    ...screenStyles.centerWrap,
    height: 64,
    width: 64,
    borderRadius: 50,
    overflow: 'hidden' as const,
  },
  line: { height: 7, backgroundColor: colors.cF9FAFB, marginTop: spacings.md },
  btnWrap: {
    marginTop: 20,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    ...screenStyles.rowCenter,
  },
  btnRow: {
    marginTop: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  actionBtn: {
    flex: 1,
    borderColor: '#2F80ED',
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    ...screenStyles.rowCenter,
  },
}));

export default useStyles;
