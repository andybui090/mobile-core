import { images } from '@/configs';
import { useMemo, useState } from 'react';
import { Image, ImageStyle, Platform, StyleSheet, View } from 'react-native';
import { Blurhash } from 'react-native-blurhash';
import CachedImage, { ResizeMode, Source } from 'react-native-fast-image';

interface ImageHelperProps {
  renderPlaceholder?: (() => React.ReactNode) | null;
  renderErrorImage?: React.ReactNode | (() => React.ReactNode);
  onError?: () => void;
  onLoad?: (e?: any) => void;
  imageStyle?: ImageStyle | ImageStyle[];
  resizeMode?: ResizeMode;
  source: Source;
  isLogo?: boolean;
  sizeLogo?: number;
}

const ImageHelper = ({
  renderPlaceholder = null,
  renderErrorImage = null,
  onError,
  onLoad,
  imageStyle = { width: '100%', height: '100%' },
  resizeMode = 'cover',
  source,
  isLogo,
  sizeLogo = 0,
  ...otherProps
}: ImageHelperProps) => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [layout, setLayout] = useState({ width: 50, height: 50 });

  const renderLoading = () => {
    if (typeof renderPlaceholder === 'function') {
      return renderPlaceholder();
    }
    return (
      <Blurhash
        blurhash={'LGFFaXYk^6#M@-5c,1J5@[or[Q6.'}
        decodeAsync={false}
        style={styles.blurHashDe}
        resizeMode="cover"
      />
    );
  };

  const _renderImageDefault = () => {
    if (typeof renderErrorImage === 'function') {
      return renderErrorImage();
    }
    if (isLogo) {
      return (
        <Image
          source={images.global.logo_app}
          resizeMode="contain"
          style={{
            width: sizeLogo,
            height: sizeLogo,
          }}
        />
      );
    }
    let size = layout.width >= layout.height ? layout.height : layout.width;
    return (
      <View style={styles.bgDefault}>
        <Image
          style={{
            height: size - 20,
            width: size - 20,
          }}
          source={images.global.img_default}
        />
      </View>
    );
  };

  const CachedImageMemoized = useMemo(() => {
    return (
      <CachedImage
        {...otherProps}
        source={source}
        resizeMode={resizeMode}
        style={styles.image}
        onError={() => {
          setLoading(false);
          setIsError(true);
          onError && onError();
        }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onLoad={e => {
          onLoad && onLoad(e);
        }}
        fallback={Platform.OS === 'android'} //optimize android
      />
    );
  }, [onError, onLoad, otherProps]);

  if (source.uri) {
    //kiem tra anh chua ky tu dac biet
    return (
      <View
        onLayout={event => {
          var { width, height } = event.nativeEvent.layout;
          setLayout({ width, height });
        }}
        style={[styles.cont, imageStyle]}
      >
        {CachedImageMemoized}
        {isLoading && renderLoading()}
        {isError && _renderImageDefault()}
      </View>
    );
  } else {
    return (
      <View
        onLayout={event => {
          var { width, height } = event.nativeEvent.layout;
          setLayout({ width, height });
        }}
        style={[styles.cont, imageStyle]}
      >
        {_renderImageDefault()}
      </View>
    );
  }
};

ImageHelper.priority = CachedImage.priority;
ImageHelper.resizeMode = CachedImage.resizeMode.center;

const styles = StyleSheet.create({
  cont: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  bgDefault: {
    backgroundColor: '#F4F4F4',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurHashDe: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
});

export default ImageHelper;
