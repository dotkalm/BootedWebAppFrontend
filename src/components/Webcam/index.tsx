'use client';
import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Controls from '@/components/Controls';
import Viewer from '@/components/Viewer';
import {
  useFrameCapture,
  useMounted,
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

  const isApplyingZoomRef = useRef(false);

  const mounted = useMounted();
  const { orientation, isLandscape } = useOrientation();
  const { videoRef } = useWebcam({ advanced: [{ zoom: zoomLevel }], facingMode: 'environment', height, width });
  const { captureFrame, isUploading, error: captureError } = useFrameCapture({ height, videoRef, width });


  const handleSliderChange = (_: Event, value: unknown) => {
    setZoomLevel(value as number);
  };

  const handleSliderChangeCommitted = (_: Event | React.SyntheticEvent, value: unknown) => {
    applyZoomToCamera({ isApplyingZoomRef, newZoom: value as number, setMaxZoom, videoRef });
  };

  const handleClick = async () => {
    // Capture a data URL locally so we can display immediately in Viewer
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
        }
      } catch (err) {
        console.error('Local capture failed', err);
      }
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

  console.log('WebcamCapture render state:', { capturedFrame: !!capturedFrame, showViewer });

  if(capturedFrame && showViewer) {
    return (
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Viewer
          src={capturedFrame}
          detections={detections}
          mode="3d"
          objPath="/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj"
          mtlPath="/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl"
          selectedWheel="primary"
          setShowViewer={setShowViewer}
          onBack={handleBack}
        />
      </Box>
    );
  }

  return (
    <Box sx={styles.webcamContainer}>
      <Paper elevation={3} sx={styles.webcam}>
        <Box sx={styles.container}>
          <Box
            component="video"
            ref={videoRef}
            playsInline
            muted
            autoPlay
            sx={styles.video}
          />
        </Box>
        <Controls
          captureError={captureError}
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
        />
      </Paper>
    </Box>
  );
}