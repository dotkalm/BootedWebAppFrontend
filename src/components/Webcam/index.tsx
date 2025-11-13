'use client';

import { useRef } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useWebcam } from '@/hooks/useWebcam';
import { useWebGLContext } from '@/hooks/useWebGLContext';
import { useVideoTexture } from '@/hooks/useVideoTexture';
import { useWebGLRenderer } from '@/hooks/useWebGLRenderer';
import vertexShaderSrc from '@/shaders/video.vert';
import fragmentShaderSrc from '@/shaders/video.frag';

interface WebcamCaptureProps {
  width?: number;
  height?: number;
}

export default function WebcamCapture({ 
  width = 640, 
  height = 480,
}: WebcamCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use custom webcam hook
  const { videoRef } = useWebcam({
    width,
    height,
    facingMode: 'environment',
  });


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={3}
        sx={{
          height: {
            xs: '100vh',
          },
          width: {
            xs: '100vw',
          },
          display: 'flex',
          alignContent: {
            xs: 'center',
            sm: 'flex-start'
          },
          alignItems: {
            xs: 'flex-start',
            sm: 'center',
          },
          justifyContent: {
            xs: 'center',
            sm: 'flex-start'
          },
          video: {
            marginLeft: {
              xs: '0em',
              sm: '5em',
            },
            marginTop: {
              xs: '2em',
              sm: '0em',
            },
            borderRadius: '2em',
            borderWidth: '.5em',
            borderColor: '#fff',
            borderStyle: 'solid', 
            height: {
              xs: '60%',
              sm: 'auto',
            },
            width: {
              xs: 'auto',
              sm: '60%',
            }
          }
        }}
      >
        {/* Hidden video - we'll render via WebGL instead */}
        <video
          ref={videoRef}
          height='auto'
          width='100%'
          playsInline
          muted
        />
      </Paper>
    </Box>
  );
}