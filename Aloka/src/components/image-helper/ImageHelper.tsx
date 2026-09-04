import { images } from '@/configs';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import { Image, ImageStyle, Platform, StyleSheet, View } from 'react-native';
import { Blurhash } from 'react-native-blurhash';
import CachedImage, { ResizeMode } from 'react-native-fast-image';

type FastImageProps = ComponentProps<typeof CachedImage>;
type FastImageSource = FastImageProps['source'];

export interface ImageHelperProps {
  renderPlaceholder?: (() => ReactNode) | null;
  renderErrorImage?: ReactNode | (() => ReactNode);
  onError?: FastImageProps['onError'];
  onLoad?: FastImageProps['onLoad'];
  imageStyle?: ImageStyle | ImageStyle[];
  style?: ImageStyle | ImageStyle[];
  resizeMode?: ResizeMode | any;
  source: FastImageSource | any;
  isLogo?: boolean;
  sizeLogo?: number;
}

const PLACEHOLDER_BLURHASH = 'LGFFaXYk^6#M@-5c,1J5@[or[Q6.';

const hasRemoteSource = (
  source: FastImageSource,
): source is Exclude<FastImageSource, number> => {
  return typeof source === 'object' && source !== null && 'uri' in source && !!source.uri;
};

type FallbackImageProps = {
  renderErrorImage: ImageHelperProps['renderErrorImage'];
  isLogo?: boolean;
  sizeLogo: number;
  layout: { width: number; height: number };
};

const FallbackImage = ({
  renderErrorImage,
  isLogo,
  sizeLogo,
  layout,
}: FallbackImageProps) => {
  if (typeof renderErrorImage === 'function') {
    return renderErrorImage();
  }

  if (renderErrorImage != null) {
    return renderErrorImage;
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

  const size = Math.min(layout.width, layout.height);

  return (
    <View style={styles.bgDefault}>
      <Image
        source={images.global.img_default}
        style={{
          width: size - 20,
          height: size - 20,
        }}
      />
    </View>
  );
};

type RemoteImageProps = {
  source: Exclude<FastImageSource, number>;
  resizeMode: ResizeMode;
  onError?: FastImageProps['onError'];
  onLoad?: FastImageProps['onLoad'];
  isLoading: boolean;
  isError: boolean;
  renderLoading: () => ReactNode;
  renderDefaultImage: () => ReactNode;
  setLoading: (value: boolean) => void;
  setIsError: (value: boolean) => void;
  otherProps: Omit<
    FastImageProps,
    'source' | 'resizeMode' | 'style' | 'onError' | 'onLoad' | 'onLoadEnd'
  >;
};

const RemoteImage = ({
  source,
  resizeMode,
  onError,
  onLoad,
  isLoading,
  isError,
  renderLoading,
  renderDefaultImage,
  setLoading,
  setIsError,
  otherProps,
}: RemoteImageProps) => {
  return (
    <>
      <CachedImage
        {...otherProps}
        source={source}
        resizeMode={resizeMode}
        style={styles.image as any}
        fallback={Platform.OS === 'android'} // optimize android
        onError={() => {
          setLoading(false);
          setIsError(true);
          onError?.();
        }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onLoad={event => {
          onLoad?.(event);
        }}
      />
      {isLoading && renderLoading()}
      {isError && renderDefaultImage()}
    </>
  );
};

export const ImageHelper = ({
  renderPlaceholder = null,
  renderErrorImage = null,
  onError,
  onLoad,
  imageStyle,
  style,
  resizeMode = 'cover',
  source,
  isLogo,
  sizeLogo = 0,
  ...otherProps
}: ImageHelperProps) => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [layout, setLayout] = useState({ width: 50, height: 50 });

  const combinedStyle = [styles.cont, imageStyle, style];

  const renderLoading = () => {
    if (typeof renderPlaceholder === 'function') {
      return renderPlaceholder();
    }

    return (
      <Blurhash
        blurhash={PLACEHOLDER_BLURHASH}
        decodeAsync={false}
        style={styles.blurHashDe}
        resizeMode="cover"
      />
    );
  };

  const renderDefaultImage = () => {
    return (
      <FallbackImage
        renderErrorImage={renderErrorImage}
        isLogo={isLogo}
        sizeLogo={sizeLogo}
        layout={layout}
      />
    );
  };

  const handleLayout = (event: {
    nativeEvent: { layout: { width: number; height: number } };
  }) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const renderContent = () => {
    if (!source) {
      return renderDefaultImage();
    }

    if (typeof source === 'number') {
      return (
        <Image
          source={source}
          resizeMode={resizeMode as any}
          style={styles.image}
        />
      );
    }

    if (hasRemoteSource(source)) {
      return (
        <RemoteImage
          source={source}
          resizeMode={resizeMode}
          onError={onError}
          onLoad={onLoad}
          isLoading={isLoading}
          isError={isError}
          renderLoading={renderLoading}
          renderDefaultImage={renderDefaultImage}
          setLoading={setLoading}
          setIsError={setIsError}
          otherProps={otherProps}
        />
      );
    }

    return renderDefaultImage();
  };

  return (
    <View onLayout={handleLayout} style={combinedStyle}>
      {renderContent()}
    </View>
  );
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
