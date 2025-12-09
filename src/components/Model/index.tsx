import React, { useEffect, useRef, useState } from 'react';
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
  targetRadius?: number; // Target radius in normalized coords to match ellipse
  ellipseAxes?: [number, number]; // [semi-major, semi-minor] in pixels
  ellipseAngle?: number; // Ellipse rotation angle in degrees
  imageWidth?: number; // Image width in pixels for normalization
  // New: use standard Three.js coordinates (not normalized [-1,1])
  useStandardCoords?: boolean;
  // Conversion factor when using standard coords: 1 pixel = pixelToWorld units
  pixelToWorld?: number;
}

// Default orientation offsets to align model's clamp with the wheel plane
// These values position the model so its circular clamp faces the camera
const DEFAULT_ROTATION_OFFSETS = {
  z: Math.PI * 0.55,  // ~99° on Z
  y: Math.PI * 0.55,  // ~99° on Y  
  x: Math.PI * 0.05,  // ~9° on X
};

// Fixed scale that works well with this model at normalized coordinates
// Tuned to fit ~26px semi-minor axis ellipse
const BASE_SCALE = 0.009;

export default function Model({
  objPath,
  mtlPath,
  rotation = [0, 0, 0],
  basisVectors,
  quaternion,
  position = [0, 0, 0],
  scale,
  targetRadius,
  ellipseAxes,
  ellipseAngle = 0,
  imageWidth = 640,
  useStandardCoords = false,
  pixelToWorld = 0.01,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [computedScale, setComputedScale] = useState<number>(scale || BASE_SCALE);
  const [modelRadius, setModelRadius] = useState<number>(0);
  const [modelSize, setModelSize] = useState<THREE.Vector3 | null>(null);

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

  // Hide tire parts, center geometry, and measure model radius
  useEffect(() => {
    const tirePartNames = ['wheel', 'rim', 'disk'];

    // Compute bounding box to center the model and determine its size
    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // The model's circular clamp radius (assuming it's in the XY plane of the model)
    // After rotation, this should align with the visible wheel ellipse
    const radius = Math.max(size.x, size.y) / 2;
    setModelRadius(radius);
    setModelSize(size);
    
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

  // Compute scale - use BASE_SCALE as the working default
  // Scale must stay within 0.004 - 0.017 range to look correct (for normalized coords)
  const MIN_SCALE = 0.004;
  const MAX_SCALE = 0.017;
  
  useEffect(() => {
    if (!modelRadius || modelRadius === 0) return;
    
    let newScale: number;
    
    if (useStandardCoords && ellipseAxes && ellipseAxes[0] > 0 && ellipseAxes[1] > 0) {
      // STANDARD COORDINATES MODE
      // Convert ellipse semi-minor axis from pixels to world units
      const semiMinorPixels = Math.min(ellipseAxes[0], ellipseAxes[1]);
      const targetWorldRadius = semiMinorPixels * pixelToWorld;
      
      // Scale model so its radius matches the target world radius
      newScale = targetWorldRadius / modelRadius;
      
      console.log('Model debug (standard coords):', { 
        props: { objPath, position, ellipseAxes, ellipseAngle, pixelToWorld },
        geometry: { modelRadius },
        scaleCalc: { semiMinorPixels, targetWorldRadius, newScale }
      });
      
      setComputedScale(newScale);
    } else {
      // NORMALIZED COORDINATES MODE (legacy)
      newScale = scale || BASE_SCALE;
      
      // If ellipse data is available, scale proportionally from BASE_SCALE
      // Reference: BASE_SCALE works for ~26px semi-minor axis
      if (ellipseAxes && ellipseAxes[0] > 0 && ellipseAxes[1] > 0) {
        const semiMinorPixels = Math.min(ellipseAxes[0], ellipseAxes[1]);
        const referenceAxisPixels = 26;
        const scaleFactor = semiMinorPixels / referenceAxisPixels;
        newScale = BASE_SCALE * scaleFactor;
      }
      
      // Clamp to valid range
      const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
      
      console.log('Model debug (normalized coords):', { 
        props: { objPath, mtlPath, position, scale, targetRadius, ellipseAxes, imageWidth, basisVectors, quaternion },
        geometry: { modelRadius, modelSize: modelSize ? { x: modelSize.x, y: modelSize.y, z: modelSize.z } : null },
        scaleCalc: { BASE_SCALE, MIN_SCALE, MAX_SCALE, newScale, clampedScale },
        rotation: DEFAULT_ROTATION_OFFSETS,
        computedScale: clampedScale
      });
      
      setComputedScale(clampedScale);
    }
  }, [modelRadius, modelSize, ellipseAxes, targetRadius, scale, imageWidth, objPath, mtlPath, position, basisVectors, quaternion, useStandardCoords, pixelToWorld, ellipseAngle]);

  // Apply rotation: default orientation + ellipse angle to match the wheel tilt
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Convert ellipse angle from degrees to radians
    // The ellipse angle describes how the wheel appears tilted in the image
    const ellipseAngleRad = (ellipseAngle * Math.PI) / 180;
    
    // Start with default orientation that aligns clamp to face camera
    groupRef.current.rotation.set(0, 0, 0);
    
    if (quaternion) {
      // Apply quaternion from detection (for wheel orientation)
      groupRef.current.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      // Then apply our default offsets to align the model's clamp
      groupRef.current.rotateZ(DEFAULT_ROTATION_OFFSETS.z);
      groupRef.current.rotateY(DEFAULT_ROTATION_OFFSETS.y);
      groupRef.current.rotateX(DEFAULT_ROTATION_OFFSETS.x);
    } else if (basisVectors) {
      // Build rotation matrix from basis vectors
      const matrix = new THREE.Matrix4();
      matrix.makeBasis(
        new THREE.Vector3(...basisVectors.x_axis),
        new THREE.Vector3(...basisVectors.y_axis),
        new THREE.Vector3(...basisVectors.z_axis)
      );
      groupRef.current.setRotationFromMatrix(matrix);
      // Apply default offsets
      groupRef.current.rotateZ(DEFAULT_ROTATION_OFFSETS.z);
      groupRef.current.rotateY(DEFAULT_ROTATION_OFFSETS.y);
      groupRef.current.rotateX(DEFAULT_ROTATION_OFFSETS.x);
    } else {
      // No detection rotation data, just use default orientation
      groupRef.current.rotateZ(DEFAULT_ROTATION_OFFSETS.z);
      groupRef.current.rotateY(DEFAULT_ROTATION_OFFSETS.y);
      groupRef.current.rotateX(DEFAULT_ROTATION_OFFSETS.x);
    }
    
    // Finally, rotate on Z axis (turntable) to match the ellipse angle
    // This aligns the model's circular clamp with the ellipse tilt
    groupRef.current.rotateZ(ellipseAngleRad);
  }, [basisVectors, quaternion, ellipseAngle]);

  return (
    <group ref={groupRef} position={position}>
      <primitive
        object={obj}
        rotation={quaternion || basisVectors ? undefined : rotation}
        scale={computedScale}
      />
    </group>
  );
}
