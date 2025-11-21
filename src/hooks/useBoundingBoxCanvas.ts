import { useEffect, RefObject } from 'react';
import { type BoundingBox } from '@/types';

interface UseBoundingBoxCanvasProps {
  boundingBoxes: BoundingBox[];
  canvasRef: RefObject<HTMLCanvasElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
}

/**
 * Hook to draw bounding boxes on a canvas overlay
 */
export function useBoundingBoxCanvas({
  canvasRef,
  videoRef,
  boundingBoxes,
}: UseBoundingBoxCanvasProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw red circles for each bounding box
    boundingBoxes.forEach((box) => {
      const centerX = (box.x1 + box.x2) / 2;
      const centerY = (box.y1 + box.y2) / 2;
      const radiusX = box.width / 2;
      const radiusY = box.height / 2;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  }, [canvasRef, videoRef, boundingBoxes]);
}
