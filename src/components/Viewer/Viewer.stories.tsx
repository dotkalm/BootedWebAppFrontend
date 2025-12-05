import React, { useEffect, useState } from 'react';
import type { Meta } from '@storybook/react';
import Viewer from './index';
import { detectionResults } from '../../../__tests__/fixtures/detection_results';

const meta: Meta<typeof Viewer> = {
  title: 'Components/Viewer',
  component: Viewer,
};

export default meta;

export const WithDetections = () => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    // Storybook serves files from .storybook staticDirs at the root
    fetch('/output_image_no_ext.jpg')
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (!mounted) return;
          setDataUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load fixture image for story', err);
      });
    return () => {
      mounted = false;
    };
  }, []);
  console.log(dataUrl)

  if (!dataUrl) return <div>Loading fixture image…</div>;

  return <Viewer src={dataUrl} detections={detectionResults.detections} />;
};
