import { useRef, useState, Suspense, type RefObject } from 'react';
import Box from '@mui/material/Box';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { type ViewerProps } from '@/types';
import Model from '@/components/Model';
import { CanvasCapture } from '@/utils';
import { useDrawDetections } from '@/hooks';
import ThreeJsCanvas from './components/ThreeJsCanvas';

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
  const [overlayScale, setOverlayScale] = useState<number>(1);
  
  // Base radius for scale calculation
  const BASE_WHEEL_RADIUS_PX = 100;

  // Draw base 2D content: car image, ellipses and basis vectors (to offscreen canvas)
  useDrawDetections({
    imgRef,
    base2DCanvasRef,
    canvasRef,
    detections,
    src,
    BASE_WHEEL_RADIUS_PX,
    onScaleCalculated: setOverlayScale,
    onOffsetCalculated: (x, y) => {
      setDeltaX(x);
      setDeltaY(y);
    },
    onAngleCalculated: setTireCenterlineAngle,
  });

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
      {(
        base2DCanvasRef.current &&
        canvasRef.current &&
        imgRef.current &&
        mtlPath &&
        objPath && 
        tireCenterlineAngle
      ) &&
        <ThreeJsCanvas
          canvasRef={canvasRef as RefObject<HTMLCanvasElement>}
          imgRef={imgRef as RefObject<HTMLImageElement>}
          base2DCanvasRef={base2DCanvasRef as RefObject<HTMLCanvasElement>}
          deltaX={deltaX}
          deltaY={deltaY}
          overlayScale={overlayScale}
          tireCenterlineAngle={tireCenterlineAngle}
          objPath={objPath}
          mtlPath={mtlPath}
        />
      }
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
                rotation={[0, 1, 0]}
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
              scale={overlayScale}
            />

            {/* Camera controls */}
            <OrbitControls target={[0, 0, 0]} />
          </Canvas>
        </Box>
      )}
    </Box>
  );
}
