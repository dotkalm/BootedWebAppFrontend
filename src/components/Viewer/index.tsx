import { useRef, useState, Suspense, type RefObject } from 'react';
import Box from '@mui/material/Box';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { type ViewerProps } from '@/types';
import Model from '@/components/Model';
import { CanvasCapture } from '@/utils';
import { useDrawDetections } from '@/hooks';
import ThreeJsCanvas from './components/R3FiberCanvas';
import HiddenImage from './components/HiddenImage';
import MainCanvas from './components/MainCanvas';
import OffScreenCanvas from './components/OffscreenCanvas';

export default function Viewer({
  src,
  detections = [],
  objPath,
  mtlPath,
}: ViewerProps) {

  const [deltaX, setDeltaX] = useState<number>(0);
  const [deltaY, setDeltaY] = useState<number>(0);
  const [overlayScale, setOverlayScale] = useState<number>(1);
  const [tireCenterlineAngle, setTireCenterlineAngle] = useState<number>();
  const base2DCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleOffsetCalculated = (x: number,y: number) => {
      setDeltaX(x);
      setDeltaY(y);
  };

  useDrawDetections({
    base2DCanvasRef,
    canvasRef,
    detections,
    imgRef,
    onAngleCalculated: setTireCenterlineAngle,
    onOffsetCalculated: handleOffsetCalculated,
    onScaleCalculated: setOverlayScale,
    src,
  });

  const mainCanvasRef = canvasRef as RefObject<HTMLCanvasElement>
  const hiddenImageRef = imgRef as RefObject<HTMLImageElement>;
  const baseCanvasRef = base2DCanvasRef as RefObject<HTMLCanvasElement>;

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <HiddenImage
          canvasRef={mainCanvasRef}
          imgRef={hiddenImageRef}
          src={src}
        />
          <OffScreenCanvas
            base2dCanvasRef={baseCanvasRef}
          />
          <MainCanvas
            canvasRef={mainCanvasRef}
          />
          <ThreeJsCanvas
            base2DCanvasRef={base2DCanvasRef as RefObject<HTMLCanvasElement>}
            canvasRef={mainCanvasRef}
            deltaX={deltaX}
            deltaY={deltaY}
            imgRef={hiddenImageRef}
            mtlPath={mtlPath}
            objPath={objPath}
            overlayScale={overlayScale}
            tireCenterlineAngle={tireCenterlineAngle}
          />
    </Box>
  );
}
