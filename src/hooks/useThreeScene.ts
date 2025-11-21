import { useEffect, useRef, RefObject } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { type BoundingBox } from '@/types';

interface UseThreeSceneProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  boundingBoxes: BoundingBox[];
}

/**
 * Hook to render 3D tire boot models on detected tires using Three.js
 *
 * The bounding box dimensions determine:
 * - Position: centered on the bounding box
 * - Scale: proportional to bounding box size
 * - Rotation: based on width/height ratio to match tire angle
 */
export function useThreeScene({
  canvasRef,
  videoRef,
  boundingBoxes,
}: UseThreeSceneProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up orthographic camera to match video dimensions
    const aspect = video.videoWidth / video.videoHeight;
    const frustumSize = video.videoHeight;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Set up renderer with transparency
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(video.videoWidth, video.videoHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 2);
    scene.add(directionalLight);

    // Initialize texture loader
    textureLoaderRef.current = new THREE.TextureLoader();

    // Load the 3D model
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('/models/tire-boot/');

    mtlLoader.load('Security_Tire_Claw_Boot_max_convert.mtl', (materials) => {
      materials.preload();

      // Load textures
      const textureLoader = textureLoaderRef.current!;
      const diffuseMap = textureLoader.load('/models/tire-boot/wheel_lock_2_diffuse.png');
      const normalMap = textureLoader.load('/models/tire-boot/wheel_lock_2_normal.png');
      const specularMap = textureLoader.load('/models/tire-boot/wheel_lock_2_specular.png');
      const glossinessMap = textureLoader.load('/models/tire-boot/Swheel_lock_2_glossiness.png');

      // Apply textures to materials
      Object.values(materials.materials).forEach((material: any) => {
        if (material.map) material.map = diffuseMap;
        if (material.normalMap) material.normalMap = normalMap;
        if (material.specularMap) material.specularMap = specularMap;

        // Convert glossiness to roughness for standard material
        material.roughnessMap = glossinessMap;
        material.needsUpdate = true;
      });

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('/models/tire-boot/');

      objLoader.load('Security_Tire_Claw_Boot_max_convert.obj', (object) => {
        modelRef.current = object;
        console.log('3D tire boot model loaded successfully');
      }, undefined, (error) => {
        console.error('Error loading OBJ model:', error);
      });
    }, undefined, (error) => {
      console.error('Error loading MTL file:', error);
    });

    // Cleanup
    return () => {
      renderer.dispose();
      scene.clear();
    };
  }, [canvasRef, videoRef]);

  // Render loop - update models based on bounding boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const baseModel = modelRef.current;

    if (!canvas || !video || !scene || !camera || !renderer || !baseModel) return;

    // Update canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    renderer.setSize(video.videoWidth, video.videoHeight);

    // Clear previous models from scene (except lights)
    const objectsToRemove = scene.children.filter(child => child.type === 'Group');
    objectsToRemove.forEach(obj => scene.remove(obj));

    // Add a model instance for each bounding box
    boundingBoxes.forEach((box) => {
      const modelClone = baseModel.clone();

      // Calculate position (center of bounding box)
      // Convert from top-left origin to center origin
      const centerX = (box.x1 + box.x2) / 2 - video.videoWidth / 2;
      const centerY = -(box.y1 + box.y2) / 2 + video.videoHeight / 2; // Flip Y axis

      // Calculate rotation based on aspect ratio
      // Wider boxes = more horizontal tire = more rotation
      const aspectRatio = box.width / box.height;
      const rotationY = Math.atan((aspectRatio - 1) * 0.8); // Adjust rotation sensitivity

      // Calculate scale based on bounding box size
      // Assuming the model's default size is around 1 unit
      const scale = Math.min(box.width, box.height) / 100; // Adjust denominator based on model size

      modelClone.position.set(centerX, centerY, 0);
      modelClone.rotation.y = rotationY;
      modelClone.scale.set(scale, scale, scale);

      scene.add(modelClone);
    });

    // Render the scene
    renderer.render(scene, camera);

  }, [canvasRef, videoRef, boundingBoxes]);
}
