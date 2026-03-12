export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonHeights: Record<ButtonSize, number> = {
  sm: 40,
  md: 48,
  lg: 56,
};

export const buttonPaddingHorizontal: Record<ButtonSize, number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

export const buttonTextVariant: Record<ButtonSize, 'button'> = {
  sm: 'button',
  md: 'button',
  lg: 'button',
};