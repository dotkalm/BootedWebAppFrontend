import { useEffect, useState } from 'react';
import * as THREE from 'three';

interface ModelInfo {
  originalCenter: THREE.Vector3;
  originalSize: THREE.Vector3;
  originalMin: THREE.Vector3;
  originalMax: THREE.Vector3;
  meshNames: string[];
  clampBoundingBox?: THREE.Box3;
}

export function useModelProcessor(obj: THREE.Object3D | null) {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    if (!obj) return;

    const tirePartNames = ['wheel', 'rim', 'disk'];
    const meshNames: string[] = [];
    let clampMesh: THREE.Mesh | null = null;

    const originalBox = new THREE.Box3().setFromObject(obj);
    const originalCenter = originalBox.getCenter(new THREE.Vector3());
    const originalSize = originalBox.getSize(new THREE.Vector3());
    const originalMin = originalBox.min.clone();
    const originalMax = originalBox.max.clone();

    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshNames.push(child.name || '(unnamed)');
        const meshNameLower = child.name.toLowerCase();
        const isTirePart = tirePartNames.some(part => meshNameLower.includes(part));

        // Identify the circular clamp mesh
        if (meshNameLower.includes('disk') || meshNameLower.includes('circle') || meshNameLower.includes('disk_out')) {
          clampMesh = child;
          console.log('  Found clamp mesh:', child.name);
        }

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

    // Compute clamp bounding box AFTER centering
    let clampBox: THREE.Box3 | undefined;
    if (clampMesh) {
      clampBox = new THREE.Box3().setFromObject(clampMesh);
      const clampCenter = clampBox.getCenter(new THREE.Vector3());
      const clampSize = clampBox.getSize(new THREE.Vector3());
    }

    setModelInfo({
      originalCenter,
      originalSize,
      originalMin,
      originalMax,
      meshNames,
      clampBoundingBox: clampBox,
    });
  }, [obj]);

  return modelInfo;
}
