'use client';
import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

import Controls from '@/components/Controls';
import Viewer from '@/components/Viewer';
import {
  useFrameCapture,
  useOrientation,
  useWebcam,
} from '@/hooks';
import {
  type CarDetection,
  type WebcamCaptureProps,
} from '@/types';
import { styles } from '@/styles';
import { applyZoomToCamera } from '@/utils';

export default function WebcamCapture({
  width = 640,
  height = 480,
}: WebcamCaptureProps) {
  const [detections, setDetections] = useState<CarDetection[]>([]);
  const [maxZoom, setMaxZoom] = useState(3);
  const [totalCars, setTotalCars] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const isApplyingZoomRef = useRef(false);

  const { orientation, isLandscape } = useOrientation();
  const { videoRef } = useWebcam({ advanced: [{ zoom: zoomLevel }], facingMode: 'environment', height, width });
  const { 
    captureFrame, 
    isUploading, 
    error: captureError,
  } = useFrameCapture({ 
    height, 
    videoRef, 
    width,
  });

  useEffect(() => {
    if (captureError) {
      setShowLoader(false);
    }
  }, [captureError]);



  const handleSliderChange = (_: Event, value: unknown) => {
    setZoomLevel(value as number);
  };

  const handleSliderChangeCommitted = (_: Event | React.SyntheticEvent, value: unknown) => {
    applyZoomToCamera({ isApplyingZoomRef, newZoom: value as number, setMaxZoom, videoRef });
  };

  const handleClick = async () => {
    setShowLoader(true);
    if (videoRef.current) {
      try {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          tempCanvas.width = videoRef.current.videoWidth || width;
          tempCanvas.height = videoRef.current.videoHeight || height;
          ctx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
          const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.9);
          setCapturedFrame(dataUrl);
          setShowViewer(true);
          setShowLoader(false);
        }
      } catch (err) {
        console.error('Local capture failed', err);
      }
    }else{
      setShowLoader(false);
    }

    const response = await captureFrame();
    if (response) {
      setTotalCars(response.total_cars);
      setDetections(response.detections);
    }
  }

  const handleBack = () => {
    console.log('handleBack called - resetting state');
    setCapturedFrame(null);
    setDetections([]);
    setShowViewer(false);
    setTotalCars(0);
  };

  return (
    <Box sx={styles.webcamContainer}>
      <Paper elevation={3} sx={styles.webcam}>
        <Box sx={styles.container}>
          <Box sx={{
            width: '100%',
            height: 'calc(100vh - 350px)',
            borderRadius: 1,
            border: '4px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>

            {(capturedFrame && showLoader && showViewer) && (
              <CircularProgress
                sx={{
                  width: '8rem !important',
                  height: '8rem !important',
                }}
              />
            )}
            
            {!(capturedFrame && showViewer) && (
              <Box
                component="video"
                ref={videoRef}
                playsInline
                muted
                autoPlay
                sx={styles.video}
              />
            )}
            
            {(capturedFrame && showViewer) && (
              <Viewer
                src={capturedFrame}
                detections={detections}
              />
            )}
          </Box>
        </Box>
        {!(capturedFrame && showViewer) ? (
          <Controls
            detections={detections}
            handleClick={handleClick}
            handleSliderChange={handleSliderChange}
            handleSliderChangeCommitted={handleSliderChangeCommitted}
            isLandscape={isLandscape}
            isUploading={isUploading}
            maxZoom={maxZoom}
            orientation={orientation}
            totalCars={totalCars}
            zoomLevel={zoomLevel}
            captureError={captureError}
          />
        ) : (
          <Box sx={styles.zoomInfoContainer}>
            <Box sx={styles.shutterContainer} />
            <Box sx={styles.shutterContainer}>
              <Box
                sx={{
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#1976d2',
                  borderColor: '#0d47a1',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
                onClick={handleBack}
              >
                ←
              </Box>
            </Box>
            <Box sx={styles.shutterContainer} />
          </Box>
        )}
      </Paper>
    </Box>
  );
}