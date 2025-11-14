export interface BoundingBox {
  height: number;
  width: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface Detection {
  bbox: BoundingBox;
  class: string;
  confidence: number;
}

export interface FrameUploadResponse {
  detections: Detection[];
  filename: string;
  format: string;
  height: number;
  tire_count: number;
  width: number;
}