import { useEffect, useRef, Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { type CarDetection, type WheelTransform, type BasisVectors } from '@/types';
import { getPrimaryWheelTransform, getAllWheelTransforms } from '@/utils';
import Model from '@/components/Model';
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

// Draw 3D axes using basis vectors from backend
function AxesVisualization({
  basisVectors,
  position
}: {
  basisVectors: BasisVectors;
  position: [number, number, number];
}) {
  const axisLength = 2;

  return (
    <group position={position}>
      {/* X-axis (Red) - Wheel axle direction */}
      <arrowHelper
        args={[
          new THREE.Vector3(...basisVectors.x_axis),
          new THREE.Vector3(0, 0, 0),
          axisLength,
          0xff0000
        ]}
      />
      {/* Y-axis (Green) - Up direction */}
      <arrowHelper
        args={[
          new THREE.Vector3(...basisVectors.y_axis),
          new THREE.Vector3(0, 0, 0),
          axisLength,
          0x00ff00
        ]}
      />
      {/* Z-axis (Blue) - Forward direction */}
      <arrowHelper
        args={[
          new THREE.Vector3(...basisVectors.z_axis),
          new THREE.Vector3(0, 0, 0),
          axisLength,
          0x0000ff
        ]}
      />
    </group>
  );
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

  // Get the target wheel transform
  const selectedTransform = detections[0]
    ? selectedWheel === 'rear'
      ? detections[0].rear_wheel_transform
      : selectedWheel === 'front'
        ? detections[0].front_wheel_transform
        : getPrimaryWheelTransform(detections[0])
    : null;

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

    // Draw car direction vector if available
    if (detections[0]?.car_geometry?.direction_2d) {
      const dir = detections[0].car_geometry.direction_2d;
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
  }, [src, detections, selectedTransform]);

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
        {mode === '3d' && objPath && selectedTransform && (
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
                position: [0, 0, 5],
                fov: 50
               }}
              gl={{ alpha: true }}
              style={{ background: 'transparent' }}
            >
              {/* Visualize the 3D axes from backend */}
              <AxesVisualization
                basisVectors={selectedTransform.rotation.basis_vectors}
                position={[
                  selectedTransform.position.x,
                  selectedTransform.position.y,
                  selectedTransform.position.z
                ]}
              />

              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={5} />
              <directionalLight position={[-10, -10, -5]} intensity={.5} />

              <Suspense fallback={null}>
                <Model
                  objPath={objPath}
                  mtlPath={mtlPath}
                  rotation={[
                    selectedTransform.rotation.euler_angles.x,
                    selectedTransform.rotation.euler_angles.y,
                    selectedTransform.rotation.euler_angles.z
                  ]}
                  position={[
                    selectedTransform.position.x,
                    selectedTransform.position.y,
                    selectedTransform.position.z
                  ]}
                  scale={scale || selectedTransform.scale.uniform}
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
