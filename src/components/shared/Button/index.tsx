import { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  label?: string;
  variant?: 'solid' | 'primary' | 'secondary' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  'aria-label'?: string;
  themeColor?: {
    background?: string;
    text?: string;
    border?: string;
  };
  fullWidth?: boolean;
}

export default function Button({
  label,
  variant = 'solid',
  size = 'medium',
  color,
  loading = false,
  iconLeft,
  iconRight,
  'aria-label': ariaLabel,
  themeColor,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build custom CSS variables for theme overrides
  const customStyle: CSSProperties & Record<string, string> = {};

  if (themeColor?.background) {
    customStyle['--button-bg'] = themeColor.background;
  }
  if (themeColor?.text) {
    customStyle['--button-text'] = themeColor.text;
  }
  if (themeColor?.border) {
    customStyle['--button-border'] = themeColor.border;
  }
  if (color && !themeColor) {
    customStyle['--button-color'] = color;
  }

  return (
    <button
      className={classNames}
      style={customStyle}
      disabled={disabled || loading}
      aria-label={ariaLabel || label}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <span className={styles.spinnerCircle} />
        </span>
      )}

      {iconLeft && (
        <span className={styles.iconLeft} aria-hidden="true">
          {iconLeft}
        </span>
      )}

      {label && <span className={styles.labelWrapper}>{label}</span>}

      {iconRight && (
        <span className={styles.iconRight} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}
