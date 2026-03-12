'use client';

import { ThemeProvider } from './ThemeProvider';
import { ReactNode } from 'react';

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
