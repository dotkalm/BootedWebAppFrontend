import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Viewer from './index';
import {
  detectionResults,
  detectionResultTwo,
  detectionResultsThree,
  detectionResultsFour,
  detectionResultsFive,
  detectionResultsSix,
  detectionResultsSeven
} from '../../../__tests__/fixtures/detection_results';

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
        rotationZ: -1.54159265358979 + 1.5707963267948966,
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        scale: 0.02,
        autoAlign: true,
        src: "/output_image_no_ext.jpg",
        detectionIndex: 1,

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

export const AutoAlignedModel: Story = {
    args: {
        mode: '3d',
        objPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj',
        mtlPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl',
        rotationX: -1.44159265358979,
        rotationY: -0.041592653589793,
        rotationZ: -1.54159265358979,
        scale: 0.07,
        src: "/output_image_no_ext.jpg",
        detectionIndex: 0,
        
    },
    render: (args) => {
        const rotation: [number, number, number] = [
            args.rotationX ?? 0,
            args.rotationY ?? 0,
            args.rotationZ ?? 0,
        ];
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
                    console.error('Failed to load fixture image for story', err);
                });
            return () => {
                mounted = false;
            };
        }, []);

        if (!dataUrl) return <div>Loading fixture image…</div>;

        return (
            <div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f0f0f0' }}>
                    <h3>Auto-Alignment Debug Info</h3>
                    <p>Detection Index: {args.detectionIndex}</p>
                    <p>Check console for alignment calculations</p>
                </div>
                <Viewer
                    src={dataUrl}
                    mode={args.mode}
                    objPath={args.objPath}
                    mtlPath={args.mtlPath}
                    rotation={rotation}
                    position={[0, 0, 0]}
                    scale={args.scale ?? 1}
                    detections={detectionResults.detections}
                    detectionIndex={args.detectionIndex ?? 0}
                    autoAlign={true}
                />
            </div>
        );
    },
};

export const LeftWheelAligned: Story = {
    args: {
        mode: '3d',
        objPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj',
        mtlPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl',
        rotationX: -1.44159265358979,
        rotationY: -0.041592653589793,
        rotationZ: -1.54159265358979,
        scale: 0.07,
        
        detectionIndex: 0,
        src: "/image_fixture_20251207_205932.jpg",
    },
    render: (args) => {
        const rotation: [number, number, number] = [
            args.rotationX ?? 0,
            args.rotationY ?? 0,
            args.rotationZ ?? 0,
        ];
        const [dataUrl, setDataUrl] = useState<string | null>(null);

        // Create a detection for just the left wheel
        const leftWheelDetection = [{
            car_id: 0,
            car: detectionResults.detections[0].car,
            wheels: [detectionResults.detections[0].wheels[0]], // Just left wheel
            wheel_count: 1
        }];

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
                    console.error('Failed to load fixture image for story', err);
                });
            return () => {
                mounted = false;
            };
        }, []);

        if (!dataUrl) return <div>Loading fixture image…</div>;

        return (
            <div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e3f2fd' }}>
                    <h3>Left Wheel Auto-Alignment Test</h3>
                    <p>Wheel bbox: x1={detectionResults.detections[0].wheels[0].bbox.x1}, y1={detectionResults.detections[0].wheels[0].bbox.y1}, x2={detectionResults.detections[0].wheels[0].bbox.x2}, y2={detectionResults.detections[0].wheels[0].bbox.y2}</p>
                    <p>Center: ({(detectionResults.detections[0].wheels[0].bbox.x1 + detectionResults.detections[0].wheels[0].bbox.x2) / 2}, {(detectionResults.detections[0].wheels[0].bbox.y1 + detectionResults.detections[0].wheels[0].bbox.y2) / 2})</p>
                </div>
                <Viewer
                    src={dataUrl}
                    mode="3d"
                    objPath={args.objPath}
                    mtlPath={args.mtlPath}
                    rotation={rotation}
                    position={[0, 0, 0]}
                    scale={args.scale ?? 0.07}
                    detections={leftWheelDetection}
                    detectionIndex={0}
                    autoAlign={true}
                />
            </div>
        );
    },
};

// Fixture 2 - Replace with your image and detection data
export const Fixture2: Story = {
    args: {
        mode: '3d',
        objPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj',
        mtlPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl',
        rotationX: -1.44159265358979,
        rotationY: -0.041592653589793,
        rotationZ: -1.54159265358979,
        scale: 0.07,
        
        detectionIndex: 0
    },
    render: (args) => {
        const rotation: [number, number, number] = [
            args.rotationX ?? 0,
            args.rotationY ?? 0,
            args.rotationZ ?? 0,
        ];
        const [dataUrl, setDataUrl] = useState<string | null>(null);

        // TODO: Replace with your fixture data
        const fixture2Detections = detectionResults.detections;

        useEffect(() => {
            let mounted = true;
            // TODO: Replace with your image path
            fetch('/fixture2.jpg')
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
                    console.error('Failed to load fixture2 image', err);
                });
            return () => {
                mounted = false;
            };
        }, []);

        if (!dataUrl) return <div>Loading fixture 2…</div>;

        return (
            <div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fff3e0' }}>
                    <h3>Fixture 2 - Auto-Alignment Test</h3>
                    <p>Replace image at /fixture2.jpg and update detection data</p>
                </div>
                <Viewer
                    src={dataUrl}
                    mode="3d"
                    objPath={args.objPath}
                    mtlPath={args.mtlPath}
                    rotation={rotation}
                    position={[0, 0, 0]}
                    scale={args.scale ?? 0.07}
                    detections={fixture2Detections}
                    detectionIndex={args.detectionIndex ?? 0}
                    
                />
            </div>
        );
    },
};

// Fixture 3
export const Fixture3: Story = {
    args: {
        mode: '3d',
        objPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj',
        mtlPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl',
        rotationX: -1.44159265358979,
        rotationY: -0.041592653589793,
        rotationZ: -1.54159265358979,
        scale: 0.07,
        
        detectionIndex: 0
    },
    render: (args) => {
        const rotation: [number, number, number] = [
            args.rotationX ?? 0,
            args.rotationY ?? 0,
            args.rotationZ ?? 0,
        ];
        const [dataUrl, setDataUrl] = useState<string | null>(null);

        // TODO: Replace with your fixture data
        const fixture3Detections = detectionResults.detections;

        useEffect(() => {
            let mounted = true;
            // TODO: Replace with your image path
            fetch('/fixture3.jpg')
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
                    console.error('Failed to load fixture3 image', err);
                });
            return () => {
                mounted = false;
            };
        }, []);

        if (!dataUrl) return <div>Loading fixture 3…</div>;

        return (
            <div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e8f5e9' }}>
                    <h3>Fixture 3 - Auto-Alignment Test</h3>
                    <p>Replace image at /fixture3.jpg and update detection data</p>
                </div>
                <Viewer
                    src={dataUrl}
                    mode="3d"
                    objPath={args.objPath}
                    mtlPath={args.mtlPath}
                    rotation={rotation}
                    position={[0, 0, 0]}
                    scale={args.scale ?? 0.07}
                    detections={fixture3Detections}
                    detectionIndex={args.detectionIndex ?? 0}
                    
                />
            </div>
        );
    },
};

// Fixture 4
export const Fixture4: Story = {
    args: {
        mode: '3d',
        objPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj',
        mtlPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl',
        rotationX: -1.44159265358979,
        rotationY: -0.041592653589793,
        rotationZ: -1.54159265358979,
        scale: 0.07,
        
        detectionIndex: 0
    },
    render: (args) => {
        const rotation: [number, number, number] = [
            args.rotationX ?? 0,
            args.rotationY ?? 0,
            args.rotationZ ?? 0,
        ];
        const [dataUrl, setDataUrl] = useState<string | null>(null);

        // TODO: Replace with your fixture data
        const fixture4Detections = detectionResults.detections;

        useEffect(() => {
            let mounted = true;
            // TODO: Replace with your image path
            fetch('/fixture4.jpg')
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
                    console.error('Failed to load fixture4 image', err);
                });
            return () => {
                mounted = false;
            };
        }, []);

        if (!dataUrl) return <div>Loading fixture 4…</div>;

        return (
            <div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f3e5f5' }}>
                    <h3>Fixture 4 - Auto-Alignment Test</h3>
                    <p>Replace image at /fixture4.jpg and update detection data</p>
                </div>
                <Viewer
                    src={dataUrl}
                    mode="3d"
                    objPath={args.objPath}
                    mtlPath={args.mtlPath}
                    rotation={rotation}
                    position={[0, 0, 0]}
                    scale={args.scale ?? 0.07}
                    detections={fixture4Detections}
                    detectionIndex={args.detectionIndex ?? 0}
                    
                />
            </div>
        );
    },
};

// Fixture 5
export const Fixture5: Story = {
    args: {
        mode: '3d',
        objPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj',
        mtlPath: '/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl',
        rotationX: -1.44159265358979,
        rotationY: -0.041592653589793,
        rotationZ: -1.54159265358979,
        scale: 0.07,
        
        detectionIndex: 0
    },
    render: (args) => {
        const rotation: [number, number, number] = [
            args.rotationX ?? 0,
            args.rotationY ?? 0,
            args.rotationZ ?? 0,
        ];
        const [dataUrl, setDataUrl] = useState<string | null>(null);

        // TODO: Replace with your fixture data
        const fixture5Detections = detectionResults.detections;

        useEffect(() => {
            let mounted = true;
            // TODO: Replace with your image path
            fetch('/fixture5.jpg')
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
                    console.error('Failed to load fixture5 image', err);
                });
            return () => {
                mounted = false;
            };
        }, []);

        if (!dataUrl) return <div>Loading fixture 5…</div>;

        return (
            <div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fce4ec' }}>
                    <h3>Fixture 5 - Auto-Alignment Test</h3>
                    <p>Replace image at /fixture5.jpg and update detection data</p>
                </div>
                <Viewer
                    src={dataUrl}
                    mode="3d"
                    objPath={args.objPath}
                    mtlPath={args.mtlPath}
                    rotation={rotation}
                    position={[0, 0, 0]}
                    scale={args.scale ?? 0.07}
                    detections={fixture5Detections}
                    detectionIndex={args.detectionIndex ?? 0}
                    
                />
            </div>
        );
    },
};
