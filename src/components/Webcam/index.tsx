'use client';

import { useEffect, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface WebcamCaptureProps {
  width?: number;
  height?: number;
}

export default function WebcamCapture({ 
  width = 640, 
  height = 480,
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize webcam stream
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsStreaming(true);
          };
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setError(err instanceof Error ? err.message : 'Failed to access webcam');
      }
    };

    startWebcam();

    // Cleanup
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [width, height]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      
      <Paper 
        elevation={3}
        sx={{ 
          position: 'relative', 
          width: width,
          height: height,
          overflow: 'hidden'
        }}
      >
        <video
          ref={videoRef}
          width={width}
          height={height}
          style={{ display: 'block' }}
          playsInline
          muted
        />
        
        {!isStreaming && !error && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.200',
              gap: 2
            }}
          >
            <CircularProgress />
            <Typography color="text.secondary">
              Initializing webcam...
            </Typography>
          </Box>
        )}
      </Paper>
      
      {isStreaming && (
        <Alert severity="success">Webcam active</Alert>
      )}
    </Box>
  );
}