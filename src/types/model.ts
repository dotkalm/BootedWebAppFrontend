import type {
  Vector3,
  Box3,
} from 'three';
import { type TCanvasCaptureProps } from '@/types';

export interface ModelProps {
  baseRotation?: [number, number, number];
  canvasCaptureProps: Omit<TCanvasCaptureProps, 'modelLoaded'>;
  mtlPath?: string;
  objPath?: string;
  position?: [number, number, number];
  rotation?: [number, number, number]; 
  scale?: number;
  tireCenterlineAngle?: number | null;
}

export interface ModelInfo {
  clampBoundingBox?: Box3;
  meshNames: string[];
  originalCenter: Vector3;
  originalMax: Vector3;
  originalMin: Vector3;
  originalSize: Vector3;
}