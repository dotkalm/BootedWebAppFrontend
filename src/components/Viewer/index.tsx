import { useEffect, useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { type CarDetection } from '@/types';
import { getPrimaryWheelTransform, getAllWheelTransforms } from '@/utils';
import BootOverlay from '@/components/BootOverlay';
import { useOrientation } from '@/hooks';

interface ViewerProps {
  src: string;
  detections?: CarDetection[];
  mode?: '2d' | '3d';
  objPath?: string;
  mtlPath?: string;
  scale?: number;
  selectedWheel?: 'rear' | 'front' | 'primary'; // Which wheel to target
  setShowViewer?: (show: boolean) => void;
  onBack?: () => void;
}

export default function Viewer({
  src,
  detections = [],
  mode = '2d',
  objPath,
  mtlPath,
  scale,
  selectedWheel = 'primary',
  setShowViewer,
  onBack
}: ViewerProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isLandscape } = useOrientation();
  
  // State for the rendered boot overlay image
  const [bootImageData, setBootImageData] = useState<string | null>(null);

  // Get the target wheel transform and ellipse
  const detection = detections[0];
  const selectedTransform = detection
    ? selectedWheel === 'rear'
      ? detection.rear_wheel_transform
      : selectedWheel === 'front'
        ? detection.front_wheel_transform
        : getPrimaryWheelTransform(detection)
    : null;
  
  // Get the corresponding ellipse for the selected wheel
  const selectedEllipse = detection
    ? selectedWheel === 'rear'
      ? detection.rear_wheel_ellipse
      : selectedWheel === 'front'
        ? detection.front_wheel_ellipse
        : detection.rear_wheel_ellipse // primary defaults to rear
    : null;
  
  // Compute target radius in normalized coordinates from ellipse
  // Ellipse axes are in pixels, normalize by image half-width (320 for 640px image)
  // Use the average of the two axes for the target radius
  const imageHalfWidth = 320; // TODO: get from detection.image_dimensions
  const targetRadius = selectedEllipse
    ? ((selectedEllipse.axes[0] + selectedEllipse.axes[1]) / 2) / imageHalfWidth
    : 0.1;
  
  // Callback to receive rendered boot image from BootOverlay
  const handleBootRender = useCallback((imageData: string) => {
    setBootImageData(imageData);
  }, []);

  // Draw 2D overlay (bounding boxes and debug info)
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas matches image natural size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Clear overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get all wheel transforms
    const transforms = getAllWheelTransforms(detections);

    // Draw each wheel's bounding box
    transforms.forEach((transform, index) => {
      const bbox = transform.bounding_box;
      const isSelected = transform === selectedTransform;

      // Draw bounding box
      ctx.beginPath();
      ctx.rect(bbox.x1, bbox.y1, bbox.width, bbox.height);
      ctx.strokeStyle = isSelected ? '#0000ff' : '#ff0000';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw center point
      ctx.beginPath();
      ctx.arc(transform.position.pixel_x, transform.position.pixel_y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? '#0000ff' : '#ff0000';
      ctx.fill();

      // Draw label
      ctx.fillStyle = isSelected ? '#0000ff' : '#ff0000';
      ctx.font = '16px monospace';
      ctx.fillText(
        transform.rotation.metadata.target_wheel,
        bbox.x1,
        bbox.y1 - 5
      );
    });

    // Draw wheel ellipses if available
    const detection = detections[0];
    if (detection) {
      // Draw rear wheel ellipse
      if (detection.rear_wheel_ellipse) {
        const ellipse = detection.rear_wheel_ellipse;
        const [cx, cy] = ellipse.center;
        const [semiMajor, semiMinor] = ellipse.axes;
        const angleRad = (ellipse.angle * Math.PI) / 180;

        ctx.beginPath();
        ctx.ellipse(cx, cy, semiMajor, semiMinor, angleRad, 0, 2 * Math.PI);
        ctx.strokeStyle = '#00ff00'; // Green for rear
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw front wheel ellipse
      if (detection.front_wheel_ellipse) {
        const ellipse = detection.front_wheel_ellipse;
        const [cx, cy] = ellipse.center;
        const [semiMajor, semiMinor] = ellipse.axes;
        const angleRad = (ellipse.angle * Math.PI) / 180;

        ctx.beginPath();
        ctx.ellipse(cx, cy, semiMajor, semiMinor, angleRad, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ff00ff'; // Magenta for front
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw car direction vector if available
    if (detections[0]?.car_geometry?.wheel_to_wheel_2d) {
      const dir = detections[0].car_geometry.wheel_to_wheel_2d;
      const carBox = detections[0].car.bbox;
      const centerX = (carBox.x1 + carBox.x2) / 2;
      const centerY = (carBox.y1 + carBox.y2) / 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + dir[0] * 100, centerY + dir[1] * 100);
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    // Draw the rendered boot image at the wheel position
    if (bootImageData && selectedEllipse && mode === '3d') {
      const bootImg = new Image();
      bootImg.onload = () => {
        // Calculate position to center the boot image on the ellipse center
        const [cx, cy] = selectedEllipse.center;
        
        // The boot image is square, centered on the 3D model
        // We need to scale it based on the ellipse size
        const maxEllipseAxis = Math.max(selectedEllipse.axes[0], selectedEllipse.axes[1]);
        // The rendered image has the model filling roughly half the canvas
        // So we scale the image to be about 4x the ellipse size
        const drawSize = maxEllipseAxis * 4;
        
        const drawX = cx - drawSize / 2;
        const drawY = cy - drawSize / 2;
        
        ctx.drawImage(bootImg, drawX, drawY, drawSize, drawSize);
      };
      bootImg.src = bootImageData;
    }
  }, [src, detections, selectedTransform, bootImageData, selectedEllipse, mode]);

  console.log({
    'Viewer - Selected transform': selectedTransform,
    'Mode': mode,
    'Detections count': detections.length,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isLandscape ? 'row' : 'column',
        alignItems: isLandscape ? 'flex-start' : 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          img: {
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
          }
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt="Captured frame"
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
        
        {/* Off-screen 3D renderer - captures boot model and composites onto 2D canvas */}
        {mode === '3d' && objPath && selectedTransform && selectedEllipse && (
          <BootOverlay
            ellipse={selectedEllipse}
            basisVectors={selectedTransform.rotation.basis_vectors}
            quaternion={selectedTransform.rotation.quaternion}
            objPath={objPath}
            mtlPath={mtlPath}
            onRender={handleBootRender}
            renderSize={512}
          />
        )}
      </Box>

      {setShowViewer && (
        <Button
          variant="contained"
          onClick={() => {
            setShowViewer(false);
            onBack?.();
          }}
          sx={{
            alignSelf: isLandscape ? 'flex-start' : 'center',
          }}
        >
          ← Back
        </Button>
      )}
    </Box>
  );
}
