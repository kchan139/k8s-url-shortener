export const ButtonVariant = {
  TEXT: 'text',
  OUTLINED: 'outlined',
  CONTAINED: 'contained',
} as const;

export const ButtonWidth = {
  FIT: 'fit',
  FULL: 'full',
} as const;

export const ButtonTheme = {
  PRIMARY: 'primary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  SECONDARY: 'secondary',
  NEUTRAL: 'neutral',
} as const;

export const ButtonSize = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const;

export const ButtonShape = {
  PILL: 'pill',
  ROUNDED_SQUARE: 'rounded-square',
} as const;

export type ButtonIcon = {
  filename: string;
  alt: string;
};

export type ButtonVariantType =
  (typeof ButtonVariant)[keyof typeof ButtonVariant];

export type ButtonWidthType = (typeof ButtonWidth)[keyof typeof ButtonWidth];

export type ButtonThemeType = (typeof ButtonTheme)[keyof typeof ButtonTheme];

export type ButtonSizeType = (typeof ButtonSize)[keyof typeof ButtonSize];

export type ButtonShapeType = (typeof ButtonShape)[keyof typeof ButtonShape];
