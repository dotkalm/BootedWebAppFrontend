import { useEffect, useRef, useState, Suspense } from 'react';
import Box from '@mui/material/Box';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { type CarDetection } from '@/types';
import Model from '@/components/Model';

// Component to capture 3D canvas once when ready
function CanvasCapture({ 
  canvas2DRef, 
  imgRef,
  base2DImageRef,
  deltaX,
  deltaY,
}: { 
  canvas2DRef: React.RefObject<HTMLCanvasElement | null>; 
  imgRef: React.RefObject<HTMLImageElement | null>; 
  base2DImageRef: React.RefObject<HTMLCanvasElement | null>;
  deltaX: number;
  deltaY: number;
}) {
  const { gl } = useThree();
  const [captured, setCaptured] = useState(false);
  
  useEffect(() => {
    if (captured) return;

    // Small delay to ensure 3D scene is fully rendered
    const timer = setTimeout(() => {
      const canvas2D = canvas2DRef.current;
      const img = imgRef.current;
      const canvas3D = gl.domElement;
      const base2DImage = base2DImageRef.current;
      
      if (!canvas2D || !canvas3D || !img || !base2DImage) return;

      const ctx = canvas2D.getContext('2d');
      if (!ctx) return;

      try {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);
        
        // Draw the base 2D content (car image + overlays)
        ctx.drawImage(base2DImage, 0, 0);
        
        // Create temp canvas for 3D processing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.naturalWidth;
        tempCanvas.height = img.naturalHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // Draw scaled 3D canvas with offset
        tempCtx.drawImage(canvas3D, deltaX, deltaY, tempCanvas.width, tempCanvas.height);

        // Composite 3D render onto 2D canvas (on top of base content)
        ctx.drawImage(tempCanvas, 0, 0);
        
        setCaptured(true);
        console.log('3D canvas captured and composited with offset:', { deltaX, deltaY });
      } catch (error) {
        console.error('Error capturing 3D canvas:', error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [gl, canvas2DRef, imgRef, base2DImageRef, captured]);
  
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
  const base2DCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tireCenterlineAngle, setTireCenterlineAngle] = useState<number | null>(null);
  const [deltaX, setDeltaX] = useState<number>(0);
  const [deltaY, setDeltaY] = useState<number>(0);

  // Draw base 2D content: car image, ellipses and basis vectors (to offscreen canvas)
  useEffect(() => {
    const img = imgRef.current;
    const base2DCanvas = base2DCanvasRef.current;
    if (!img || !base2DCanvas) return;

    const ctx = base2DCanvas.getContext('2d');
    if (!ctx) return;

    // Match canvas size to image
    base2DCanvas.width = img.naturalWidth;
    base2DCanvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, base2DCanvas.width, base2DCanvas.height);

    // Draw the car image first
    ctx.drawImage(img, 0, 0);

    const detection = detections[0];
    if (!detection) return;

    // Calculate image center
    const imageCenterX = base2DCanvas.width / 2;
    const imageCenterY = base2DCanvas.height / 2;

    // Calculate deltaX and deltaY from image center to rear wheel (green ellipse) center
    let offsetX = 0;
    let offsetY = 0;
    if (detection.rear_wheel_ellipse) {
      const [rearX, rearY] = detection.rear_wheel_ellipse.center;
      offsetX = rearX - imageCenterX;
      offsetY = rearY - imageCenterY;
      
      // Store in state
      setDeltaX(offsetX);
      setDeltaY(offsetY);
      
      console.log('Image center to rear wheel offset:', {
        imageCenterX,
        imageCenterY,
        rearWheelCenter: { x: rearX, y: rearY },
        deltaX: offsetX,
        deltaY: offsetY,
        distance: Math.sqrt(offsetX * offsetX + offsetY * offsetY)
      });
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
        width: base2DCanvas.width,
        height: base2DCanvas.height,
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
  }, [src, detections]);

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {/* Base image - hidden, used as source for canvas */}
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
        style={{ display: 'none' }}
      />

      {/* Hidden canvas to store base 2D content */}
      <canvas
        ref={base2DCanvasRef}
        style={{ display: 'none' }}
      />

      {/* Main canvas - contains car image, 2D overlays, and 3D composite */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
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
            <CanvasCapture 
              canvas2DRef={canvasRef} 
              imgRef={imgRef} 
              base2DImageRef={base2DCanvasRef}
              deltaX={deltaX}
              deltaY={deltaY}
            />

            {/* Camera controls */}
            <OrbitControls target={[0, 0, 0]} />
          </Canvas>
        </Box>
      )}
    </Box>
  );
}
