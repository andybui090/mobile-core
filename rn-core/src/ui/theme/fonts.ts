import { fontRegistry } from './fontRegistry';

export const ACTIVE_FONT = 'inter';

export const fontFamilies = fontRegistry[ACTIVE_FONT];
export type FontWeight = keyof typeof fontFamilies;