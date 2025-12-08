import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Viewer from './index';
import { detectionResults } from '../../../__tests__/fixtures/detection_results';

const meta: Meta<typeof Viewer> = {
  title: 'Components/Viewer',
  component: Viewer,
  argTypes: {
    mode: {
      control: 'radio',
      options: ['2d', '3d'],
      description: 'Viewer mode: 2D image or 3D model',
    },
    rotationX: {
      control: { type: 'range', min: -Math.PI, max: Math.PI, step: 0.1 },
      description: 'Rotation around X axis (radians)',
    },
    rotationY: {
      control: { type: 'range', min: -Math.PI, max: Math.PI, step: 0.1 },
      description: 'Rotation around Y axis (radians)',
    },
    rotationZ: {
      control: { type: 'range', min: -Math.PI, max: Math.PI, step: 0.1 },
      description: 'Rotation around Z axis (radians)',
    },
    positionX: {
      control: { type: 'range', min: -10, max: 10, step: 0.1 },
      description: 'Position on X axis',
    },
    positionY: {
      control: { type: 'range', min: -10, max: 10, step: 0.1 },
      description: 'Position on Y axis',
    },
    positionZ: {
      control: { type: 'range', min: -10, max: 10, step: 0.1 },
      description: 'Position on Z axis',
    },
    scale: {
      control: { type: 'range', min: 0.001, max: 1, step: 0.01 },
      description: 'Scale of the model',
    },
    detectionIndex: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
      description: 'Which detection to align with (0-based index)',
    },
    autoAlign: {
      control: 'boolean',
      description: 'Automatically align model with selected detection',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Viewer>;

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

    if (!dataUrl) return <div>Loading fixture image…</div>;

    return (
        <Viewer
            src={dataUrl}
            detections={detectionResults.detections}
        />
    );
};

export const ThreeDModel: Story = {
    args: {
        mode: '3d',
        objPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj',
        mtlPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl',
        rotationX: -1.44159265358979,
        rotationY: -0.041592653589793,
        rotationZ: -1.54159265358979,
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        scale: 0.07,
        src: "/output_image_no_ext.jpg",
        detectionIndex: 0,
        autoAlign: false
    },
    render: (args) => {
        const rotation: [number, number, number] = [
            args.rotationX ?? 0,
            args.rotationY ?? 0,
            args.rotationZ ?? 0,
        ];
        const position: [number, number, number] = [
            args.positionX ?? 0,
            args.positionY ?? 0,
            args.positionZ ?? 0,
        ];
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

        if (!dataUrl) return <div>Loading fixture image…</div>;


        return (
            <Viewer
                src={dataUrl}
                mode={args.mode}
                objPath={args.objPath}
                mtlPath={args.mtlPath}
                rotation={rotation}
                position={position}
                scale={args.scale ?? 1}
                detections={detectionResults.detections}
                detectionIndex={args.detectionIndex ?? 0}
                autoAlign={args.autoAlign ?? false}
            />
        );
    },
};
