import { useRef, useState, type RefObject } from 'react';
import Box from '@mui/material/Box';
import { type ViewerProps } from '@/types';
import { useDrawDetections } from '@/hooks';
import R3FiberCanvas from './components/R3FiberCanvas';
import HiddenImage from './components/HiddenImage';
import MainCanvas from './components/MainCanvas';
import OffScreenCanvas from './components/OffscreenCanvas';

export default function Viewer({
  src,
  detections = [],
}: ViewerProps) {

  const base2DCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const {
    deltaX,
    deltaY,
    overlayScale,
    tireCenterLineAngle,
  } = useDrawDetections({
    base2DCanvasRef,
    canvasRef,
    detections,
    imgRef,
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
      <R3FiberCanvas
        base2DCanvasRef={base2DCanvasRef as RefObject<HTMLCanvasElement>}
        canvasRef={mainCanvasRef}
        deltaX={deltaX}
        deltaY={deltaY}
        imgRef={hiddenImageRef}
        overlayScale={overlayScale}
        tireCenterlineAngle={tireCenterLineAngle}
      />
    </Box>
  );
}
