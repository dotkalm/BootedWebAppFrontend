import {
  Orientation, 
  type CarDetection, 
} from '@/types';

export interface ShutterProps {
    captureError: string | null;
    detections: CarDetection[];
    handleClick: () => void;
    isUploading: boolean;
    orientation: Orientation;
    totalCars: number;
    zoomLevel: number;
}

export interface TApplyZoomParams {
    newZoom: number;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isApplyingZoomRef: React.RefObject<boolean>;
    setMaxZoom: React.Dispatch<React.SetStateAction<number>>;
}

export type TApplyZoomToCamera = (params: TApplyZoomParams) => Promise<void>;