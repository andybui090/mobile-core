import { makeStyles } from '@rneui/themed';
import { fonts } from '@/configs';

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
  inputContainer: {
    height: 42,
    backgroundColor: 'transparent',
    padding: 0,
  },
  input: {
    fontSize: 14,
    color: colors.c101828,
    fontFamily: fonts.inter,
    marginLeft: 5,
  },
}));

export default useStyles;