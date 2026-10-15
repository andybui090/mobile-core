import { IconType, IconX, ImageHelper } from '@/components';
import { ScreenWidth } from '@/configs';
import { spacings } from '@/theme';
import { CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

type Props = {
  specialists?: any;
  onShowSpecName: any;
};

const Specialists = ({ specialists = [], onShowSpecName }: Props) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  //RENDER
  const renderErrorImage = () => {
    return (
      <IconX
        type={IconType.IONICONS}
        name={'medkit-outline'}
        size={24}
        color={colors.c667085}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <CText color={colors.c101828} h5 w600>
        {t('doctorProfile.specialist')}
      </CText>
      <View style={styles.specialistStyle}>
        {specialists.map((item: any, index: any) => {
          const { icon, name } = item || {};
          return (
            <Pressable
              key={index}
              style={{
                marginRight: 16,
                marginTop: 12,
              }}
              onPress={() => onShowSpecName(name)}
            >
              <View style={styles.bgExpert}>
                <View style={styles.avatar}>
                  <ImageHelper
                    source={{
                      uri: icon || '',
                    }}
                    resizeMode={'contain'}
                    renderErrorImage={renderErrorImage}
                  />
                </View>
                <CText h56 numberOfLines={1} w400 color={colors.black}>
                  {name || ''}
                </CText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    paddingLeft: spacings.md,
    paddingBottom: 12,
  },
  line: {
    backgroundColor: colors.cF9FAFB,
    height: 8,
    marginVertical: 12,
  },
  bgExpert: {
    width: ScreenWidth / 2 - 24,
    overflow: 'hidden' as const,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cEAECF0,
    padding: spacings.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    overflow: 'hidden' as const,
    borderRadius: 4,
    marginBottom: 10,
  },
  specialistStyle: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
}));

export default Specialists;
