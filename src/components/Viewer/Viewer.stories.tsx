import { useEffect, useState } from 'react';
import type { Meta } from '@storybook/react';
import Viewer from './index';
import { 
  fixtureFromScreenshot,
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
  }, [
    path,
    setDataUrl,
  ]);

  return dataUrl;
}

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
    />
  );
};

export const With3DModelFromScreenshot = () => {
  const dataUrl = useImageDataUrl('/fixture_from_screenshot.jpg');
  if (!dataUrl) return <div>Loading…</div>;

  return (
    <Viewer
      src={dataUrl}
      detections={fixtureFromScreenshot.detections}
    />
  );
};