import React, { useEffect, useState } from 'react';
import type { Meta } from '@storybook/react';
import Viewer from './index';
import { oneDetection } from '../../../__tests__/fixtures/one_detection';

const meta: Meta<typeof Viewer> = {
  title: 'Components/Viewer',
  component: Viewer,
};

export default meta;

// Helper to load image as data URL
function useImageDataUrl(path: string) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(path)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (mounted) setDataUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
      })
      .catch(console.error);
    return () => { mounted = false; };
  }, [path]);

  return dataUrl;
}

// 2D detection visualization
export const TwoD = () => {
  const dataUrl = useImageDataUrl('/output_image_no_ext.jpg');
  if (!dataUrl) return <div>Loading…</div>;

  return (
    <Viewer
      src={dataUrl}
      mode="2d"
      detections={oneDetection.detections}
    />
  );
};

// 3D model on rear wheel - minimal props
export const ThreeD = () => {
  const dataUrl = useImageDataUrl('/output_image_no_ext.jpg');
  if (!dataUrl) return <div>Loading…</div>;

  return (
    <Viewer
      src={dataUrl}
      mode="3d"
      selectedWheel="rear"
      objPath="/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj"
      mtlPath="/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl"
      detections={oneDetection.detections}
    />
  );
};
