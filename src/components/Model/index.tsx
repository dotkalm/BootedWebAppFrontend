import React, { useEffect, useRef } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { type BasisVectors, type Quaternion } from '@/types';

interface ModelProps {
  objPath: string;
  mtlPath?: string;
  rotation?: [number, number, number];
  basisVectors?: BasisVectors;
  quaternion?: Quaternion;
  position?: [number, number, number];
  scale?: number;
}

export default function Model({
  objPath,
  mtlPath,
  rotation = [0, 0, 0],
  basisVectors,
  quaternion,
  position = [-10, -10, -40],
  scale = .04
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  console.log('Model loading:', { objPath, mtlPath, position, scale, basisVectors, quaternion });

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
  // Also center the geometry so the circular part is at origin
  useEffect(() => {
    const tirePartNames = ['wheel', 'rim', 'disk'];

    // Compute bounding box to center the model
    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    
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
        
        // Center the geometry
        if (child.geometry) {
          child.geometry.translate(-center.x, -center.y, -center.z);
        }
      }
    });
  }, [obj]);

  // Apply rotation from quaternion or basis vectors
  // Priority: quaternion > basisVectors > euler rotation
  // The schema recommends quaternion as most reliable for Three.js
  useEffect(() => {
    if (!groupRef.current) return;
    
    if (quaternion) {
      // Use quaternion (recommended by schema)
      groupRef.current.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    } else if (basisVectors) {
      // Build rotation matrix from basis vectors
      // Basis vectors define the wheel's local coordinate system:
      // x_axis = wheel axle (into car), y_axis = up, z_axis = forward (tangent)
      const matrix = new THREE.Matrix4();
      matrix.makeBasis(
        new THREE.Vector3(...basisVectors.x_axis),
        new THREE.Vector3(...basisVectors.y_axis),
        new THREE.Vector3(...basisVectors.z_axis)
      );
      groupRef.current.setRotationFromMatrix(matrix);
    }
  }, [basisVectors, quaternion]);

  return (
    <group ref={groupRef} position={position}>
      <primitive
        object={obj}
        rotation={quaternion || basisVectors ? undefined : rotation}
        scale={scale}
      />
    </group>
  );
}
