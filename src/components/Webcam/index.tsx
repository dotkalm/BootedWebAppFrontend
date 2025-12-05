'use client';
import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Controls from '@/components/Controls';
import Viewer from '@/components/Viewer';
import {
  useBoundingBoxCanvas,
  useFrameCapture,
  useMounted,
  useOrientation,
  useThreeScene,
  useWebcam,
} from '@/hooks';
import {
  type BoundingBox,
  type CarDetection,
  type WebcamCaptureProps,
} from '@/types';
import { styles } from '@/styles';
import { applyZoomToCamera, getBoundingBoxes } from '@/utils';

export default function WebcamCapture({
  width = 640,
  height = 480,
}: WebcamCaptureProps) {
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [detections, setDetections] = useState<CarDetection[]>([]);
  const [maxZoom, setMaxZoom] = useState(3);
  const [totalCars, setTotalCars] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const isApplyingZoomRef = useRef(false);

  const mounted = useMounted();
  const { orientation, isLandscape } = useOrientation();
  const { videoRef } = useWebcam({ advanced: [{ zoom: zoomLevel }], facingMode: 'environment', height, width });
  const { captureFrame, isUploading, error: captureError } = useFrameCapture({ height, videoRef, width });

  // 2D bounding box overlay (for testing)
  useBoundingBoxCanvas({ boundingBoxes, canvasRef, videoRef });

  // 3D tire boot model overlay
  useThreeScene({ boundingBoxes, canvasRef: threeCanvasRef, videoRef });


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
        }
      } catch (err) {
        console.error('Local capture failed', err);
      }
    }

    const response = await captureFrame();
    const { detections, total_cars } = response || {};
    if( total_cars !== undefined ) {
      setTotalCars(total_cars);
    }
    if (detections) {
      setDetections(detections);
      setBoundingBoxes(getBoundingBoxes(detections));
    }
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
          {mounted && (
            <>
              <canvas
                ref={canvasRef}
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              />
              <canvas
                ref={threeCanvasRef}
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              />
            </>
          )}
        </Box>
        {capturedFrame && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Viewer src={capturedFrame} detections={detections} />
          </Box>
        )}
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