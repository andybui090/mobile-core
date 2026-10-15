import {IconType, IconX} from '@/components';
import {images, isIOS, screenStyles} from '@/configs';
// import {
//   getVerifyVoucherCourses,
//   resetCourse2,
// } from '@/redux/slices/courceSlice';
import {useAppDispatch, useAppSelector} from '@/redux/store/customReduxHook';
import {CButton, CLoading, CText, Container, Row} from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {ScreenWidth} from '@rneui/base';
import {Input, makeStyles, useTheme} from '@rneui/themed';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// import ModalQrVoucher from './ModalQrVoucher';

const useStyles = makeStyles(({colors}) => ({
  inputWrapper: {
    paddingHorizontal: 0,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#54ADFF',
    height: 48,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 4,
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  txtError: {
    marginVertical: 5,
    color: '#F04438',
    marginLeft: 5,
  },
}));

type ModalVoucherProps = {
  package_id: string;
  isVisible: boolean;
  hideModal: () => void;
  backAction: () => void;
  verifySuccessVoucher: (data: any) => void;
};

const ModalVoucher = ({
  package_id,
  isVisible,
  hideModal,
  backAction,
  verifySuccessVoucher,
}: ModalVoucherProps) => {
  const {t} = useTranslation();
  const {
    theme: {colors},
  } = useTheme();
  const styles = useStyles();
  const toastEl = useRef<any>(null);

  const dispatch = useAppDispatch();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [snapPoints, setSnapPoints] = useState(['45%', '45%']);
  const voucherNameEl = useRef<any>(null);
  
  // const {valueVoucher, checkVoucher} = useAppSelector(
  //   state => state.courseReducer,
  // );

  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [codeVoucher, setCodeVoucher] = useState('');
  const [errVoucherName, setErrVoucherName] = useState<string>('');
  const [borderColor, setBorderColor] = useState(colors.cD0D5DD);
  const [showModalQR, setShowModalQR] = useState<boolean>(false);

  //
  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isVisible]);
  //
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setSnapPoints(['60%', '60%']);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setSnapPoints(['45%', '45%']);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // useEffect(() => {
  //   // TH back ra nhanh
  //   const checkVoucherCourseAPI = () => {
  //     const {loading, data, error}: any = checkVoucher;
  //     if (!loading) {
  //       if (data) {
  //         console.log('🚀 ~ voucherCourseAPI ~ data:', data);
  //         setIsLoadingAPI(false);
  //         backAction();
  //         verifySuccessVoucher(data?.result);
  //         //
  //         setErrVoucherName('');
  //         setCodeVoucher('');
  //         setTimeout(() => {
  //           dispatch(resetCourse2());
  //         }, 500);
  //       } else if (error) {
  //         console.log('🚀 ~ checkVoucherCourseAPI ~ error:', error);
  //         setErrVoucherName(error?.errors?.msg || '');
  //         setIsLoadingAPI(false);
  //         setTimeout(() => {
  //           dispatch(resetCourse2());
  //         }, 500);
  //       }
  //     }
  //   };
  //   checkVoucherCourseAPI();
  // }, [checkVoucher]);

  //action
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleBackPress = () => {
    backAction();
    setErrVoucherName('');
    setCodeVoucher('');
  };

  const _handleVoucherChange = (text: string) => {
    setCodeVoucher(text);
    if (errVoucherName) {
      setErrVoucherName('');
    }
  };

  const handleSubmit = () => {
    // dispatch(
    //   getVerifyVoucherCourses({
    //     package_id: package_id,
    //     code: codeVoucher || '',
    //   }),
    // );
  };

  const disibleModal = () => {
    hideModal();
    setErrVoucherName('');
    setCodeVoucher('');
  };
  const backModal = () => {
    backAction();
    setErrVoucherName('');
    setCodeVoucher('');
  };
  // render

  const renderTitle = () => {
    return (
      <Row
        between
        style={[
          screenStyles.bottomLine,
          {paddingBottom: 12, paddingHorizontal: 16},
        ]}>
        <Pressable onPress={backModal}>
          <IconX
            type={IconType.FONTISTO}
            name={'angle-left'}
            size={24}
            color={colors.c667085}
            style={{marginLeft: 3}}
          />
        </Pressable>
        <CText color={colors.c101828} h4 w600>
          {t('course.discountCode', 'Mã giảm giá')}
        </CText>
        <Pressable onPress={disibleModal}>
          <IconX
            type={IconType.ANT_DESIGN}
            name={'close'}
            size={24}
            color={colors.c667085}
            style={{marginLeft: 3}}
          />
        </Pressable>
      </Row>
    );
  };

  const renderContent = () => {
    if (isLoadingAPI) {
      return <CLoading />;
    } else {
      return (
        <Container>
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              paddingTop: 16,
              alignContent: 'flex-start',
            }}>
            <Input
              value={codeVoucher.toString() || ''}
              onChangeText={_handleVoucherChange}
              placeholder={t('course.inputvoucher')}
              placeholderTextColor="#9E9E9E"
              leftIcon={
                <Image
                  source={images.payment.ico_voucer}
                  style={{width: 24, height: 24, marginRight: 8}}
                  resizeMode="contain"
                />
              }
              rightIcon={
                <TouchableOpacity onPress={() => setShowModalQR(true)}>
                  <IconX
                    type={IconType.MATERIAL_DESIGN_ICONS}
                    name={'qrcode-scan'}
                    size={24}
                    color={colors.c19A2A7}
                    style={{marginLeft: 3}}
                  />
                </TouchableOpacity>
              }
              inputStyle={styles.inputText}
              containerStyle={styles.inputWrapper}
              // inputContainerStyle={[
              //   styles.inputContainer,
              //   {
              //     borderColor: errVoucherName ? colors.cFDA29B : borderColor,
              //     backgroundColor: colors.white,
              //     height: 48,
              //     marginBottom: 0,
              //     paddingBottom: 0,
              //   },
              // ]}
              selectionColor={colors.c19A2A7}
            />
            {errVoucherName && (
              <View
                style={{position: 'absolute', top: ScreenWidth / 6, left: 16}}>
                <CText h5 w400 style={styles.txtError}>
                  {errVoucherName}
                </CText>
              </View>
            )}
          </View>
          <CButton
            title={t('communityChat.invite.appect', 'Agree')}
            isBottom
            onPress={handleSubmit}
            backgroundColor={colors.c19A2A7}
          />
        </Container>
      );
    }
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        onDismiss={handleBackPress}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            onPress={handleBackPress}
            appearsOnIndex={1}
          />
        )}
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={isIOS ? 'padding' : undefined}
              style={screenStyles.flex1}>
              <Container>
                {renderTitle()}
                {renderContent()}
              </Container>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </BottomSheetView>
        {/* {showModalQR && (
          <ModalQrVoucher
            isVisible={showModalQR}
            hideModal={() => setShowModalQR(false)}
            qrCode={(code: any) => {
              if (errVoucherName.length != 0) {
                setErrVoucherName('');
              }
              setCodeVoucher(code);
            }}
          />
        )} */}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default ModalVoucher;
