import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Box from '@mui/material/Box';
import Model from '@/components/Model';
import { CanvasCapture } from '@/utils';
import type { ThreeJsCanvasProps } from '@/types';

const ThreeJsCanvas = ({
    canvasRef,
    imgRef,
    deltaX,
    deltaY,
    overlayScale,
    base2DCanvasRef,
    objPath,
    mtlPath,
}: ThreeJsCanvasProps) => {
    return (
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
    );
}

export default ThreeJsCanvas;