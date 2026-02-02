import React, { useRef, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type BasisVectors, type Quaternion, type WheelEllipse } from '@/types';
import Model from '@/components/Model';

interface BootOverlayProps {
  ellipse: WheelEllipse;
  basisVectors: BasisVectors;
  quaternion: Quaternion;
  objPath: string;
  mtlPath?: string;
  // Callback to receive the rendered image
  onRender?: (imageData: string) => void;
  // Size of the render canvas (should be large enough to capture the boot)
  renderSize?: number;
}

// Component to draw an ellipse as a 3D line at the origin
function Ellipse3D({ 
  axes, 
  angle,
  color = 0x00ff00,
  segments = 64 
}: { 
  axes: [number, number]; // [semi-major, semi-minor]
  angle: number; // in degrees
  color?: number;
  segments?: number;
}) {
  const points: THREE.Vector3[] = [];
  const angleRad = (angle * Math.PI) / 180;
  
  // Generate ellipse points in XY plane, then rotate by angle
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    // Ellipse parametric: x = a*cos(θ), y = b*sin(θ)
    const x = axes[0] * Math.cos(theta);
    const y = axes[1] * Math.sin(theta);
    
    // Rotate by ellipse angle around Z axis
    const rotatedX = x * Math.cos(angleRad) - y * Math.sin(angleRad);
    const rotatedY = x * Math.sin(angleRad) + y * Math.cos(angleRad);
    
    points.push(new THREE.Vector3(rotatedX, rotatedY, 0));
  }
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, linewidth: 2 });
  const line = new THREE.Line(geometry, material);
  
  return <primitive object={line} />;
}

// Component to draw basis vectors as arrows at the origin
function BasisVectors3D({ 
  basisVectors,
  axisLength = 1
}: { 
  basisVectors: BasisVectors;
  axisLength?: number;
}) {
  return (
    <group>
      {/* X-axis (Red) - Wheel axle direction */}
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
      {/* Z-axis (Blue) - Forward direction */}
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

// Scene that renders and captures to image
function CaptureScene({
  ellipse,
  basisVectors,
  objPath,
  mtlPath,
  onRender
}: Omit<BootOverlayProps, 'renderSize'>) {
  const { gl, scene, camera } = useThree();
  const frameCount = useRef(0);

  // Scale factor: convert pixel axes to Three.js world units
  // We'll use a simple mapping: 1 pixel = 0.01 world units
  // This keeps the model at a reasonable size in the scene
  const pixelToWorld = 0.01;
  const worldAxes: [number, number] = [
    ellipse.axes[0] * pixelToWorld,
    ellipse.axes[1] * pixelToWorld
  ];

  // Capture frame after model is loaded (give it a few frames)
  useFrame(() => {
    frameCount.current++;

    // Wait a few frames for model to load, then capture
    if (frameCount.current === 10 && onRender) {
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL('image/png');
      onRender(dataUrl);
    }
  });

  const dummyCanvasRef = useRef<HTMLCanvasElement>(null);
  const dummyImgRef = useRef<HTMLImageElement>(null);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />

      {/* Ellipse at origin (for alignment reference) */}
      <Ellipse3D
        axes={worldAxes}
        angle={ellipse.angle}
        color={0x00ff00}
      />

      {/* Basis vectors at origin (for alignment reference) */}
      <BasisVectors3D
        basisVectors={basisVectors}
        axisLength={Math.max(...worldAxes) * 1.5}
      />

      {/* The boot model - positioned and scaled to fit the ellipse */}
      <Suspense fallback={null}>
        <Model
          objPath={objPath}
          mtlPath={mtlPath}
          position={[0, 0, 0]}
          canvasCaptureProps={{
            base2DImageRef: dummyCanvasRef,
            canvas2DRef: dummyCanvasRef,
            deltaX: 0,
            deltaY: 0,
            imgRef: dummyImgRef,
            scale: 1,
          }}
        // Use standard Three.js coordinates
        />
      </Suspense>
    </>
  );
}

export default function BootOverlay({
  ellipse,
  basisVectors,
  quaternion,
  objPath,
  mtlPath,
  onRender,
  renderSize = 256
}: BootOverlayProps) {
  // Camera distance based on ellipse size
  const pixelToWorld = 0.01;
  const maxAxis = Math.max(ellipse.axes[0], ellipse.axes[1]) * pixelToWorld;
  const cameraDistance = maxAxis * 3;
  
  return (
    <div style={{ 
      width: renderSize, 
      height: renderSize, 
      position: 'fixed',
      right: 20,
      bottom: 20,
      border: '2px solid #00ff00',
      borderRadius: 8,
      zIndex: 1000,
      background: '#222'
    }}>
      <Canvas
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        camera={{
          position: [0, 0, cameraDistance],
          fov: 50,
          near: 0.1,
          far: cameraDistance * 10
        }}
        style={{ background: 'transparent' }}
      >
        <CaptureScene
          ellipse={ellipse}
          basisVectors={basisVectors}
          quaternion={quaternion}
          objPath={objPath}
          mtlPath={mtlPath}
          onRender={onRender}
        />
      </Canvas>
    </div>
  );
}

// Export the 3D ellipse component for use elsewhere
export { Ellipse3D, BasisVectors3D };
