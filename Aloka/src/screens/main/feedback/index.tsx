import {
  CHeader,
  ICON_TYPE,
  IconX,
  Toast,
  Wrapper,
} from '@/components';
import { images, keyExtractor, screenStyles } from '@/configs';
import { spacings } from '@/theme';
import { CButton, CText } from '@/utils';
import { useTheme } from '@rneui/themed';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import useStyles from './styles';

const FeedbackScreen: React.FC<any> = ({ navigation }: any) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const styles = useStyles();
  const toastEl = useRef<any>(null);

  const [problemText, setProblemText] = useState<string>('');
  const [imagesList, setImagesList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = () => {
    if (!problemText.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        t('settings.feedback.submitted', 'Báo cáo của bạn đã được gửi'),
        t(
          'common.thankYouFeedback',
          'Cảm ơn bạn đã gửi phản hồi. Chúng tôi sẽ xử lý sớm nhất có thể.',
        ),
        [
          {
            text: 'OK',
            onPress: () => {
              if (navigation?.canGoBack?.()) {
                navigation.goBack();
              }
            },
          },
        ],
      );
    }, 600);
  };

  const handleImageUpload = async () => {
    try {
      const selectedImages: any = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        includeBase64: true,
        compressImageQuality: 0.8,
      });
      if (Array.isArray(selectedImages)) {
        setImagesList([...imagesList, ...selectedImages]);
      } else if (selectedImages) {
        setImagesList([...imagesList, selectedImages]);
      }
    } catch (error) {
      console.log('ImagePicker error:', error);
    }
  };

  const handleImageDelete = (index: number) => {
    const newImages = [...imagesList];
    newImages.splice(index, 1);
    setImagesList(newImages);
  };

  const renderListImage = () => {
    if (imagesList.length === 0) return null;
    return (
      <View style={{ marginBottom: spacings.md }}>
        <FlatList
          data={imagesList}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.imageContainerStyle}>
              <Image
                source={{
                  uri: item.path || `data:${item.mime};base64,${item.data}`,
                }}
                style={styles.imageStyle}
              />
              <TouchableOpacity
                onPress={() => handleImageDelete(index)}
                style={styles.removeImageButtonStyle}
              >
                <IconX name="close" size={16} color={colors.c667085} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={keyExtractor}
          horizontal={true}
          contentContainerStyle={{ marginTop: 16 }}
          scrollsToTop={false}
        />
      </View>
    );
  };

  const renderRightHead = () => (
    <TouchableOpacity
      disabled={problemText.trim().length === 0 || isSubmitting}
      onPress={onSubmit}
      style={styles.rightWrapper}
    >
      <CText
        h5
        w600
        color={
          problemText.trim().length === 0 ? colors.grey4 : colors.primary
        }
      >
        {t('common.send', 'Gửi')}
      </CText>
    </TouchableOpacity>
  );

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={() => {
          if (navigation?.canGoBack?.()) {
            navigation.goBack();
          }
        }}
        title={t('settings.reportAProblem', 'Trợ giúp & hỗ trợ')}
        rightComponent={renderRightHead()}
        isBorderBottom
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          contentContainerStyle={screenStyles.flexGrowBottom}
          keyboardShouldPersistTaps={'always'}
        >
          <View style={styles.textInputContainerStyle}>
            <TextInput
              style={styles.textInput}
              placeholder={t(
                'settings.reportPlaceholder',
                'Giải thích ngắn gọn những gì đã xảy ra hoặc những trục trặc',
              )}
              placeholderTextColor={colors.grey3 || '#98A2B3'}
              value={problemText}
              onChangeText={setProblemText}
              multiline={true}
              numberOfLines={5}
              autoFocus
              allowFontScaling={false}
            />
          </View>
          {renderListImage()}
          <CButton
            title={t('settings.uploadPhoto', 'Tải Ảnh lên')}
            titleColor={colors.primary}
            buttonStyle={styles.btn}
            btnWidth={'100%'}
            icon={
              <Image
                style={{
                  height: 16,
                  width: 16,
                  marginRight: spacings.xs,
                  tintColor: colors.primary,
                }}
                resizeMode="contain"
                source={images.setting.ico_img}
              />
            }
            onPress={handleImageUpload}
          />
          <View style={styles.supportContainer}>
            <CText h5 w500 color={colors.c667085}>
              {t('settings.needMoreSupport', 'Cần hỗ trợ thêm?')}
            </CText>
            {/* PHONE */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.supportRow}
              onPress={() => Linking.openURL('tel:(024)71042868')}
            >
              <IconX
                type={ICON_TYPE.IONICONS}
                name="call-outline"
                size={16}
                color={colors.primary}
              />
              <CText h5 w500 color={colors.primary} style={{ marginLeft: 8 }}>
                {'(024) 710 428 68'}
              </CText>
            </TouchableOpacity>

            {/* EMAIL */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.supportRow}
              onPress={() =>
                Linking.openURL('mailto:support@doctornetwork.us')
              }
            >
              <IconX
                type={ICON_TYPE.IONICONS}
                name="mail-outline"
                size={16}
                color={colors.primary}
              />
              <CText h5 w500 color={colors.primary} style={{ marginLeft: 8 }}>
                {'support@doctornetwork.us'}
              </CText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

export default FeedbackScreen;
