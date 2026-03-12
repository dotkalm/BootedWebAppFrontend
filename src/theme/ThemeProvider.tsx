'use client';

import { useEffect, ReactNode } from 'react';
import { tokens, Tokens } from './tokens';

// Convert design tokens to CSS variables
function tokensToCSSVariables(tokens: Tokens): Record<string, string> {
  const cssVars: Record<string, string> = {};

  Object.entries(tokens).forEach(([category, values]) => {
    // Convert category to kebab-case: borderRadius -> border-radius
    const kebabCategory = category.replace(/([A-Z])/g, '-$1').toLowerCase();

    Object.entries(values).forEach(([key, value]) => {
      // Convert camelCase to kebab-case: fontSizeSmall -> font-size-small
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      cssVars[`--${kebabCategory}-${kebabKey}`] = value;
    });
  });

  return cssVars;
}

// Apply CSS variables to document root
function applyTokens(tokens: Tokens) {
  const cssVars = tokensToCSSVariables(tokens);

  Object.entries(cssVars).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyTokens(tokens);
  }, []);

  return <>{children}</>;
}
