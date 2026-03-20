import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/config/animations';

const CAMERA_TARGET: [number, number, number] = [73.62, 19.60, -32.80];

// Component to set camera target
function CameraTarget() {
  const { camera } = useThree();

  useFrame(() => {
    camera.lookAt(new THREE.Vector3(...CAMERA_TARGET));
  });

  return null;
}

const objPath = "/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj";
const mtlPath = "/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl";
const basePosition: [number, number, number] = [-90, -90, 0];

interface TireModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  baseRotation?: [number, number, number];
  scale?: number;
  onLoaded?: () => void;
}

function TireModel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  baseRotation = [-Math.PI / 2, 0, 0],
  scale = 1,
  onLoaded,
}: TireModelProps) {
  const materials = useLoader(
    MTLLoader,
    mtlPath,
    (loader) => {
      const basePath = mtlPath.substring(0, mtlPath.lastIndexOf('/') + 1);
      loader.setResourcePath(basePath);
      loader.setMaterialOptions({ side: THREE.DoubleSide });
    }
  );

  const obj = useLoader(OBJLoader, objPath, (loader) => {
    if (materials) {
      materials.preload();
      loader.setMaterials(materials);
    }
  });

  const [verticalOffset, setVerticalOffset] = useState(0);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (!obj || processed) return;

    const tirePartNames = ['wheel', 'rim', 'disk'];
    const originalBox = new THREE.Box3().setFromObject(obj);
    const originalCenter = originalBox.getCenter(new THREE.Vector3());
    const originalSize = originalBox.getSize(new THREE.Vector3());

    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshNameLower = child.name.toLowerCase();
        const isTirePart = tirePartNames.some(part => meshNameLower.includes(part));

        // Hide tire parts (wheel, rim, disk)
        if (isTirePart) {
          child.visible = false;
        }

        // Set materials to be opaque
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            mat.transparent = false;
            mat.opacity = 1.0;
          });
        }

        // Center the geometry so model origin is at its center
        if (child.geometry) {
          child.geometry.translate(-originalCenter.x, -originalCenter.y, -originalCenter.z);
        }
      }
    });

    setVerticalOffset(originalSize.y / 2);
    setProcessed(true);

    // Notify parent that model is loaded
    if (onLoaded) {
      onLoaded();
    }
  }, [obj, processed, onLoaded]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group rotation={baseRotation} position={basePosition}>
        <group position={[0, verticalOffset, 0]}>
          <primitive object={obj} />
        </group>
      </group>
    </group>
  );
}

export default function ThreeScene() {
  const [modelLoaded, setModelLoaded] = useState(false);

  return (
    <motion.div
      initial="hidden"
      animate={modelLoaded ? "visible" : "hidden"}
      variants={fadeInUp}
      style={{
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
      }}
    >
      <Canvas
        dpr={1}
        gl={{ alpha: true, preserveDrawingBuffer: true }}
        camera={{
          far: 1000,
          fov: 50,
          near: 0.1,
          position: [103.32, -38.39, 110.14],
        }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient light for overall scene illumination */}
        <ambientLight intensity={.3} />
        {/* Main directional light (simulating sun/outdoor lighting) */}
        <directionalLight
          position={[9, -15, -8]}
          intensity={.01}
        />
        {/* Fill light from opposite side to reduce harsh shadows */}
        <directionalLight
          position={[70, -59, 3]}
          intensity={.1}
        />
        <directionalLight
          position={[-5, 4, 50]}
          intensity={.3}
        />
        {/* Slight rim light for depth */}
        <directionalLight
          position={[-4, -5100, 490]}
          intensity={1}
        />

        <CameraTarget />

        <Suspense fallback={null}>
          <TireModel
            baseRotation={[-2.0138414446088415, 0, 0]}
            position={[0, -8, 0]}
            rotation={[0, 0.6, -3.0432545157094806]}
            scale={0.5}
            onLoaded={() => setModelLoaded(true)}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
