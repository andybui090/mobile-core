import { StyleSheet } from 'react-native';
import { getBottomSpace, ifIphoneX } from './helpers/Notch';

export const screenStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  centerWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexGrow1: {
    flexGrow: 1,
  },
  flex1EndBottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  flexGrowBottom: {
    flexGrow: 1,
    paddingBottom: getBottomSpace() + ifIphoneX(5, 10),
  },
  fillParent: {
    width: '100%',
    height: '100%',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  colCenter: {
    alignItems: 'center',
  },
  hitSlop20: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
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
  rowBettween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  //
  // MARGIN
  //
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
  mT20: { marginTop: 20 },
  mT30: {
    marginTop: 30,
  },
  mH5: {
    marginHorizontal: 5,
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
  //  PADDING
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
    paddingHorizontal: 24,
  },
  pH20: {
    paddingHorizontal: 20,
  },
  pV13: {
    paddingVertical: 13,
  },
  pFirstRow: {
    paddingBottom: 13,
    paddingTop: 5,
  },
  pR8: {
    paddingRight: 8,
  },
  pV12: {
    paddingVertical: 12,
  },
  pV14: {
    paddingVertical: 14,
  },
  pV16: {
    paddingVertical: 16,
  },
  pT8: {
    paddingTop: 8,
  },
  //
  // BOX
  //
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
});
