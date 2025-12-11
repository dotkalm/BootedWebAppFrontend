import type { RefObject } from 'react';
import { type CarDetection } from '@/types';

export interface ViewerProps {
  src: string;
  detections?: CarDetection[];
  objPath?: string;
  mtlPath?: string;
}

export interface ThreeJsCanvasProps {
    base2DCanvasRef: RefObject<HTMLCanvasElement>;
    canvasRef: RefObject<HTMLCanvasElement>;
    deltaX: number;
    deltaY: number;
    imgRef: RefObject<HTMLImageElement>;
    mtlPath: string;
    objPath: string;
    overlayScale: number;
    tireCenterlineAngle: number;
}