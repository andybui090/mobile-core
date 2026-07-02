import { images } from '@/config';
import { useState } from 'react';
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

const hasValidSource = (source: Source) => {
  if (typeof source === 'number') return true;
  return Boolean(source && 'uri' in source && source.uri);
};

export function ImageHelper({
  renderPlaceholder = null,
  renderErrorImage = null,
  onError,
  onLoad,
  imageStyle = { width: '100%', height: '100%' },
  resizeMode = 'cover',
  source,
  isLogo = false,
  sizeLogo = 0,
  ...otherProps
}: ImageHelperProps) {
  const [isLoading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [layout, setLayout] = useState({ width: 50, height: 50 });

  const renderPlaceholderNode = () => {
    if (typeof renderPlaceholder === 'function') {
      return renderPlaceholder();
    }

    return (
      <Blurhash
        blurhash="LGFFaXYk^6#M@-5c,1J5@[or[Q6."
        decodeAsync={false}
        style={styles.blurHash}
        resizeMode="cover"
      />
    );
  };

  const renderDefaultImage = () => {
    if (typeof renderErrorImage === 'function') {
      return renderErrorImage();
    }

    if (renderErrorImage) {
      return renderErrorImage;
    }

    if (isLogo) {
      return (
        <Image
          source={images.global.img_default}
          resizeMode="contain"
          style={{ width: sizeLogo, height: sizeLogo }}
        />
      );
    }

    const size = Math.min(layout.width, layout.height);
    return (
      <View style={styles.bgDefault}>
        <Image
          style={{
            width: Math.max(0, size - 20),
            height: Math.max(0, size - 20),
          }}
          source={images.global.img_default}
        />
      </View>
    );
  };

  const handleError = () => {
    setLoading(false);
    setIsError(true);
    onError?.();
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const isSourceValid = hasValidSource(source);

  return (
    <View
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
      }}
      style={[styles.container, imageStyle]}
    >
      {isSourceValid && (
        <CachedImage
          {...otherProps}
          source={source}
          resizeMode={resizeMode}
          style={styles.image}
          onError={handleError}
          onLoadEnd={handleLoadEnd}
          onLoad={onLoad}
          fallback={Platform.OS === 'android'}
        />
      )}

      {isSourceValid && isLoading && renderPlaceholderNode()}
      {(!isSourceValid || isError) && renderDefaultImage()}
    </View>
  );
}

ImageHelper.priority = CachedImage.priority;
ImageHelper.resizeMode = CachedImage.resizeMode.center;

const styles = StyleSheet.create({
  container: {
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
  blurHash: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
});
