// Bounding box coordinates and dimensions
export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

export interface Detection {
  class: string;
  confidence: number;
  bbox: BoundingBox;
}

// 3D Position (normalized coordinates + pixel coordinates)
export interface Position3D {
  x: number;        // Normalized X [-1, 1]
  y: number;        // Normalized Y [-1, 1]
  z: number;        // Estimated depth
  pixel_x: number;  // Center X in pixels
  pixel_y: number;  // Center Y in pixels
}

// Basis vectors for 3D orientation
export interface BasisVectors {
  x_axis: [number, number, number];  // Wheel axle direction (into car)
  y_axis: [number, number, number];  // Up direction
  z_axis: [number, number, number];  // Forward direction (tangent)
}

// Euler angles
export interface EulerAngles {
  x: number;       // Rotation around X-axis (radians)
  y: number;       // Rotation around Y-axis (radians)
  z: number;       // Rotation around Z-axis (radians)
  order: string;   // Rotation order (e.g., "XYZ")
}

// Quaternion
export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

// Rotation metadata
export interface RotationMetadata {
  viewing_angle_rad: number;      // Angle viewing wheel face (radians)
  viewing_angle_deg: number;      // Angle viewing wheel face (degrees)
  ground_angle_rad: number;       // Ground tilt angle (radians)
  ground_angle_deg: number;       // Ground tilt angle (degrees)
  wheel_to_wheel_2d: [number, number]; // 2D wheel-to-wheel direction vector
  viewing_side: "left" | "right"; // Which side of car is visible
  target_wheel: "front" | "rear"; // Which wheel this is for
  ellipse_angle_deg: number;      // Ellipse orientation angle (degrees)
  ellipse_viewing_angle_deg: number; // Ellipse-derived viewing angle (degrees)
  used_ellipse: boolean;          // Whether ellipse data was used
}

// 3D Rotation (multiple representations)
export interface Rotation3D {
  rotation_matrix: [[number, number, number], [number, number, number], [number, number, number]]; // 3x3 column-major matrix
  basis_vectors: BasisVectors;
  euler_angles: EulerAngles;
  quaternion: Quaternion;
  metadata: RotationMetadata;
}

// 3D Scale
export interface Scale3D {
  uniform: number;        // Uniform scale factor for 3D asset
  radius_pixels: number;  // Wheel radius in pixels
}

// Complete wheel transform (position + rotation + scale)
export interface WheelTransform {
  position: Position3D;
  rotation: Rotation3D;
  scale: Scale3D;
  bounding_box: BoundingBox;
  confidence: number;
}

// Wheel positions (front/rear identification)
export interface WheelPositions {
  front: Detection | null;
  rear: Detection | null;
}

// Car geometry information
export interface CarGeometry {
  wheel_to_wheel_2d: [number, number]; // Wheel-to-wheel direction vector
  ground_angle_deg: number;       // Ground tilt in degrees
  viewing_side: "left" | "right"; // Which side is visible
}

// Wheel ellipse fitting result
export interface WheelEllipse {
  center: [number, number];       // Ellipse center [x, y] in pixels
  axes: [number, number];         // Semi-major and semi-minor axes
  angle: number;                  // Ellipse rotation angle (degrees)
  axis_ratio: number;             // Ratio of minor to major axis
  viewing_angle_deg: number;      // Derived viewing angle (degrees)
  confidence: number;             // Ellipse fit confidence
  dark_ring_ratio: number;        // Ratio of dark ring pixels
  avg_brightness: number;         // Average brightness in ellipse
  has_dark_ring: boolean;         // Whether dark ring was detected
  method: string;                 // Fitting method used
}

// Updated car detection with 3D transforms
export interface CarDetection {
  car_id: number;
  car: Detection;
  wheels: Detection[];
  wheel_count: number;
  wheel_positions: WheelPositions;
  rear_wheel_transform: WheelTransform | null;   // Primary target
  rear_wheel_ellipse?: WheelEllipse;             // Rear wheel ellipse fit
  front_wheel_transform: WheelTransform | null;
  front_wheel_ellipse?: WheelEllipse;            // Front wheel ellipse fit
  car_geometry: CarGeometry;
}

// Image dimensions
export interface ImageDimensions {
  width: number;
  height: number;
}

// Complete API response
export interface CarDetectionResponse {
  source?: string;
  image_dimensions?: ImageDimensions;
  total_cars: number;
  detections: CarDetection[];
}
