import { useEffect, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelProps {
  objPath: string;
  mtlPath?: string;
  position?: [number, number, number];
  rotation?: [number, number, number]; // [x, y, z] in radians - applied AFTER baseRotation
  baseRotation?: [number, number, number]; // [x, y, z] in radians - normalizes model orientation first
  scale?: number;
  showBoundingBox?: boolean;
}

interface ModelInfo {
  originalCenter: THREE.Vector3;
  originalSize: THREE.Vector3;
  originalMin: THREE.Vector3;
  originalMax: THREE.Vector3;
  meshNames: string[];
}

export default function Model({
  objPath,
  mtlPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  baseRotation = [-Math.PI / 2, 0, 0], // Default: convert Z-up to Y-up
  scale = 1,
  showBoundingBox = true,
}: ModelProps) {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  
  // Load materials if MTL file is provided
  const materials = useLoader(
    MTLLoader,
    mtlPath || '',
    (loader) => {
      if (mtlPath) {
        const basePath = mtlPath.substring(0, mtlPath.lastIndexOf('/') + 1);
        loader.setResourcePath(basePath);
        loader.setMaterialOptions({ side: THREE.DoubleSide });
      }
    }
  );

  // Load OBJ with materials
  const obj = useLoader(OBJLoader, objPath, (loader) => {
    if (materials) {
      materials.preload();
      loader.setMaterials(materials);
    }
  });

  // Analyze and center the model
  useEffect(() => {
    const tirePartNames = ['wheel', 'rim', 'disk'];
    const meshNames: string[] = [];

    // Compute ORIGINAL bounding box before any modifications
    const originalBox = new THREE.Box3().setFromObject(obj);
    const originalCenter = originalBox.getCenter(new THREE.Vector3());
    const originalSize = originalBox.getSize(new THREE.Vector3());
    const originalMin = originalBox.min.clone();
    const originalMax = originalBox.max.clone();

    // Log detailed model info
    console.log('=== MODEL GEOMETRY INFO ===');
    console.log('Original Bounding Box:');
    console.log('  Min:', { x: originalMin.x, y: originalMin.y, z: originalMin.z });
    console.log('  Max:', { x: originalMax.x, y: originalMax.y, z: originalMax.z });
    console.log('  Center:', { x: originalCenter.x, y: originalCenter.y, z: originalCenter.z });
    console.log('  Size:', { x: originalSize.x, y: originalSize.y, z: originalSize.z });

    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshNames.push(child.name || '(unnamed)');
        const meshNameLower = child.name.toLowerCase();
        const isTirePart = tirePartNames.some(part => meshNameLower.includes(part));

        if (isTirePart) {
          child.visible = false;
          console.log('  Hidden (tire part):', child.name);
        } else {
          console.log('  Visible mesh:', child.name);
        }

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

    console.log('Mesh names:', meshNames);
    console.log('===========================');

    setModelInfo({
      originalCenter,
      originalSize,
      originalMin,
      originalMax,
      meshNames,
    });
  }, [obj]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Inner group applies base rotation to normalize model orientation */}
      <group rotation={baseRotation}>
        <primitive object={obj} />
      
        {/* Bounding box visualization */}
        {showBoundingBox && modelInfo && (
          <box3Helper
            args={[
              new THREE.Box3(
                new THREE.Vector3(
                  -modelInfo.originalSize.x / 2,
                  -modelInfo.originalSize.y / 2,
                  -modelInfo.originalSize.z / 2
                ),
                new THREE.Vector3(
                  modelInfo.originalSize.x / 2,
                  modelInfo.originalSize.y / 2,
                  modelInfo.originalSize.z / 2
                )
              ),
              new THREE.Color(0xffff00)
            ]}
          />
        )}
      </group>
    </group>
  );
}
