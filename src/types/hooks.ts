import { type CarDetection } from '@/types';

export interface UseDrawDetectionsProps {
  base2DCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  detections: CarDetection[];
  imgRef: React.RefObject<HTMLImageElement | null>;
  src: string;
};

export interface TUseDetectionsReturn {
  deltaX: number;
  deltaY: number;
  overlayScale: number;
}
