import {
  CAreaContent,
  CHeader,
  IconType,
  IconX,
  ModalAgreeForm,
  Wrapper,
} from '@/components';
import { screenStyles } from '@/configs';
import { goBack } from '@/navigation/RootNavigation';
import { postFeedbackData, resetGlobal } from '@/redux/slices/globalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, Container, CScrollView, CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Linking,
  ListRenderItemInfo,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

type FeedbackImage = {
  path: string;
  mime?: string;
  data?: string | null;
};

const supportContacts = [
  {
    type: IconType.ENTYPO,
    icon: 'phone',
    label: '(024) 710 428 68',
    url: 'tel:(024)71042868',
  },
  {
    type: IconType.ANT_DESIGN,
    icon: 'mail',
    label: 'support@doctornetwork.us',
    url: 'mailto:support@doctornetwork.us',
  },
];

const getImageUri = ({ data, mime, path }: FeedbackImage) =>
  data && mime ? `data:${mime};base64,${data}` : path;

const useStyles = makeStyles(({ colors }) => ({
  rightWrapper: {
    position: 'absolute' as const,
    right: 16,
    ...screenStyles.rowCenter,
  },
  btn: {
    backgroundColor: colors.white,
    color: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  imageStyle: {
    width: '100%' as const,
    height: '100%' as const,
    borderRadius: 11,
  },
  imageContainerStyle: {
    width: 88,
    height: 88,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey4,
    backgroundColor: colors.white,
  },
  imageListContent: {
    marginTop: 16,
    paddingBottom: 16,
  },
  supportText: {
    marginLeft: 8,
  },
  removeImageButtonStyle: {
    position: 'absolute' as const,
    right: 4,
    top: 4,
    backgroundColor: colors.white,
    height: 24,
    width: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey4,
  },
  supportContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  },

  supportRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 14,
    marginLeft: 12,
  },
}));

const MySupportScreen: React.FC = () => {
  const { t } = useTranslation();

  const {
    theme: { colors },
  } = useTheme();

  const styles = useStyles();
  const dispatch = useAppDispatch();

  const { loading, data, error } = useAppSelector(
    state => state.globalReducer.feedbackData,
  );

  const [problemText, setProblemText] = useState('');
  const [images, setImages] = useState<FeedbackImage[]>([]);
  const isSubmitDisabled = problemText.length === 0 || loading;

  const [showAgreePopup, setShowAgreePopup] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (data) {
      setShowAgreePopup(true);
    }

    if (error) {
      console.log('Feedback submission failed:', error);
    }
    if (data || error) dispatch(resetGlobal(null));
  }, [data, dispatch, error, loading]);

  const onSubmit = () => {
    if (isSubmitDisabled) return;

    dispatch(
      postFeedbackData({
        content: problemText,
        type: 'PROBLEM',
        report_images: images
          .map(img => img.data)
          .filter((imageData): imageData is string => Boolean(imageData)),
      }),
    );
  };

  const handleImageUpload = () =>
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      includeBase64: true,
      compressImageQuality: 0.8,
    })
      .then(selectedImages => {
        setImages(currentImages => [...currentImages, ...selectedImages]);
      })
      .catch(error => console.log(error));

  const handleImageDelete = (index: number) =>
    setImages(currentImages => currentImages.filter((_, i) => i !== index));

  const renderImage = ({ item, index }: ListRenderItemInfo<FeedbackImage>) => (
    <View style={styles.imageContainerStyle}>
      <Image
        source={{ uri: getImageUri(item) }}
        style={styles.imageStyle}
        resizeMode="cover"
      />
      <TouchableOpacity
        onPress={() => handleImageDelete(index)}
        style={styles.removeImageButtonStyle}
        activeOpacity={0.7}
      >
        <IconX name="close" size={16} color={colors.c667085} />
      </TouchableOpacity>
    </View>
  );

  const renderRightHead = () => (
    <Pressable
      disabled={isSubmitDisabled}
      onPress={onSubmit}
      style={styles.rightWrapper}
    >
      <CText h4 w600 color={isSubmitDisabled ? colors.grey4 : colors.primary}>
        {t('common.send')}
      </CText>
    </Pressable>
  );

  const renderContent = () => {
    return (
      <Container>
        <CScrollView contentContainerStyle={screenStyles.flexEndBottomBtn}>
          <View style={[screenStyles.pH16]}>
            <View style={screenStyles.flex1}>
              <CAreaContent
                value={problemText}
                onChange={setProblemText}
                label={t('onboarding.support')}
                placeHolder={t('settings.reportPlaceholder')}
              />
              <FlatList
                data={images}
                renderItem={renderImage}
                keyExtractor={(item, index) =>
                  item.path || item.data || index.toString()
                }
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageListContent}
                scrollsToTop={false}
              />
            </View>

            <CButton
              title={t('settings.uploadPhoto')}
              titleColor={colors.primary}
              buttonStyle={styles.btn}
              btnWidth={'100%'}
              icon={
                <IconX
                  type={IconType.ENTYPO}
                  name="image"
                  size={16}
                  color={colors.primary}
                  style={screenStyles.mR10}
                />
              }
              onPress={handleImageUpload}
            />
            <View style={styles.supportContainer}>
              <CText h56 w500 color={colors.c667085}>
                {t('settings.needMoreSupport', 'Cần hỗ trợ thêm?')}
              </CText>
              {supportContacts.map(({ type, icon, label, url }) => (
                <TouchableOpacity
                  key={url}
                  activeOpacity={0.8}
                  style={styles.supportRow}
                  onPress={() => Linking.openURL(url)}
                >
                  <IconX
                    type={type}
                    name={icon}
                    size={16}
                    color={colors.primary}
                  />
                  <CText
                    h56
                    w500
                    color={colors.primary}
                    style={styles.supportText}
                  >
                    {label}
                  </CText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </CScrollView>
      </Container>
    );
  };

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={goBack}
        title={t('settings.reportAProblem', 'Trợ giúp & hỗ trợ')}
        rightComponent={renderRightHead()}
        isBorderBottom
      />
      {renderContent()}
      <ModalAgreeForm
        visible={showAgreePopup}
        msg={t('settings.feedback.submitted')}
        title=""
        onClose={() => {
          setShowAgreePopup(false);
          goBack();
        }}
      />
    </Wrapper>
  );
};
export default MySupportScreen;
