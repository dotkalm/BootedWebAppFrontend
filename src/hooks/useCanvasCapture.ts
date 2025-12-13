import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { type TCanvasCaptureProps } from '@/types';

export function useCanvasCapture({
  canvas2DRef, 
  imgRef,
  base2DImageRef,
  deltaX,
  deltaY,
  scale,
  verticalOffset,
}: TCanvasCaptureProps){
  const { gl } = useThree();
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    const renderModel = () => {
      if (captured) return;
      const canvas2D = canvas2DRef.current;
      const img = imgRef.current;
      const canvas3D = gl.domElement;
      const base2DImage = base2DImageRef.current;

      if (!canvas2D || !canvas3D || !img || !base2DImage) {
        console.log('Missing canvas elements');
        return;
      }

      // Check if base2D has content
      if (base2DImage.width === 0 || base2DImage.height === 0) {
        console.log('Base 2D canvas not ready');
        return;
      }

      const ctx = canvas2D.getContext('2d');
      if (!ctx) return;

      try {
        // Check if WebGL context is valid
        const glContext = gl.getContext();
        if (glContext.isContextLost()) {
          console.error('WebGL context is lost');
          return;
        }

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

        // Calculate scaled dimensions
        const scaledWidth = canvas3D.width * scale;
        const scaledHeight = canvas3D.height * scale;

        // Calculate center position with offset
        const centerX = (tempCanvas.width / 2) + deltaX;
        const centerY = (tempCanvas.height / 2) + deltaY;

        // Try to draw scaled 3D canvas centered on rear wheel
        try {
          tempCtx.drawImage(
            canvas3D,
            centerX - scaledWidth / 2,
            centerY - scaledHeight / 2,
            scaledWidth,
            scaledHeight
          );
        } catch (drawError) {
          console.error('Failed to draw 3D canvas:', drawError);
          return;
        }

        // Composite 3D render onto 2D canvas (on top of base content)
        ctx.drawImage(tempCanvas, 0, 0);

        setCaptured(true);
        console.log('3D canvas captured and composited:', {
          deltaX,
          deltaY,
          scale,
          scaledWidth,
          scaledHeight,
          centerX,
          centerY,
        });
      } catch (error) {
        console.error('Error capturing 3D canvas:', error);
      }
    }
    setTimeout(renderModel, 500)
  }, [
    base2DImageRef,
    canvas2DRef,
    captured,
    deltaX,
    deltaY,
    gl,
    imgRef,
    scale,
    setCaptured,
  ]);
  
  return null;
}
