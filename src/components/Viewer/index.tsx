import { useEffect, useRef, Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { type CarDetection, type BoundingBox } from '@/types';
import { getBoundingBoxes } from '@/utils';
import Model from '@/components/Model';
import { useOrientation } from '@/hooks';
import * as THREE from 'three';

interface ViewerProps {
  src: string;
  detections?: CarDetection[];
  mode?: '2d' | '3d';
  objPath?: string;
  mtlPath?: string;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  scale?: number;
  detectionIndex?: number;
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
  const ndcY = -((pixelY / imageHeight) * 2 - 1); // Flip Y axis - pixels increase downward, 3D Y increases upward

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

// Component to rotate camera based on wheel axle angle
function CameraController({ rotationZ }: { rotationZ: number }) {
  const { camera } = useThree();

  useEffect(() => {
    // Rotate camera around Z axis to align with wheel axle
    camera.rotation.z = -rotationZ; // Negative to counter-rotate the view
    camera.updateProjectionMatrix();
  }, [camera, rotationZ]);

  return null;
}

// Rotated axes to show the model's coordinate system (both positive and negative)
function AlignedHelpers({
  modelRotation,
  position,
  axleAngle
}: {
  modelRotation: [number, number, number];
  position: [number, number, number];
  axleAngle: number;
}) {
  const axisLength = 5;

  return (
    <group position={position} rotation={[0, 0, axleAngle]}>
      {/* X axis - Red */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-axisLength, 0, 0, axisLength, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="red" />
      </line>

      {/* Y axis - Green */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -axisLength, 0, 0, axisLength, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="green" />
      </line>

      {/* Z axis - Blue */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -axisLength, 0, 0, axisLength])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="blue" />
      </line>
    </group>
  );
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
  const [cameraRotation, setCameraRotation] = useState<number>(0); // Rotation around Z axis in radians
  const { isLandscape } = useOrientation();

  // Debug logs
  console.log({
    'viewer props': { mode, objPath, mtlPath, detections: detections?.length },
    'using manual position': position,
    'calculated 3d position': calculatedPosition,
    'camera rotation': cameraRotation,
  });
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

    // Draw ellipses around wheels
    boxes.forEach((box, index) => {
      const centerX = (box.x1 + box.x2) / 2;
      const centerY = (box.y1 + box.y2) / 2;
      const radiusX = box.width / 2;
      const radiusY = box.height / 2;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      // Highlight the selected detection
      ctx.strokeStyle = index === detectionIndex ? 'blue' : 'red';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // If we have exactly 2 wheels, draw the axle line between them
    if (boxes.length === 2) {
      const center1X = (boxes[0].x1 + boxes[0].x2) / 2;
      const center1Y = (boxes[0].y1 + boxes[0].y2) / 2;
      const center2X = (boxes[1].x1 + boxes[1].x2) / 2;
      const center2Y = (boxes[1].y1 + boxes[1].y2) / 2;

      // Draw line through both wheel centers
      ctx.beginPath();
      ctx.moveTo(center1X, center1Y);
      ctx.lineTo(center2X, center2Y);
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Calculate angle of the wheel axle line (in radians)
      const axleAngle = Math.atan2(center2Y - center1Y, center2X - center1X);

      // Negate the angle to align axes correctly with the wheel axle
      console.log('Axle angle (radians):', axleAngle);
      console.log('Axle angle (degrees):', axleAngle * 180 / Math.PI);

      setCameraRotation(-axleAngle);
    }

    // Calculate 3D position for the selected detection in 3D mode if autoAlign is enabled
    if (mode === '3d' && autoAlign && boxes.length > detectionIndex) {
      const box = boxes[detectionIndex];

      // Detection coordinates are in natural image space - use them directly
      const centerX = (box.x1 + box.x2) / 2;
      const centerY = (box.y1 + box.y2) / 2;

      console.log({
        'Auto-aligning to detection': { box },
        'Image - Natural': { width: img.naturalWidth, height: img.naturalHeight },
        'Center (natural px)': { x: centerX, y: centerY },
      })

      const cameraPos: [number, number, number] = [0, 0.1, 5];
      const fov = 50;
      const targetZ = 0;

      // Use natural dimensions - this is what was working in "THE BOOT!" commit
      const worldPos = pixel2DTo3D(
        centerX,
        centerY,
        img.naturalWidth,
        img.naturalHeight,
        cameraPos,
        fov,
        targetZ
      );

      console.log('NEWLY CALCULATED worldPos:', worldPos);
      setCalculatedPosition(worldPos);
    } else if (!autoAlign) {
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
              <AlignedHelpers
                modelRotation={rotation}
                position={calculatedPosition}
                axleAngle={cameraRotation}
              />
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
