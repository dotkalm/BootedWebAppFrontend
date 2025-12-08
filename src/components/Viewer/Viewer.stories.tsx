import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Viewer from './index';
import { oneDetection } from '../../../__tests__/fixtures/one_detection';

const meta: Meta<typeof Viewer> = {
  title: 'Components/Viewer',
  component: Viewer,
  argTypes: {
    mode: {
      control: 'radio',
      options: ['2d', '3d'],
      description: 'Viewer mode: 2D image or 3D model',
    },
    selectedWheel: {
      control: 'radio',
      options: ['primary', 'rear', 'front'],
      description: 'Which wheel to target for 3D overlay',
    },
    scale: {
      control: { type: 'range', min: 0.001, max: 1, step: 0.01 },
      description: 'Override scale (uses backend scale by default)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Viewer>;

// Simple 2D detection visualization
export const WithDetections: Story = {
  args: {
    mode: '2d',
    src: '/output_image_no_ext.jpg',
  },
  render: (args) => {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    useEffect(() => {
      let mounted = true;
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
          console.error('Failed to load image', err);
        });
      return () => {
        mounted = false;
      };
    }, []);

    if (!dataUrl) return <div>Loading image…</div>;

    return (
      <Viewer
        src={dataUrl}
        mode={args.mode}
        detections={oneDetection.detections}
      />
    );
  },
};

// 3D model with backend transforms (rear wheel)
export const ThreeDModelRearWheel: Story = {
  args: {
    mode: '3d',
    objPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj',
    mtlPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl',
    selectedWheel: 'rear',
    src: '/output_image_no_ext.jpg',
  },
  render: (args) => {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    useEffect(() => {
      let mounted = true;
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
          console.error('Failed to load image', err);
        });
      return () => {
        mounted = false;
      };
    }, []);

    if (!dataUrl) return <div>Loading image…</div>;

    return (
      <div>
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e3f2fd' }}>
          <h3>3D Model - Rear Wheel (Primary Target)</h3>
          <p>Using backend-provided 3D transforms (rotation matrix + position + scale)</p>
          <p>Blue box = selected wheel, Red box = other wheel</p>
          <p>Yellow arrow = car direction vector</p>
          <p>RGB arrows = 3D axes (Red=axle, Green=up, Blue=forward)</p>
        </div>
        <Viewer
          src={dataUrl}
          mode={args.mode}
          objPath={args.objPath}
          mtlPath={args.mtlPath}
          selectedWheel={args.selectedWheel}
          scale={args.scale}
          detections={oneDetection.detections}
        />
      </div>
    );
  },
};

// 3D model with backend transforms (front wheel)
export const ThreeDModelFrontWheel: Story = {
  args: {
    mode: '3d',
    objPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj',
    mtlPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl',
    selectedWheel: 'front',
    src: '/output_image_no_ext.jpg',
  },
  render: (args) => {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    useEffect(() => {
      let mounted = true;
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
          console.error('Failed to load image', err);
        });
      return () => {
        mounted = false;
      };
    }, []);

    if (!dataUrl) return <div>Loading image…</div>;

    return (
      <div>
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fff3e0' }}>
          <h3>3D Model - Front Wheel</h3>
          <p>Using backend-provided 3D transforms (rotation matrix + position + scale)</p>
          <p>Blue box = selected wheel (front), Red box = other wheel (rear)</p>
        </div>
        <Viewer
          src={dataUrl}
          mode={args.mode}
          objPath={args.objPath}
          mtlPath={args.mtlPath}
          selectedWheel={args.selectedWheel}
          scale={args.scale}
          detections={oneDetection.detections}
        />
      </div>
    );
  },
};

// Debug story showing transform metadata
export const DebugTransforms: Story = {
  args: {
    mode: '2d',
    src: '/output_image_no_ext.jpg',
  },
  render: (args) => {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    useEffect(() => {
      let mounted = true;
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
          console.error('Failed to load image', err);
        });
      return () => {
        mounted = false;
      };
    }, []);

    if (!dataUrl) return <div>Loading image…</div>;

    const detection = oneDetection.detections[0];
    const rearTransform = detection.rear_wheel_transform;
    const frontTransform = detection.front_wheel_transform;

    return (
      <div>
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', fontFamily: 'monospace', fontSize: '12px' }}>
          <h3>Transform Debug Info</h3>

          <h4>Rear Wheel (Primary):</h4>
          {rearTransform && (
            <>
              <p>Position (normalized): ({rearTransform.position.x.toFixed(3)}, {rearTransform.position.y.toFixed(3)}, {rearTransform.position.z.toFixed(3)})</p>
              <p>Position (pixels): ({rearTransform.position.pixel_x.toFixed(1)}, {rearTransform.position.pixel_y.toFixed(1)})</p>
              <p>Euler Angles: ({rearTransform.rotation.euler_angles.x.toFixed(3)}, {rearTransform.rotation.euler_angles.y.toFixed(3)}, {rearTransform.rotation.euler_angles.z.toFixed(3)})</p>
              <p>Viewing Angle: {rearTransform.rotation.metadata.viewing_angle_deg.toFixed(1)}°</p>
              <p>Ground Angle: {rearTransform.rotation.metadata.ground_angle_deg.toFixed(1)}°</p>
              <p>Scale: {rearTransform.scale.uniform.toFixed(3)}</p>
              <p>Confidence: {rearTransform.confidence.toFixed(3)}</p>
            </>
          )}

          <h4>Front Wheel:</h4>
          {frontTransform && (
            <>
              <p>Position (normalized): ({frontTransform.position.x.toFixed(3)}, {frontTransform.position.y.toFixed(3)}, {frontTransform.position.z.toFixed(3)})</p>
              <p>Position (pixels): ({frontTransform.position.pixel_x.toFixed(1)}, {frontTransform.position.pixel_y.toFixed(1)})</p>
              <p>Scale: {frontTransform.scale.uniform.toFixed(3)}</p>
              <p>Confidence: {frontTransform.confidence.toFixed(3)}</p>
            </>
          )}

          <h4>Car Geometry:</h4>
          <p>Direction (2D): ({detection.car_geometry.direction_2d[0].toFixed(3)}, {detection.car_geometry.direction_2d[1].toFixed(3)})</p>
          <p>Ground Angle: {detection.car_geometry.ground_angle_deg.toFixed(1)}°</p>
          <p>Viewing Side: {detection.car_geometry.viewing_side}</p>
        </div>

        <Viewer
          src={dataUrl}
          mode={args.mode}
          detections={oneDetection.detections}
        />
      </div>
    );
  },
};
