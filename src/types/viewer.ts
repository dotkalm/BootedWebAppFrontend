import type { RefObject } from 'react';
import { type CarDetection } from '@/types';

export interface ViewerProps {
  detections?: CarDetection[];
  src: string;
}

export interface R3FiberCanvasProps {
  base2DCanvasRef: RefObject<HTMLCanvasElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  deltaX: number;
  deltaY: number;
  imgRef: RefObject<HTMLImageElement>;
  mtlPath?: string;
  objPath?: string;
  overlayScale: number;
  tireCenterlineAngle?: number;
}

export interface HiddenImageProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  imgRef: RefObject<HTMLImageElement>;
  src: string;
};

export interface MainCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

export interface OffscreenCanvasProps {
  base2dCanvasRef: RefObject<HTMLCanvasElement>;
}

export interface TCanvasCaptureProps {
  base2DImageRef: React.RefObject<HTMLCanvasElement | null>;
  canvas2DRef: React.RefObject<HTMLCanvasElement | null>; 
  deltaX: number;
  deltaY: number;
  imgRef: React.RefObject<HTMLImageElement | null>; 
  modelLoaded: boolean;
  scale: number;
}