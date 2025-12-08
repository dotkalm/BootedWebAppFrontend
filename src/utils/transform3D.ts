import * as THREE from 'three';
import { type WheelTransform, type BasisVectors } from '@/types';

/**
 * Apply a WheelTransform to a Three.js Object3D (mesh, group, etc.)
 * Uses quaternion for rotation (most reliable method)
 */
export function applyWheelTransform(
  object: THREE.Object3D,
  transform: WheelTransform
): void {
  // Set position using normalized coordinates
  object.position.set(
    transform.position.x,
    transform.position.y,
    transform.position.z
  );

  // Set rotation using quaternion (recommended)
  const q = transform.rotation.quaternion;
  object.quaternion.set(q.x, q.y, q.z, q.w);

  // Set uniform scale
  object.scale.setScalar(transform.scale.uniform);
}

/**
 * Get the primary wheel transform from a detection
 * Prioritizes rear wheel, falls back to front wheel
 */
export function getPrimaryWheelTransform(detection: {
  rear_wheel_transform: WheelTransform | null;
  front_wheel_transform: WheelTransform | null;
}): WheelTransform | null {
  return detection.rear_wheel_transform || detection.front_wheel_transform;
}

/**
 * Convert basis vectors to a Three.js Matrix4
 * Useful for visualizing the coordinate system
 */
export function basisVectorsToMatrix4(basis: BasisVectors): THREE.Matrix4 {
  const matrix = new THREE.Matrix4();

  // Set rotation part (3x3) from basis vectors
  // Column 0: X-axis
  matrix.elements[0] = basis.x_axis[0];
  matrix.elements[1] = basis.x_axis[1];
  matrix.elements[2] = basis.x_axis[2];

  // Column 1: Y-axis
  matrix.elements[4] = basis.y_axis[0];
  matrix.elements[5] = basis.y_axis[1];
  matrix.elements[6] = basis.y_axis[2];

  // Column 2: Z-axis
  matrix.elements[8] = basis.z_axis[0];
  matrix.elements[9] = basis.z_axis[1];
  matrix.elements[10] = basis.z_axis[2];

  // Translation (column 3) is identity (0, 0, 0, 1)
  matrix.elements[12] = 0;
  matrix.elements[13] = 0;
  matrix.elements[14] = 0;
  matrix.elements[15] = 1;

  return matrix;
}

/**
 * Extract Euler angles from basis vectors for visualization
 */
export function basisVectorsToEuler(basis: BasisVectors): THREE.Euler {
  const matrix = basisVectorsToMatrix4(basis);
  const euler = new THREE.Euler();
  euler.setFromRotationMatrix(matrix, 'XYZ');
  return euler;
}

/**
 * Convert normalized position to pixel coordinates
 * Useful for debugging or 2D overlay
 */
export function normalizedToPixel(
  x: number,
  y: number,
  imageWidth: number,
  imageHeight: number
): { x: number; y: number } {
  return {
    x: ((x + 1) / 2) * imageWidth,
    y: ((1 - y) / 2) * imageHeight  // Y is flipped in image space
  };
}

/**
 * Convert pixel coordinates to normalized coordinates
 */
export function pixelToNormalized(
  pixelX: number,
  pixelY: number,
  imageWidth: number,
  imageHeight: number
): { x: number; y: number } {
  return {
    x: (pixelX / imageWidth) * 2 - 1,
    y: 1 - (pixelY / imageHeight) * 2  // Flip Y
  };
}

/**
 * Get all wheel transforms from detections (flattened)
 */
export function getAllWheelTransforms(detections: Array<{
  rear_wheel_transform: WheelTransform | null;
  front_wheel_transform: WheelTransform | null;
}>): WheelTransform[] {
  const transforms: WheelTransform[] = [];

  detections.forEach(detection => {
    if (detection.rear_wheel_transform) {
      transforms.push(detection.rear_wheel_transform);
    }
    if (detection.front_wheel_transform) {
      transforms.push(detection.front_wheel_transform);
    }
  });

  return transforms;
}
