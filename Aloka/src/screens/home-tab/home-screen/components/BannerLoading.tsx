import { ScreenWidth } from '@/configs';
import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

export const BannerLoading = () => {
  return (
    <ContentLoader height={150} width={ScreenWidth} backgroundColor={'#E3E3E3'}
      foregroundColor={"#FFFFFF"}>
      <Rect x={50} y={15} rx="8" ry="8" width={ScreenWidth - 100} height={120} />
    </ContentLoader>
  );
};
