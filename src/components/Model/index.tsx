import React, { useEffect } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelProps {
  objPath: string;
  mtlPath?: string;
  rotation?: [number, number, number];
  position?: [number, number, number];
  scale?: number;
}

export default function Model({
  objPath,
  mtlPath,
  rotation = [0, 0, 0],
  position = [-10, -10, -40],
  scale = .04
}: ModelProps) {
  // Load materials if MTL file is provided
  const materials = useLoader(
    MTLLoader,
    mtlPath || '',
    (loader) => {
      // Set the resource path for textures
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

  // Hide tire parts and ensure claw is full opacity
  useEffect(() => {
    const tirePartNames = ['wheel', 'rim', 'disk'];

    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Check if the mesh name includes any tire part keywords
        const meshNameLower = child.name.toLowerCase();
        const isTirePart = tirePartNames.some(part => meshNameLower.includes(part));

        if (isTirePart) {
          // Hide tire parts
          child.visible = false;
        } else if (child.material) {
          // Ensure claw parts are full opacity
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            mat.transparent = false;
            mat.opacity = 1.0;
          });
        }
      }
    });
  }, [obj]);

  return (
    <primitive
      object={obj}
      rotation={rotation}
      position={position}
      scale={scale}
    />
  );
}
