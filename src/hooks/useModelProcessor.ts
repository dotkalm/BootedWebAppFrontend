import { useEffect, useState } from 'react';
import * as THREE from 'three';
import type { ModelInfo } from '@/types';

export function useModelProcessor(obj: THREE.Object3D | null): ModelInfo | undefined{
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
        }

        if (isTirePart) {
          child.visible = false;
        } else {
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

  if(modelInfo) return modelInfo;
}
