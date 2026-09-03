import {parseQueryParameters} from '@/configs';
// import {mainRoute} from '@/constants/route_key';
import {Linking} from 'react-native';

enum typeConnect {
  home = 'home',
  near_me = 'near_me',
  newsfeed = 'newsfeed',
  store = 'store',
  community = 'community',
  course = 'course',
}

export const onLinkBanner = (item: any, navigation: any) => {
  // console.log('🚀 ~ onLinkBanner ~ item:', item);
  if (item?.type_connect) {
    switch (item.type_connect) {
      case 'doctor':
        // navigation.navigate(mainRoute.expertProfileScreen, {
        //   doctorId: item.connect_value,
        // });
        return;

      case typeConnect.home:
        navigation.navigate('HomeTab');
        return;

      case typeConnect.near_me:
        navigation.navigate('NearbyTab');
        return;

      case typeConnect.newsfeed:
        navigation.navigate('NewsfeedTab');
        return;

      case typeConnect.store:
      case typeConnect.course:
        if (item.connect_value) {
          // navigation.navigate(mainRoute.detailCourses, {
          //   courseId: item.connect_value,
          // });
        } else {
          navigation.navigate('CourseTab');
        }
        return;

      case typeConnect.community:
        navigation.navigate('CommunityTab');
        return;
    }
  }

  if (!item?.link) return;

  let uri = item.link;

  try {
    uri = decodeURIComponent(uri);
  } catch {}

  const params = parseQueryParameters(uri);

  const packageId = params.package_id;
  const channelId = params.channel_id;
  const type = params.type;

  if (packageId && channelId) {
    if (type === 'carely') {
      // navigation.navigate(mainRoute.carelyServiceDetailScreen, {
      //   channelId,
      //   packageId,
      // });
    } else {
      // navigation.navigate(mainRoute.packageDetailScreen, {
      //   channelId,
      //   packageId,
      // });
    }
    return;
  }
  Linking.openURL(item.link);
};

export const onPressItemPackage = (item: any, navigation: any) => {
  if (item && item.channel_id) {
    if (item.is_book_service == 1) {
      // navigation.navigate(mainRoute.carelyServiceDetailScreen, {
      //   channelId: item.channel_id,
      //   packageId: item.id,
      // });
    } else {
      // navigation.navigate(mainRoute.packageDetailScreen, {
      //   channelId: item.channel_id,
      //   packageId: item.id,
      // });
    }
  }
};
