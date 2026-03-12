// Design Tokens
export const tokens = {
  colors: {
    primary: '#0066ff',
    secondary: '#7c3aed',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#1a1a1a',
    textSecondary: '#666666',
    border: '#e0e0e0',
    error: '#ef4444',
    success: '#10b981',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSizeSmall: '12px',
    fontSizeBase: '14px',
    fontSizeLarge: '16px',
    fontSizeXL: '20px',
    fontSizeXXL: '24px',
    fontWeightNormal: '400',
    fontWeightMedium: '500',
    fontWeightBold: '700',
    lineHeightTight: '1.2',
    lineHeightNormal: '1.5',
    lineHeightRelaxed: '1.75',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
} as const;

export type Tokens = typeof tokens;
