import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Box from '@mui/material/Box';
import Model from '@/components/Model';
import type { R3FiberCanvasProps, TCanvasCaptureProps } from '@/types';

const R3FiberCanvas = ({
    base2DCanvasRef,
    canvasRef,
    deltaX,
    deltaY,
    imgRef,
    overlayScale,
}: R3FiberCanvasProps) => {

  const canvasCaptureProps: Omit<TCanvasCaptureProps, 'modelLoaded'> = {
    base2DImageRef: base2DCanvasRef,
    canvas2DRef: canvasRef,
    deltaX,
    deltaY,
    imgRef,
    scale: overlayScale,
  };
  
  return (
    <Box
      sx={{
        height: '100%',
        left: 0,
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        visibility: 'hidden',
        width: '100%',
      }}
    >
      <Canvas
        dpr={1}
        gl={{ alpha: true, preserveDrawingBuffer: true }}
        camera={{
          far: 1000,
          fov: 50,
          near: 0.1,
          position: [100, 10, 100],
        }}
        style={{ background: 'transparent' }}
        frameloop="demand"
      >
        <gridHelper args={[20, 20, '#666666', '#444444']} />
        <axesHelper args={[5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Model
            baseRotation={[-Math.PI / 2, 0, 0]}
            canvasCaptureProps={canvasCaptureProps}
            position={[0, 0, 0]}
            rotation={[0, 1, 0]}
            scale={1}
          />
        </Suspense>
      </Canvas>
    </Box>
  );
}

export default R3FiberCanvas;