import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function setupCameraControl(
  container: HTMLElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  enableZoom: boolean = false
): OrbitControls {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true; // Allow panning
  controls.enableZoom = enableZoom; // Disable or enable zooming based on the argument

  return controls;
}

export function setupCameraMovement(
  camera: THREE.PerspectiveCamera,
  cameraPosition: THREE.Vector3,
  cameraDirection: THREE.Vector3
): {
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
} {
  const handleKeyDown = (event: KeyboardEvent) => {
    // ... (existing keydown handling code)
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    // ... (existing keyup handling code, if needed)
  };

  return { handleKeyDown, handleKeyUp };
}
