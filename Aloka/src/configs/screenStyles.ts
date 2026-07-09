import { Platform, StyleSheet } from 'react-native';
import { getBottomSpace, getStatusBarHeight, ifIphoneX } from './helpers/Notch';
import { spacings } from '@/theme';
import { fonts } from './font';

export const screenStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flex1Center: {
    flex: 1,
    alignItems: 'center',
  },
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  flexGrow1: {
    flexGrow: 1,
  },
  flexGrowBottom: {
    flexGrow: 1,
    paddingBottom: getBottomSpace() + ifIphoneX(5, 10),
  },
  flex1EndBottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  flexEndBottomBtn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: getBottomSpace() + ifIphoneX(0, 20),
    paddingTop: 20,
  },
  flex1EndBottomBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: getBottomSpace() + ifIphoneX(10, 25),
    paddingTop: 20,
  },
  fillParent: {
    width: '100%',
    height: '100%',
  },
  hitSlop: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
  hitSlop20: {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  },
  hitSlop30: {
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
  },
  centerWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  colCenter: {
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowCenterWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadow: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalFullScreen: {
    margin: 0,
  },
  absoluteFull: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  rowWrap: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  rowBettween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paddingRow: {
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  bR8: {
    borderRadius: 8,
  },
  //padding
  pH5: {
    paddingHorizontal: 5,
  },
  pH8: {
    paddingHorizontal: 8,
  },
  pH10: {
    paddingHorizontal: 10,
  },
  pH12: {
    paddingHorizontal: 12,
  },
  pH14: {
    paddingHorizontal: 14,
  },
  pH16: {
    paddingHorizontal: 16,
  },
  pH24: {
    paddingHorizontal: spacings.xl,
  },
  pH20: {
    paddingHorizontal: 20,
  },
  pV6: {
    paddingVertical: 6,
  },
  pV12: {
    paddingVertical: 12,
  },
  pV10: {
    paddingVertical: 10,
  },
  pV13: {
    paddingVertical: 13,
  },
  pFirstRow: {
    paddingBottom: 13,
    paddingTop: 5,
  },
  pV14: {
    paddingVertical: 14,
  },
  pV8: {
    paddingVertical: 8,
  },
  pV4: {
    paddingVertical: 4,
  },
  pV16: {
    paddingVertical: 16,
  },
  pV22: {
    paddingVertical: 22,
  },
  pR8: {
    paddingRight: 8,
  },
  pR10: {
    paddingRight: 10,
  },
  //margin
  mR5: {
    marginRight: 5,
  },
  mR8: {
    marginRight: 8,
  },
  mR16: {
    marginRight: 16,
  },
  mL1: {
    marginLeft: 1,
  },
  mL3: {
    marginLeft: 3,
  },
  mL5: {
    marginLeft: 5,
  },
  mL8: {
    marginLeft: 8,
  },
  mL10: {
    marginLeft: 10,
  },
  mL12: {
    marginLeft: 12,
  },
  mL15: {
    marginLeft: 15,
  },
  mL16: {
    marginLeft: 16,
  },
  mL20: {
    marginLeft: 20,
  },
  mT2: {
    marginTop: 2,
  },
  mT3: {
    marginTop: 3,
  },
  mT5: {
    marginTop: 5,
  },
  mT8: {
    marginTop: 8,
  },
  mT10: {
    marginTop: 10,
  },
  mT12: {
    marginTop: 12,
  },
  mT15: {
    marginTop: 15,
  },
  mT16: {
    marginTop: 16,
  },
  mT20: {
    marginTop: 20,
  },
  mT30: {
    marginTop: 30,
  },
  mH4: {
    marginHorizontal: 4,
  },
  mH8: {
    marginHorizontal: 8,
  },
  mH12: {
    marginHorizontal: 12,
  },
  mH16: {
    marginHorizontal: 16,
  },
  mV10: {
    marginVertical: 10,
  },
  mV12: {
    marginVertical: 12,
  },
  mV15: {
    marginVertical: 15,
  },
  mB6: {
    marginBottom: 6,
  },
  mB10: {
    marginBottom: 10,
  },
  mB24: {
    marginBottom: 24,
  },
  //box size
  box10: {
    width: 10,
    height: 10,
  },
  box14: {
    width: 14,
    height: 14,
  },
  box16: {
    width: 16,
    height: 16,
  },
  box18: {
    width: 18,
    height: 18,
  },
  box20: {
    width: 20,
    height: 20,
  },
  box22: {
    width: 22,
    height: 22,
  },
  box24: {
    width: 24,
    height: 24,
  },
  box26: {
    width: 26,
    height: 26,
  },
  box28: {
    width: 28,
    height: 28,
  },
  //view box
  box30: {
    height: 30,
    width: 30,
  },
  box34: {
    height: 34,
    width: 34,
  },
  box36: {
    height: 36,
    width: 36,
  },
  box40: {
    height: 40,
    width: 40,
  },
  box42: {
    height: 42,
    width: 42,
  },
  box48: {
    height: 48,
    width: 48,
  },
  box52: {
    height: 52,
    width: 52,
  },
  box60: {
    height: 60,
    width: 60,
  },
  box64: {
    height: 64,
    width: 64,
  },
  box88: {
    height: 88,
    width: 88,
  },
  round64: {
    height: 64,
    width: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  round48: {
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  round30: {
    height: 30,
    width: 30,
    borderRadius: 32,
    overflow: 'hidden',
  },
  round36: {
    height: 36,
    width: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  round40: {
    height: 40,
    width: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  round40R: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  //justify
  justifyBetween: {
    justifyContent: 'space-between',
  },
  //cheat
  padAll: {
    paddingLeft: 10,
    paddingRight: 5,
  },
  //modal
  containerModalTop: {
    marginTop: getStatusBarHeight() + ifIphoneX(20, 30),
    marginHorizontal: 0,
    marginBottom: 0,
  },
  subTitleText: {
    fontFamily: fonts.inter,
    fontSize: 18,
    padding: 5,
  },
  wrapModalTop: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTopHeader: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalTopSearchBar: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  modalTopBtn: {
    paddingHorizontal: 24,
  },
  pB12: {
    paddingBottom: 12,
  },
  pT8: {
    paddingTop: 8,
  },
});
