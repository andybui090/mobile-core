import { CHeader, IconX, ImageHelper, Wrapper } from '@/components';
import { ScreenWidth, screenStyles } from '@/configs';
import useI18n from '@/hooks/useI18n';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
// import { ModalPhoneCode } from './components';

// =====================
// STYLES
// =====================
const useStyles = makeStyles(({ colors }) => ({
  countryWrap: {
    backgroundColor: colors.cF9FAFB,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    ...screenStyles.rowCenter,
  },
    countryEnsign: {
      ...screenStyles.box20,
      ...screenStyles.centerWrap,
    },
  formWrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },
  viewWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  lineOr: {
    height: 1,
    backgroundColor: colors.cEAECF0,
    flex: 1,
  },
  btnStyle: {
    backgroundColor: colors.white,
    borderColor: colors.cD0D5DD,
    borderWidth: 1,
  },
  rightWrapper: {
    right: 16,
    position: 'absolute',
    ...screenStyles.rowCenter,
  },
  logo: {
    width: ScreenWidth / 2.3,
    height: (ScreenWidth / 2.3 / 640) * 216,
  },
}));

// =====================
// TYPES
// =====================
interface SignInProps {
  onNext: () => void;
  closeModal: () => void;
  dataLogin: any;
  updateLoginData: (name: string, value: string) => void;
  onNextSocial: (result: any, socialType: string) => void;
}

// =====================
// MAIN COMPONENT
// =====================
export const Signin: React.FC<SignInProps> = ({
  onNext,
  closeModal,
  dataLogin,
  updateLoginData,
  onNextSocial,
}) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();
  const { lang, setLang } = useI18n();

  const dispatch = useAppDispatch();

  const [language, setLanguage] = useState({
    flag: 'https://flagsapi.com/GB/flat/64.png',
    id: 31,
    lang: 'en',
    locale: 'English',
  });

  // ======================================================
  // RENDER
  // ======================================================

  const renderRightHead = () => (
    <View style={styles.rightWrapper}>
      <Pressable
        style={[styles.countryWrap, screenStyles.colCenter]}
        // onPress={handleChangeLanguage}
      >
        <View style={styles.countryEnsign}>
          <ImageHelper source={{ uri: language.flag }} resizeMode="contain" />
        </View>

        <CText h6 style={screenStyles.mH8} w500 color={colors.c1D2939}>
          {language.lang.toUpperCase()}
        </CText>

        <IconX
          type='fontisto'
          name="arrow-down"
          size={12}
          color={colors.c98A2B3}
        />
      </Pressable>
    </View>
  );

  return (
    <Wrapper safeBottom>
      <CHeader rightComponent={renderRightHead()} leftComponentDisable />

      {/* <CScrollView>
        {firebaseConfig.isRequireLoginSocial && !isReview ? (
          <View style={styles.formWrapper}>
            <Row
              style={{
                height: (ScreenWidth / 2.3 / 640) * 216 + 64,
              }}>
              <Image source={images.global.app_title} style={styles.logo} />
            </Row>

            {renderForm()}
          </View>
        ) : (
          <View style={styles.formWrapper}>{renderFormNoSocial()}</View>
        )}
      </CScrollView>

      {isGenRecapcha && <ReCaptcha onVerify={actionWithToken} />}

      {showModalPhoneCode && (
        <ModalPhoneCode
          isVisible={showModalPhoneCode}
          hideModal={() => setShowModalPhoneCode(false)}
          choosePhoneCode={handleUpdatePhoneCode}
          phoneCodeChoose={dataLogin.phoneCode}
        />
      )}

      {showModalLanguage && (
        <ModalLanguage
          isVisible={showModalLanguage}
          hideModal={() => setShowModalLanguage(false)}
          chooseLanguage={handleChooseLanguage}
          languageChoose={language}
        />
      )}

      <Loader visible={loading || isGenRecapcha} /> */}
    </Wrapper>
  );
};
