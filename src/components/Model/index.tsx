import { useEffect, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useModelProcessor, useCanvasCapture, } from '@/hooks';
import { basePosition, mtlPath, objPath } from '@/constants';
import type { ModelProps } from '@/types';

export default function Model({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  baseRotation = [-Math.PI / 2, 0, 0],
  scale = 1,
  canvasCaptureProps,
}: ModelProps) {
  const [ modelLoaded, setModelLoaded ] = useState<boolean>(false);

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

  const modelInfo = obj && useModelProcessor(obj);

  const verticalOffset = modelInfo ? modelInfo.originalSize.y / 2 : 0;

  const { invalidate } = useCanvasCapture({ ...canvasCaptureProps, modelLoaded });

  useEffect(() => { 
    if (modelInfo && !modelLoaded) {
      invalidate();
      setModelLoaded(true);
    }
  }, [ modelInfo, modelLoaded ]);

  return !obj ? null : (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Inner group applies base rotation to normalize model orientation */}
      <group rotation={baseRotation} position={basePosition}>
        {/* Lift model and bounding boxes so bottom sits at y=0 */}
        <group position={[0, verticalOffset, 0]}>
          <primitive object={obj} />

          {/* Overall model bounding box visualization */}
          {modelInfo && modelLoaded && (
            <>
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

              {/* Clamp mesh bounding box visualization */}
              {modelInfo.clampBoundingBox && (
                <box3Helper
                  args={[modelInfo.clampBoundingBox, new THREE.Color(0xff00ff)]}
                />
              )}
            </>
          )}
        </group>
      </group>
    </group>
  );
};
