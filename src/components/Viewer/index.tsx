import React, { useEffect, useRef } from 'react';
import { type CarDetection, type BoundingBox } from '@/types';
import { getBoundingBoxes } from '@/utils';

interface ViewerProps {
  src: string;
  detections?: CarDetection[];
  className?: string;
}

export default function Viewer({ src, detections = [], className }: ViewerProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas matches the image's intrinsic size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Clear overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const boxes: BoundingBox[] = getBoundingBoxes(detections || []);

    boxes.forEach((box) => {
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
  }, [src, detections]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <img
        ref={imgRef}
        src={src}
        alt="Captured frame"
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        onLoad={() => {
          // Trigger redraw on load
          const canvas = canvasRef.current;
          const img = imgRef.current;
          if (canvas && img) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          }
        }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  );
}
