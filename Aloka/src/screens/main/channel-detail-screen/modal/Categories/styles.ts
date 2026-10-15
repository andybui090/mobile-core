import { makeStyles } from '@rneui/themed';

const useStyles = makeStyles(({ colors }) => ({
  tab: {
    marginRight: 10,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  moreButton: {
    borderRadius: 25,
    backgroundColor: colors.cF9FAFB,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
}));

export default useStyles;
