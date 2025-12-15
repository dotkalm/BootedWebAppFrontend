import { useEffect, useState, } from 'react';
import { type TUseDetectionsReturn, type UseDrawDetectionsProps } from '@/types';
import { 
  axisLength,
  BASE_WHEEL_RADIUS_PX,
} from '@/constants';

export function useDrawDetections({
  base2DCanvasRef,
  canvasRef,
  detections,
  imgRef,
  src,
}: UseDrawDetectionsProps): TUseDetectionsReturn {
  const [deltaX, setDeltaX] = useState<number>(0);
  const [deltaY, setDeltaY] = useState<number>(0);
  const [overlayScale, setOverlayScale] = useState<number>(1);
  const [tireCenterLineAngle, setTireCenterlineAngle] = useState<number>(180);

  useEffect(() => {
    const handleOffsetCalculated = (x: number, y: number) => {
      setDeltaX(x);
      setDeltaY(y);
    };
    const carImage = imgRef.current;
    const base2DCanvas = base2DCanvasRef.current;
    if (!carImage || !base2DCanvas) return;

    const ctx = base2DCanvas.getContext('2d');
    if (!ctx) return;

    // Match canvas size to image
    base2DCanvas.width = carImage.naturalWidth;
    base2DCanvas.height = carImage.naturalHeight;
    ctx.clearRect(0, 0, base2DCanvas.width, base2DCanvas.height);

    // Draw the car image first
    ctx.drawImage(carImage, 0, 0);

    const detection = detections[0];
    if (!detection) return;

    // Calculate image center
    const imageCenterX = base2DCanvas.width / 2;
    const imageCenterY = base2DCanvas.height / 2;

    // Calculate rear wheel ellipse width (major axis diameter) and scale
    let rearWheelWidth = null;
    let wheelRadius = null;
    let scale = 1;
    if (detection.rear_wheel_ellipse) {
      const [semiMajor] = detection.rear_wheel_ellipse.axes;
      wheelRadius = semiMajor; // Radius
      rearWheelWidth = semiMajor * 2; // Full width is diameter

      // Calculate scale: if wheel radius is 59px and base is 50px, scale = 1.18
      scale = wheelRadius / BASE_WHEEL_RADIUS_PX;
      
      // Notify parent
      setOverlayScale(scale);
    }

    // Calculate deltaX and deltaY from image center to rear wheel (green ellipse) center
    let offsetX = 0;
    let offsetY = 0;
    if (detection.rear_wheel_ellipse) {
      const [rearX, rearY] = detection.rear_wheel_ellipse.center;
      offsetX = rearX - imageCenterX;
      offsetY = rearY - imageCenterY;
      
      // Notify parent
      handleOffsetCalculated(offsetX, offsetY);
    }

    // Draw rear wheel ellipse (green)
    if (detection.rear_wheel_ellipse) {
      const ellipse = detection.rear_wheel_ellipse;
      const [cx, cy] = ellipse.center;
      const [semiMajor, semiMinor] = ellipse.axes;
      const angleRad = (ellipse.angle * Math.PI) / 180;

      ctx.beginPath();
      ctx.ellipse(cx, cy, semiMajor, semiMinor, angleRad, 0, 2 * Math.PI);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw center point
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#00ff00';
      ctx.fill();
    }

    // Draw front wheel ellipse (magenta)
    if (detection.front_wheel_ellipse) {
      const ellipse = detection.front_wheel_ellipse;
      const [cx, cy] = ellipse.center;
      const [semiMajor, semiMinor] = ellipse.axes;
      const angleRad = (ellipse.angle * Math.PI) / 180;

      ctx.beginPath();
      ctx.ellipse(cx, cy, semiMajor, semiMinor, angleRad, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw center point
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#ff00ff';
      ctx.fill();
    }

    // Draw line between tire centers and calculate angle
    if (detection.rear_wheel_ellipse && detection.front_wheel_ellipse) {
      const [rearX, rearY] = detection.rear_wheel_ellipse.center;
      const [frontX, frontY] = detection.front_wheel_ellipse.center;

      const dx = frontX - rearX;
      const dy = frontY - rearY;
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = (angleRad * 180) / Math.PI;

      setTireCenterlineAngle(angleRad);

      // Draw line between centers
      ctx.beginPath();
      ctx.moveTo(rearX, rearY);
      ctx.lineTo(frontX, frontY);
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Display angle text at midpoint
      const midX = (rearX + frontX) / 2;
      const midY = (rearY + frontY) / 2;
      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`${angleDeg.toFixed(1)}°`, midX + 10, midY - 10);
    }

    if (detection.rear_wheel_transform) {
      const transform = detection.rear_wheel_transform;
      const px = transform.position.pixel_x;
      const py = transform.position.pixel_y;
      const basis = transform.rotation.basis_vectors;

      const makeLines = (axis: [number, number, number], color: string) => {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + axis[0] * axisLength, py + axis[1] * axisLength);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      makeLines(basis.x_axis, '#ff0000');
      makeLines(basis.y_axis, '#00ff00');
      makeLines(basis.z_axis, '#0000ff');
    }

    // Copy base 2D to main canvas initially
    const mainCanvas = canvasRef.current;
    if (mainCanvas) {
      mainCanvas.width = base2DCanvas.width;
      mainCanvas.height = base2DCanvas.height;
      const mainCtx = mainCanvas.getContext('2d');
      if (mainCtx) {
        mainCtx.drawImage(base2DCanvas, 0, 0);
      }
    }
  }, [
    axisLength,
    BASE_WHEEL_RADIUS_PX, 
    base2DCanvasRef, 
    canvasRef, 
    detections, 
    imgRef, 
    src, 
  ]);
  return {
    deltaX,
    deltaY,
    overlayScale,
    tireCenterLineAngle,
  }
}
