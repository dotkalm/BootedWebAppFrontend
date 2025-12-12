import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useModelProcessor, useCanvasCapture } from '@/hooks';
import type { ModelProps } from '@/types';
import { mod } from 'three/tsl';

export default function Model({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  baseRotation = [-Math.PI / 2, 0, 0],
  scale = 1,
  showBoundingBox = true,
  canvasCaptureProps,
}: ModelProps) {
  const objPath = "/models/tire-boot/Security_Tire_Claw_Boot_max_convert.obj";
  const mtlPath = "/models/tire-boot/Security_Tire_Claw_Boot_max_convert.mtl"

  useCanvasCapture(canvasCaptureProps);

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

  const obj = objPath && useLoader(OBJLoader, objPath, (loader) => {
    if (materials) {
      materials.preload();
      loader.setMaterials(materials);
    }
  });

  const modelInfo = obj && useModelProcessor(obj);

  const verticalOffset = modelInfo ? modelInfo.originalSize.y / 2 : 0;
  console.log(objPath, mtlPath, obj, modelInfo, showBoundingBox)

  return !obj ? null : (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Inner group applies base rotation to normalize model orientation */}
      <group rotation={baseRotation} position={[-13, 0, 0]}>
        {/* Lift model and bounding boxes so bottom sits at y=0 */}
        <group position={[0, verticalOffset, 0]}>
          <primitive object={obj} />

          {/* Overall model bounding box visualization */}
          {showBoundingBox && modelInfo && (
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
