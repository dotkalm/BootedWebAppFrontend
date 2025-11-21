import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { Orientation } from '@/types';

/**
 * Hook to track device orientation (portrait/landscape)
 */
export function useOrientation(): { orientation: Orientation; isLandscape: boolean } {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [orientation, setOrientation] = useState<Orientation>(Orientation.PORTRAIT);

  useEffect(() => {
    const newOrientation = isLandscape ? Orientation.LANDSCAPE : Orientation.PORTRAIT;
    setOrientation(newOrientation);
  }, [isLandscape]);

  return { orientation, isLandscape };
}
