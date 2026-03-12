export const colors = {
  light: {
    /* ========= TEXT ========= */
    textPrimary: '#101828',     // đen đậm
    textSecondary: '#475467',   // xám đậm
    textDisabled: '#98A2B3',    // xám nhạt
    textError: '#D92D20',       // đỏ đậm
    textWarning: '#F79009',     // cam
    textInverse: '#FFFFFF',    // trắng

    /* ========= BACKGROUND ========= */
    background: '#FFFFFF',     // nền trắng

    /* ========= BORDER ========= */
    border: '#D0D5DD',          // border xám

    /* ========= BUTTON ========= */
    buttonPrimary: '#006BD5',          // xanh brand
    buttonPrimaryDisabled: '#B2DDFF',  // xanh nhạt
    buttonSecondary: '#EFF8FF',        // nền sáng (secondary)
  },

  dark: {
    /* ========= TEXT ========= */
    textPrimary: '#F9FAFB',     // trắng ngà (đỡ gắt)
    textSecondary: '#D0D5DD',   // xám sáng
    textDisabled: '#667085',    // xám
    textError: '#F97066',       // đỏ sáng hơn
    textWarning: '#FDB022',    // vàng cam
    textInverse: '#101828',    // đen đậm

    /* ========= BACKGROUND ========= */
    background: '#0B0F19',      // nền tối (không phải đen tuyệt đối)

    /* ========= BORDER ========= */
    border: '#344054',          // border tối

    /* ========= BUTTON ========= */
    buttonPrimary: '#2E90FA',          // xanh sáng hơn cho dark
    buttonPrimaryDisabled: '#175CD3',  // xanh đậm
    buttonSecondary: '#1D2939',        // nền tối secondary
  },
};

export type ThemeMode = keyof typeof colors;      // 'light' | 'dark'
export type ThemeColors = typeof colors.light;

export type TextColor =
  | 'textPrimary'
  | 'textSecondary'
  | 'textDisabled'
  | 'textError'
  | 'textWarning'
  | 'textInverse';
