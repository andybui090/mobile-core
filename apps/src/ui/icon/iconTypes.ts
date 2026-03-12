export const ICON_TYPE = {
  // Ant / Alibaba
  ANT_DESIGN: 'antdesign',

  // Ionicons
  IONICONS: 'ionicons',

  // Material
  MATERIAL: 'material',
  MATERIAL_COMMUNITY: 'material-community',

  // FontAwesome
  FONT_AWESOME: 'fontawesome',
  FONT_AWESOME5: 'fontawesome5',
  FONT_AWESOME6: 'fontawesome6',

  // Others
  FEATHER: 'feather',
  ENTYPO: 'entypo',
  EVIL_ICONS: 'evilicons',
  OCTICONS: 'octicons',
  FONTISTO: 'fontisto',
  FOUNDATION: 'foundation',
  SIMPLE_LINE: 'simple-line-icons',
  ZOCIAL: 'zocial',
} as const;

export type IconType = typeof ICON_TYPE[keyof typeof ICON_TYPE];