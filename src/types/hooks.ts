import { type CarDetection } from '@/types';

export interface UseDrawDetectionsProps {
  base2DCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  detections: CarDetection[];
  imgRef: React.RefObject<HTMLImageElement | null>;
  onAngleCalculated: (angle: number) => void;
  onOffsetCalculated: (deltaX: number, deltaY: number) => void;
  onScaleCalculated: (scale: number) => void;
  src: string;
}
