import Share from 'react-native-share';
import { Share as RNShare } from 'react-native';

export interface ShareOptionsData {
  title?: string;
  message?: string;
  url?: string;
}

export const onShare = async ({ title, message, url }: ShareOptionsData = {}) => {
  const shareTitle = title || 'Aloka';
  const shareMessage = message || `${shareTitle} - Dịch vụ chăm sóc y tế và điều dưỡng tại nhà chuyên nghiệp`;
  const shareUrl = url || 'https://aloka.vn';

  const shareOptions = {
    title: shareTitle,
    message: `${shareMessage}\n${shareUrl}`,
    url: shareUrl,
  };

  try {
    if (Share && typeof Share.open === 'function') {
      await Share.open(shareOptions);
    } else {
      await RNShare.share({
        title: shareTitle,
        message: `${shareMessage}\n${shareUrl}`,
        url: shareUrl,
      });
    }
  } catch (error: any) {
    if (error && error.message && error.message !== 'User did not share') {
      console.log('Share dismissed or cancelled:', error);
    }
  }
};
