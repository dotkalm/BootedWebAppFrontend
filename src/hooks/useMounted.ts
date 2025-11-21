import { useEffect, useState } from 'react';

/**
 * Hook to track if component is mounted (client-side)
 * Useful for preventing hydration issues in Next.js
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
