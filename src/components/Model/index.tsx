import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useModelProcessor } from '@/hooks';

interface ModelProps {
  objPath: string;
  mtlPath?: string;
  position?: [number, number, number];
  rotation?: [number, number, number]; 
  baseRotation?: [number, number, number];
  scale?: number;
  showBoundingBox?: boolean;
  tireCenterlineAngle?: number | null;
}

export default function Model({
  objPath,
  mtlPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  baseRotation = [-Math.PI / 2, 0, 0],
  scale = 1,
  showBoundingBox = true,
  tireCenterlineAngle,
}: ModelProps) {

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

  const obj = useLoader(OBJLoader, objPath, (loader) => {
    if (materials) {
      materials.preload();
      loader.setMaterials(materials);
    }
  });

  const modelInfo = useModelProcessor(obj);

  const verticalOffset = modelInfo ? modelInfo.originalSize.y / 2 : 0;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Inner group applies base rotation to normalize model orientation */}
      <group rotation={baseRotation} position={[-13,0,0]}>
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
}
