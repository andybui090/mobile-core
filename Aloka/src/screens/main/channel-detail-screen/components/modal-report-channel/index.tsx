import { CAreaContent, IconType, IconX } from '@/components';
import {
  getBottomSpace,
  ifIphoneX,
  images,
  keyExtractor,
  logError,
  screenStyles,
} from '@/configs';
import { postReport, resetGlobal } from '@/redux/slices/globalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CEmptyData, CText, DismissKeyboard, Row } from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { makeStyles, useTheme } from '@rneui/themed';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Keyboard, Pressable, TouchableOpacity, View } from 'react-native';

const useStyles = makeStyles(({colors}) => ({
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0,
  },
  itemReport: {
    paddingVertical: 14,
    borderBottomColor: colors.cEAECF0,
    borderBottomWidth: 1,
    flexDirection: 'row' as const,
  },
  wrapHeader: {
    borderBottomColor: colors.cEAECF0,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
}));

export const BottomSheetReportChannel = ({
  t,
  bottomSheetReportChannelRef,
  itemId,
}: any) => {
  const {
    theme: {colors},
  } = useTheme();
  const styles = useStyles();

  const snapPoints = useMemo(() => ['50%', '75%'], []);

  const dispatch = useAppDispatch();

  const {reportList, responseCreateReport} = useAppSelector(
    state => state.globalReducer,
  );

  const [itemReportChoose, setItemReportChoose] = useState<any>({id: -1});
  const [listReport, setListReport] = useState([]);
  const descriptionEl = useRef<any>(null);
  const [errDescription, setErrDescription] = useState('');
  const [txtReport, setTxtReport] = useState('');
  const [isSuccessReport, setIsSuccessReport] = useState<boolean>(false);

  useEffect(() => {
    const showKeyBoard = Keyboard.addListener('keyboardWillShow', () => {
      bottomSheetReportChannelRef.current?.expand();
    });
    const hideKeyBoard = Keyboard.addListener('keyboardWillHide', () => {
      bottomSheetReportChannelRef.current?.snapToIndex(1);
    });

    return () => {
      showKeyBoard.remove();
      hideKeyBoard.remove();
    };
  }, []);

  useEffect(() => {
    const processAPIListReport = () => {
      const {data, loading, error} = reportList;
      if (!loading) {
        if (data) {
          const dataParent: any = data;
          setListReport(dataParent?.items || []);
        } else if (error) {
          console.log(
            '🚀 ~ file: index.tsx:82 ~ processAPIListReport ~ error:',
            error,
          );
        }
      }
    };
    processAPIListReport();
  }, [reportList]);

  useEffect(() => {
    const processAPIReport = () => {
      const {loading, data, error} = responseCreateReport;
      if (!loading) {
        if (data) {
          // console.log('🚀 ~ file: index.tsx:72 ~ processAPIReportVideo ~ data:', data);
        } else if (error) {
          dispatch(resetGlobal(null));
          setErrDescription(logError(error, '', false));
          // console.log('🚀 ~ file: index.tsx:73 ~ processAPIReportVideo ~ error:', error);
        }
      }
    };
    processAPIReport();
  }, [responseCreateReport]);

  const onActionChange = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const handleSendReport = () => {
    const data = {
      doctor_id: itemId,
      report_type_id: itemReportChoose.id,
      content: txtReport,
      type: 'DOCTOR',
    };
    dispatch(postReport(data));
    setIsSuccessReport(true);
  };

  const handleDetailReport = (item: any) => {
    setItemReportChoose(item);
  };

  const handleChangeDescription = (value: string) => {
    setErrDescription('');
    setTxtReport(value);
  };

  const closeModal = () => {
    setTxtReport('');
    setIsSuccessReport(false);
    setItemReportChoose({id: -1});
    bottomSheetReportChannelRef.current.close();
  };

  //RENDER
  const renderDetailReport = () => {
    if (isSuccessReport) {
      return (
        <BottomSheetView style={screenStyles.flex1}>
          <Row center style={styles.wrapHeader}>
            <CText h4 w600 color={colors.c101828} style={screenStyles.pV4}>
              {t('common.report')}
            </CText>
          </Row>
          <View
            style={[
              screenStyles.pH10,
              screenStyles.flex1,
              screenStyles.centerWrap,
              screenStyles.pV22,
            ]}>
            <Image
              source={images.global.report_success}
              style={{width: 50, height: 50}}
              resizeMode="contain"
            />
            <CText h5 w400 color={colors.c101828} style={screenStyles.mT10}>
              {t('report.thankForReporting')}
            </CText>
            <CText
              h5
              w400
              center
              color={colors.c667085}
              style={screenStyles.mT10}>
              {t('report.willReviewTheReport')}
            </CText>
          </View>
          <CButton
            onPress={closeModal}
            title={t('common.close')}
            isBottom
            paddingVertical={14}
            btnWidth={'95%'}
          />
        </BottomSheetView>
      );
    }
    return (
      <BottomSheetView style={screenStyles.flex1}>
        <DismissKeyboard>
          <Row between style={styles.wrapHeader}>
            <TouchableOpacity
              hitSlop={screenStyles.hitSlop20}
              onPress={() => setItemReportChoose({id: -1})}>
              <IconX
                type={IconType.IONICONS}
                name={'chevron-back'}
                color={colors.c667085}
                size={26}
              />
            </TouchableOpacity>
            <CText h4 w600 color={colors.c101828} style={screenStyles.pV4}>
              {t('common.report')}
            </CText>
            <View style={{width: 26}} />
          </Row>
          <View
            style={[screenStyles.pH10, screenStyles.flex1, screenStyles.mT5]}>
            <CAreaContent
              refChild={descriptionEl}
              value={txtReport}
              onChange={handleChangeDescription}
              errorText={errDescription}
              label={itemReportChoose.name}
              labelStyle={{fontWeight: '600', fontSize: 14}}
              placeHolder={itemReportChoose.description}
            />
          </View>
          <CButton
            isDisable={txtReport.trim() == ''}
            onPress={handleSendReport}
            title={t('common.sendReport')}
            isBottom
            paddingVertical={14}
            btnWidth={'95%'}
          />
        </DismissKeyboard>
      </BottomSheetView>
    );
  };

  const renderItemReport = ({item, index}: any) => {
    return (
      <Pressable
        onPress={() => handleDetailReport(item)}
        style={styles.itemReport}>
        <CText h5 w400 color={colors.c101828}>
          {item?.name}
        </CText>
      </Pressable>
    );
  };

  const renderContent = () => {
    if (itemReportChoose.id == -1) {
      return (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingBottom: getBottomSpace() + ifIphoneX(-15, 0),
          }}>
          <Row style={styles.wrapHeader}>
            <CText h4 w600 color={colors.c101828} style={screenStyles.pV4}>
              {t('report.title.channel', 'Tại sao bạn báo cáo kênh này?')}
            </CText>
          </Row>
          <View style={screenStyles.flex1}>
            <BottomSheetFlatList
              contentContainerStyle={{
                paddingBottom: getBottomSpace() + ifIphoneX(5, 10),
              }}
              data={listReport}
              extraData={listReport}
              keyExtractor={keyExtractor}
              renderItem={renderItemReport}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              ListEmptyComponent={<CEmptyData isSmall />}
              scrollsToTop={false}
            />
          </View>
        </View>
      );
    }
    return renderDetailReport();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetReportChannelRef}
      index={1}
      snapPoints={snapPoints}
      onChange={onActionChange}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: colors.cD0D5DD,
      }}
      onDismiss={closeModal}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          onPress={() => {
            if (itemReportChoose.id == -1) {
              closeModal();
            } else {
              setItemReportChoose({id: -1});
            }
          }}
          appearsOnIndex={2}
        />
      )}>
      {renderContent()}
    </BottomSheetModal>
  );
};
