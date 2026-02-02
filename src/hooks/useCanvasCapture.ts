import { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { type TCanvasCaptureProps } from '@/types';

export function useCanvasCapture({
  base2DImageRef,
  canvas2DRef, 
  deltaX,
  deltaY,
  imgRef,
  modelLoaded,
  scale,
}: TCanvasCaptureProps) {
  const { gl, scene, camera } = useThree();
  const [captured, setCaptured] = useState(false);
  const [readyToCapture, setReadyToCapture] = useState(false);

  useEffect(() => {
    if (modelLoaded && !readyToCapture) {
      setReadyToCapture(true);
    }
  }, [modelLoaded, readyToCapture]);

  useFrame(() => {
    const renderModel = () => {
      if (!readyToCapture || captured) return;
      const base2DImage = base2DImageRef.current;
      const canvas2D = canvas2DRef.current;
      const canvas3D = gl.domElement;
      const img = imgRef.current;

      if (!canvas2D || !canvas3D || !img || !base2DImage) {
        console.log('Missing canvas elements');
        return;
      }

      if (base2DImage.width === 0 || base2DImage.height === 0) {
        console.log('Base 2D canvas not ready');
        return;
      }

      const ctx = canvas2D.getContext('2d');
      if (!ctx) return;

      try {
        const glContext = gl.getContext();
        if (glContext.isContextLost()) {
          console.error('WebGL context is lost');
          return;
        }

        gl.render(scene, camera);

        ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);
        ctx.drawImage(base2DImage, 0, 0);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.naturalWidth;
        tempCanvas.height = img.naturalHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        const scaledWidth = canvas3D.width * scale;
        const scaledHeight = canvas3D.height * scale;

        const centerX = (tempCanvas.width / 2) + deltaX;
        const centerY = (tempCanvas.height / 2) + deltaY;

        try {
          tempCtx.save();
          tempCtx.translate(centerX, centerY);
          tempCtx.rotate(Math.PI);
          tempCtx.drawImage(
            canvas3D,
            -scaledWidth / 2,
            -scaledHeight / 2,
            scaledWidth,
            scaledHeight
          );
          tempCtx.restore();
        } catch (drawError) {
          console.error('Failed to draw 3D canvas:', drawError);
          return;
        }

        ctx.drawImage(tempCanvas, 0, 0);
        setCaptured(true);
      } catch (error) {
        console.error('Error capturing 3D canvas:', error);
      }
    }
    renderModel();
    // setTimeout(renderModel, 300);
  });

  return {
    captured,
    setCaptured,
  };
}
