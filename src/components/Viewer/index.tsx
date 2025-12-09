import { useEffect, useRef, useState, Suspense } from 'react';
import Box from '@mui/material/Box';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { type CarDetection } from '@/types';
import Model from '@/components/Model';

// Component to capture 3D canvas on each frame
function CanvasCapture({ 
  canvas2DRef, 
  imgRef 
}: { 
  canvas2DRef: React.RefObject<HTMLCanvasElement | null>; 
  imgRef: React.RefObject<HTMLImageElement | null>; 
}) {
  const { gl } = useThree();
  
  useFrame(() => {
    const canvas2D = canvas2DRef.current;
    const img = imgRef.current;
    const canvas3D = gl.domElement;
    
    if (!canvas2D || !canvas3D || !img) return;

    const ctx = canvas2D.getContext('2d');
    if (!ctx) return;

    try {
      // Create temp canvas for processing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.naturalWidth;
      tempCanvas.height = img.naturalHeight;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Draw scaled 3D canvas
      tempCtx.drawImage(canvas3D, 0, 0, tempCanvas.width, tempCanvas.height);

      // Composite 3D render onto 2D canvas (after other overlays)
      ctx.drawImage(tempCanvas, 0, 0);
    } catch (error) {
      console.error('Error capturing 3D canvas:', error);
    }
  });
  
  return null;
}

interface ViewerProps {
  src: string;
  detections?: CarDetection[];
  objPath?: string;
  mtlPath?: string;
}

export default function Viewer({
  src,
  detections = [],
  objPath,
  mtlPath,
}: ViewerProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas3DRef = useRef<HTMLCanvasElement | null>(null);
  const [tireCenterlineAngle, setTireCenterlineAngle] = useState<number | null>(null);

  // Draw 2D overlay: ellipses and basis vectors
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas size to image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const detection = detections[0];
    if (!detection) return;

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

      // Calculate angle of line from rear to front wheel
      // atan2(dy, dx) gives angle in radians from positive x-axis
      const dx = frontX - rearX;
      const dy = frontY - rearY;
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = (angleRad * 180) / Math.PI;

      // Store angle in state
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

    // Consolidated debug log
    console.log('=== VIEWER DEBUG INFO ===', {
      detection: {
        rear_wheel_ellipse: detection.rear_wheel_ellipse,
        front_wheel_ellipse: detection.front_wheel_ellipse,
        rear_wheel_transform: detection.rear_wheel_transform,
      },
      tireCenterlineAngle: tireCenterlineAngle ? {
        radians: tireCenterlineAngle,
        degrees: (tireCenterlineAngle * 180) / Math.PI,
      } : null,
      canvas: {
        width: canvas.width,
        height: canvas.height,
      },
    });

    // Draw basis vectors for rear wheel
    if (detection.rear_wheel_transform) {
      const transform = detection.rear_wheel_transform;
      const px = transform.position.pixel_x;
      const py = transform.position.pixel_y;
      const basis = transform.rotation.basis_vectors;
      const axisLength = 50; // pixels

      // X-axis (Red)
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + basis.x_axis[0] * axisLength, py + basis.x_axis[1] * axisLength);
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Y-axis (Green)
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + basis.y_axis[0] * axisLength, py - basis.y_axis[1] * axisLength); // flip Y for canvas
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Z-axis (Blue)
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + basis.z_axis[0] * axisLength, py + basis.z_axis[1] * axisLength);
      ctx.strokeStyle = '#0000ff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [src, detections]);

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {/* Base image */}
      <img
        ref={imgRef}
        src={src}
        alt="Detection"
        onLoad={() => {
          const canvas = canvasRef.current;
          const img = imgRef.current;
          if (canvas && img) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          }
        }}
        style={{ display: 'block', maxWidth: '100%' }}
      />

      {/* 2D Canvas overlay for ellipses and basis vectors */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* 3D Canvas overlay - transparent background */}
      {objPath && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <Canvas
            gl={{ alpha: true, preserveDrawingBuffer: true }}
            camera={{
              position: [100, 10, 100],
              fov: 50,
              near: 0.1,
              far: 1000,
            }}
            style={{ background: 'transparent' }}
          >
            {/* Grid to visualize the ground plane */}
            <gridHelper args={[20, 20, '#666666', '#444444']} />
            
            {/* Standard Three.js axes helper - RGB = XYZ */}
            <axesHelper args={[5]} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />

            {/* 3D Model at origin */}
            <Suspense fallback={null}>
              <Model
                objPath={objPath}
                mtlPath={mtlPath}
                position={[0, 0, 0]}
                scale={1}
                rotation={[.08, 1, 0]}
                baseRotation={[-Math.PI / 2, 0, 0]}
                tireCenterlineAngle={tireCenterlineAngle}
              />
            </Suspense>

            {/* Capture 3D canvas on each frame */}
            <CanvasCapture canvas2DRef={canvasRef} imgRef={imgRef} />

            {/* Camera controls */}
            <OrbitControls target={[0, 0, 0]} />
          </Canvas>
        </Box>
      )}
    </Box>
  );
}
