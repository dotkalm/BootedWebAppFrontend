import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Box from '@mui/material/Box';
import Model from '@/components/Model';
import type { R3FiberCanvasProps, TCanvasCaptureProps } from '@/types';

const R3FiberCanvas = ({
    base2DCanvasRef,
    canvasRef,
    deltaX,
    deltaY,
    imgRef,
    mtlPath,
    objPath,
    overlayScale,
}: R3FiberCanvasProps) => {

  const canvasCaptureProps: TCanvasCaptureProps = {
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
        <gridHelper args={[20, 20, '#666666', '#444444']} />
        <axesHelper args={[5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Model
            objPath={objPath}
            mtlPath={mtlPath}
            position={[0, 0, 0]}
            scale={1}
            rotation={[0, 1, 0]}
            baseRotation={[-Math.PI / 2, 0, 0]}
            canvasCaptureProps={canvasCaptureProps}
          />
        </Suspense>
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
    </Box>
  );
}

export default R3FiberCanvas;