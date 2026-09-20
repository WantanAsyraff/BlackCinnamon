/**
 * Design tokens.
 *
 * This is the single source of truth for the visual language. Pages and
 * components consume these tokens; they do not invent their own values.
 * See PLANNING.md sections 38-39.
 */

export const colors = {
  background: '#0d0f12',
  surface: '#15181d',
  surfaceRaised: '#1d2229',
  text: '#f4f5f7',
  textMuted: '#a3a9b3',
  brand: '#e0a12a',
  brandHover: '#f0b13a',
  success: '#3fb950',
  warning: '#d29922',
  danger: '#f85149',
  border: '#2a3039',
  focus: '#6cb6ff',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '96px',
} as const;

export const radii = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  full: '9999px',
} as const;

export const fontFamilies = {
  body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  display: "'Courier New', ui-monospace, monospace",
} as const;

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.375rem',
  '2xl': '1.75rem',
  '3xl': '2.25rem',
  '4xl': '3rem',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1440px',
} as const;

export const motion = {
  fast: '120ms',
  normal: '200ms',
  slow: '320ms',
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const tokens = {
  colors,
  spacing,
  radii,
  fontFamilies,
  fontSizes,
  breakpoints,
  motion,
} as const;

export type Tokens = typeof tokens;
