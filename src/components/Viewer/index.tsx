import { useEffect, useRef, Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { type CarDetection, type BoundingBox } from '@/types';
import { getBoundingBoxes } from '@/utils';
import Model from '@/components/Model';
import { useOrientation } from '@/hooks';

interface ViewerProps {
  src: string;
  detections?: CarDetection[];
  mode?: '2d' | '3d';
  objPath?: string;
  mtlPath?: string;
  rotation?: [number, number, number];
  position?: [number, number, number];
  scale?: number;
  detectionIndex?: number;
  autoAlign?: boolean;
  setShowViewer?: (show: boolean) => void;
  onBack?: () => void;
}

// Convert 2D pixel coordinates to 3D world coordinates
function pixel2DTo3D(
  pixelX: number,
  pixelY: number,
  imageWidth: number,
  imageHeight: number,
  cameraPosition: [number, number, number],
  fov: number,
  targetZ: number = 0
): [number, number, number] {
  // Normalize pixel coordinates to -1 to 1 range
  const ndcX = (pixelX / imageWidth) * 2 - 1;
  const ndcY = -((pixelY / imageHeight) * 2 - 1); // Flip Y axis

  // Calculate the visible height and width at the target Z plane
  const cameraZ = cameraPosition[2];
  const distance = cameraZ - targetZ;
  const vFOV = (fov * Math.PI) / 180; // Convert to radians
  const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
  const visibleWidth = visibleHeight * (imageWidth / imageHeight);

  // Convert NDC to world coordinates
  const worldX = (ndcX * visibleWidth) / 2 + cameraPosition[0];
  const worldY = (ndcY * visibleHeight) / 2 + cameraPosition[1];
  const worldZ = targetZ;

  return [worldX, worldY, worldZ];
}

export default function Viewer({
  src,
  detections = [],
  mode = '2d',
  objPath,
  mtlPath,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  scale = 1,
  detectionIndex = 0,
  autoAlign = false,
  setShowViewer,
  onBack
}: ViewerProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [calculatedPosition, setCalculatedPosition] = useState<[number, number, number]>(position);
  const { isLandscape } = useOrientation();

  // Debug logs
  console.log('Viewer props:', { mode, objPath, mtlPath, detections: detections?.length });
  console.log('Should show 3D?', mode === '3d' && !!objPath);

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

    boxes.forEach((box, index) => {
      const centerX = (box.x1 + box.x2) / 2;
      const centerY = (box.y1 + box.y2) / 2;
      const radiusX = box.width / 2;
      const radiusY = box.height / 2;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      // Highlight the selected detection
      ctx.strokeStyle = index === detectionIndex ? 'blue' : 'red';
      ctx.lineWidth = 0;
      ctx.stroke();
    });

    // Calculate 3D position for the selected detection in 3D mode if autoAlign is enabled
    if (mode === '3d' && autoAlign && boxes.length > detectionIndex) {
      const box = boxes[detectionIndex];

      // Calculate scale factor between natural and rendered image size
      const renderedWidth = img.clientWidth;
      const renderedHeight = img.clientHeight;
      const scaleX = img.naturalWidth / renderedWidth;
      const scaleY = img.naturalHeight / renderedHeight;

      // Scale the detection coordinates to match rendered image
      const centerX = ((box.x1 + box.x2) / 2) / scaleX;
      const centerY = ((box.y1 + box.y2) / 2) / scaleY;

      console.log('Auto-aligning to detection:', { box });
      console.log('Image - Natural:', { width: img.naturalWidth, height: img.naturalHeight });
      console.log('Image - Rendered:', { width: renderedWidth, height: renderedHeight });
      console.log('Scale factors:', { scaleX, scaleY });
      console.log('Center (rendered px):', { centerX, centerY });

      const cameraPos: [number, number, number] = [0, 0.1, 5];
      const fov = 50;
      const targetZ = 0;

      const worldPos = pixel2DTo3D(
        centerX,
        centerY,
        renderedWidth,
        renderedHeight,
        cameraPos,
        fov,
        targetZ
      );

      console.log('Calculated 3D position:', worldPos);
      setCalculatedPosition(worldPos);
    } else if (!autoAlign) {
      // Use manual position when autoAlign is off
      console.log('Using manual position:', position);
      setCalculatedPosition(position);
    }
  }, [src, detections, mode, detectionIndex, autoAlign, position]);

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
        {mode === '3d' && objPath && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'auto',
            }}
          >
            <Canvas
              camera={{
                position: [0, .1, 5],
                fov: 50
               }}
              gl={{ alpha: true }}
              style={{ background: 'transparent' }}
              onCreated={() => console.log('Three.js Canvas created successfully')}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={5} />
              <directionalLight position={[-10, -10, -5]} intensity={.5} />
              <Suspense fallback={null}>
                <Model
                  objPath={objPath}
                  mtlPath={mtlPath}
                  rotation={rotation}
                  position={calculatedPosition}
                  scale={scale}
                />
              </Suspense>
              <OrbitControls target={[0, 0, 0]} />
            </Canvas>
          </Box>
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
