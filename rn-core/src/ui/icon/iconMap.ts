// ui/icon/iconMap.ts
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import type { IconType } from './iconTypes';

export const iconMap: Record<IconType, any> = {
  // Ant
  antdesign: AntDesign,

  // Ionicons
  ionicons: Ionicons,

  // Material
  material: MaterialIcons,
  'material-community': MaterialCommunityIcons,

  // FontAwesome
  fontawesome: FontAwesome,
  fontawesome5: FontAwesome5,
  fontawesome6: FontAwesome6,

  // Others
  feather: Feather,
  entypo: Entypo,
  evilicons: EvilIcons,
  octicons: Octicons,
  fontisto: Fontisto,
  foundation: Foundation,
  'simple-line-icons': SimpleLineIcons,
  zocial: Zocial,
};