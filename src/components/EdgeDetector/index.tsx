'use client'
import {
  useRef,
  type FC,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useGetWebcam } from '@/hooks/useGetWebcam';
import { useWebGLCanvas } from '@/hooks/useWebGLCanvas';
import type { TCannyEdgeDetectorProps } from '@/types/webgl';

export const EdgeDetector = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useGetWebcam({
    facingMode: 'user',
    height: 480,
    videoRef,
    width: 640,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Box>
        <video
          ref={videoRef}
          width={640}
          height={480}
        />
      </Box>
    </Box>
  );
};