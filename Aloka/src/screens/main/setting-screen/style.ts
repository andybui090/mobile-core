import { spacings } from '@/theme';
import { makeStyles } from '@rneui/themed';

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    padding: spacings.md,
    backgroundColor: colors.cFCFCFD || '#FCFCFD',
  },
  bgWhite: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacings.md,
    marginBottom: spacings.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  btnStyle: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  icon: {
    width: 25,
    height: 25,
    padding: 4,
    borderRadius: 4,
    marginBottom: spacings.md,
    marginRight: spacings.md,
  },
}));

export default useStyles;
