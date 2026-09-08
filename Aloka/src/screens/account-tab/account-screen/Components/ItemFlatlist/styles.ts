import { widthPercentageToDP } from '@/configs';
import { spacings } from '@/theme';
import { makeStyles } from '@rneui/themed';

const useStyles = makeStyles(({ colors }) => ({
  container: {},
  textTitle: {},
  leftWrapper: {
    position: 'absolute',
    left: widthPercentageToDP('5%'),
  },
  rowContainer: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0,
    paddingBottom: spacings.md,
  },
  rowContainer2: {
    flex: 2,
    paddingBottom: spacings.md,
  },
}));

export default useStyles;
