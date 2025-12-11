import { type CarDetection } from '@/types';

export interface ViewerProps {
  src: string;
  detections?: CarDetection[];
  objPath?: string;
  mtlPath?: string;
}