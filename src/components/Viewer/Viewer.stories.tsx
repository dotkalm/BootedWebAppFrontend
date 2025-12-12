import { useEffect, useState } from 'react';
import type { Meta } from '@storybook/react';
import Viewer from './index';
import { 
  oneDetection,
  twoDetection,
} from '../../../__tests__/fixtures/one_detection';

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

// 2D only - image with ellipses and basis vectors
export const TwoD = () => {
  const dataUrl = useImageDataUrl('/output_image_no_ext.jpg');
  if (!dataUrl) return <div>Loading…</div>;

  return (
    <Viewer
      src={dataUrl}
      detections={oneDetection.detections}
    />
  );
};

// With 3D model viewer side-by-side
export const With3DModel = () => {
  const dataUrl = useImageDataUrl('/output_image_no_ext.jpg');
  if (!dataUrl) return <div>Loading…</div>;

  return (
    <Viewer
      src={dataUrl}
      detections={oneDetection.detections}
      objPath="/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj"
      mtlPath="/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl"
    />
  );
};

export const With3DModelTwo = () => {
  const dataUrl = useImageDataUrl('/two.jpg');
  if (!dataUrl) return <div>Loading…</div>;

  return (
    <Viewer
      src={dataUrl}
      detections={twoDetection.detections}
      objPath="/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj"
      mtlPath="/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl"
    />
  );
};