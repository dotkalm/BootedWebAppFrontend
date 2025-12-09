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
// Backend coordinate system for wheel:
// - x_axis: Wheel axle direction (points into the car, perpendicular to wheel face)
// - y_axis: Up direction (world up, adjusted for ground tilt)
// - z_axis: Forward direction (car's direction of travel, tangent to wheel)
function AxesVisualization({
  basisVectors,
  position,
  showWorldAxes = true
}: {
  basisVectors: BasisVectors;
  position: [number, number, number];
  showWorldAxes?: boolean;
}) {
  const axisLength = 0.5;

  return (
    <group position={position}>
      {/* World/Three.js standard axes (dimmer, for reference) */}
      {showWorldAxes && (
        <axesHelper args={[axisLength * 0.5]} />
      )}
      
      {/* Backend basis vectors - the actual wheel coordinate system */}
      {/* X-axis (Red) - Wheel axle direction (into car) */}
      <arrowHelper
        args={[
          new THREE.Vector3(...basisVectors.x_axis).normalize(),
          new THREE.Vector3(0, 0, 0),
          axisLength,
          0xff0000,
          axisLength * 0.2,
          axisLength * 0.1
        ]}
      />
      {/* Y-axis (Green) - Up direction */}
      <arrowHelper
        args={[
          new THREE.Vector3(...basisVectors.y_axis).normalize(),
          new THREE.Vector3(0, 0, 0),
          axisLength,
          0x00ff00,
          axisLength * 0.2,
          axisLength * 0.1
        ]}
      />
      {/* Z-axis (Blue) - Forward direction (tangent to wheel) */}
      <arrowHelper
        args={[
          new THREE.Vector3(...basisVectors.z_axis).normalize(),
          new THREE.Vector3(0, 0, 0),
          axisLength,
          0x0000ff,
          axisLength * 0.2,
          axisLength * 0.1
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
              orthographic
              camera={{
                // Orthographic camera matching normalized coordinates [-1, 1]
                position: [0, 0, 10],
                zoom: 1,
                left: -1,
                right: 1,
                top: 1,
                bottom: -1,
                near: 0.1,
                far: 100
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
                  0 // Keep axes on z=0 plane for visibility
                ]}
              />

              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={5} />
              <directionalLight position={[-10, -10, -5]} intensity={.5} />

              <Suspense fallback={null}>
                <Model
                  objPath={objPath}
                  mtlPath={mtlPath}
                  quaternion={selectedTransform.rotation.quaternion}
                  basisVectors={selectedTransform.rotation.basis_vectors}
                  position={[
                    selectedTransform.position.x,
                    selectedTransform.position.y,
                    0 // Place on z=0 plane
                  ]}
                  scale={scale || selectedTransform.scale.uniform * 0.1}
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
