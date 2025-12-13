import { type TCanvasCaptureProps } from '@/types';

export interface ModelProps {
  baseRotation?: [number, number, number];
  canvasCaptureProps: Omit<TCanvasCaptureProps, 'modelLoaded'>;
  mtlPath?: string;
  objPath?: string;
  position?: [number, number, number];
  rotation?: [number, number, number]; 
  scale?: number;
  showBoundingBox?: boolean;
  tireCenterlineAngle?: number | null;
}