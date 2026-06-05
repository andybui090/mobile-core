import { makeStyles } from '@/shared/theme';

const useStyles = makeStyles(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imgBg: {
    width: '100%', height: '100%'
  }
}));

export default useStyles;
