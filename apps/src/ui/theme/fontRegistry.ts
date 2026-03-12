export const fontRegistry = {
  inter: {
    regular: 'Inter-Regular', // w400
    medium: 'Inter-Medium', // w500
    semibold: 'Inter-SemiBold', // w600
    bold: 'Inter-Bold', // w700
  },
} as const;

export type FontFamilyKey = keyof typeof fontRegistry;
export type FontWeightKey = keyof typeof fontRegistry.inter;