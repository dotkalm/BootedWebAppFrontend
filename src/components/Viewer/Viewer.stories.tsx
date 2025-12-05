import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Viewer from './index';

import testImg from '../../../__tests__/fixtures/output_image_no_ext.jpg';
import detectionResults from '../../../__tests__/fixtures/detection_results.json';

const meta: Meta<typeof Viewer> = {
  title: 'Components/Viewer',
  component: Viewer,
};

export default meta;

type Story = StoryObj<typeof Viewer>;

export const WithDetections: Story = {
  args: {
    src: testImg,
    // detection_results.json contains top-level `detections`
    detections: detectionResults.detections,
  },
};
