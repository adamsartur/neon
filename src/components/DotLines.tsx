import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { MathUtils } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

function generateNoiseTexture(size: number, resolution: number) {
  const noiseSize = size * resolution;
  const data = new Uint8Array(noiseSize);
  const noise = new SimplexNoise();

  for (let i = 0; i < noiseSize; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const val = noise.noise(x / resolution, y / resolution);
    data[i] = (val + 1) * 128;
  }

  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.LuminanceFormat
  );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return texture;
}

const auroraVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragmentShader = `
  uniform float time;
  uniform sampler2D noiseTexture;

  varying vec2 vUv;

  vec3 getColor(float intensity) {
    vec3 color = vec3(0.0);
    color.r = smoothstep(0.7, 1.0, intensity);
    color.g = smoothstep(0.4, 0.7, intensity);
    color.b = smoothstep(0.0, 0.4, intensity);
    return color;
  }

  void main() {
    float yOffset = time * 0.02;
    float noise = texture2D(noiseTexture, vUv + vec2(0.0, yOffset)).r;
    float intensity = pow(noise * 2.0, 2.0);
    vec3 color = getColor(intensity) * intensity;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function createAuroraGeometry() {
  const planeGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);
  const planeGeometries = [];

  for (let i = 0; i < 10; i++) {
    const geometry = planeGeometry.clone();
    geometry.translate(0, i * 0.05, 0);
    planeGeometries.push(geometry);
  }

  return BufferGeometryUtils.mergeBufferGeometries(planeGeometries);
}

interface Dot3DProps {
  isRunning: boolean;
}

const Dot3D: React.FC<Dot3DProps> = ({ isRunning }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    let position = { x: 0, y: 0, z: 5 };
    camera.position.set(position.x, position.y, position.z);
    const cameraPosition = new THREE.Vector3(
      position.x,
      position.y,
      position.z
    );
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true; // Allow panning
    controls.enableZoom = false; // Disable zooming

    const aspectRatio = width / height;
    const viewWidth =
      2 *
      Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) *
      Math.abs(camera.position.z);
    const viewHeight = viewWidth / aspectRatio;

    // Initialize the camera direction vector
    const cameraDirection = new THREE.Vector3(0, 0, -1);

    // Add event listeners for keyboard input
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          const direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
          cameraPosition.add(direction.multiplyScalar(0.3));
          camera.position.set(
            cameraPosition.x,
            cameraPosition.y,
            cameraPosition.z
          );
          camera.lookAt(
            cameraPosition.x + cameraDirection.x,
            cameraPosition.y + cameraDirection.y,
            cameraPosition.z + cameraDirection.z
          );

          break;
        case "KeyA":
          const left = new THREE.Vector3(-1, 0, 0);
          left.applyQuaternion(camera.quaternion);
          cameraPosition.add(left.multiplyScalar(0.3));
          camera.position.set(
            cameraPosition.x,
            cameraPosition.y,
            cameraPosition.z
          );
          camera.lookAt(
            cameraPosition.x + cameraDirection.x,
            cameraPosition.y + cameraDirection.y,
            cameraPosition.z + cameraDirection.z
          );

          break;
        case "KeyS":
          const back = new THREE.Vector3();
          camera.getWorldDirection(back);
          cameraPosition.add(back.multiplyScalar(-0.3));
          camera.position.set(
            cameraPosition.x,
            cameraPosition.y,
            cameraPosition.z
          );
          camera.lookAt(
            cameraPosition.x + cameraDirection.x,
            cameraPosition.y + cameraDirection.y,
            cameraPosition.z + cameraDirection.z
          );

          break;
        case "KeyD":
          const right = new THREE.Vector3(1, 0, 0);
          right.applyQuaternion(camera.quaternion);
          cameraPosition.add(right.multiplyScalar(0.3));
          camera.position.set(
            cameraPosition.x,
            cameraPosition.y,
            cameraPosition.z
          );
          camera.lookAt(
            cameraPosition.x + cameraDirection.x,
            cameraPosition.y + cameraDirection.y,
            cameraPosition.z + cameraDirection.z
          );

          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Handle key release if needed
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Add light source
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create a glass square
    const glassSquares: THREE.Mesh[] = [];
    const numGlassSquares = 30;
    const glassSquareSize = 5;
    const glassSquareGeometry = new THREE.BoxGeometry(
      0.5,
      glassSquareSize,
      0.01
    );
    const glassSquareMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00, // Changed to green
      transparent: true,
      opacity: 0.1,
      reflectivity: 0.9,
    });
    for (let i = 0; i < numGlassSquares; i++) {
      const glassSquare = new THREE.Mesh(
        glassSquareGeometry,
        glassSquareMaterial
      );
      glassSquare.position.set(
        randomRange(-viewWidth * 2, viewWidth * 2),
        -viewHeight / 2,
        randomRange(camera.position.z - 1, camera.position.z - 40)
      );
      scene.add(glassSquare);
      glassSquares.push(glassSquare);
    }

    // Generate the noise texture
    const noiseTexture = generateNoiseTexture(256, 1);

    // Create the aurora material
    const auroraMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        noiseTexture: { value: noiseTexture },
      },
      vertexShader: auroraVertexShader,
      fragmentShader: auroraFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // Create the aurora mesh
    const auroraGeometry = createAuroraGeometry();
    const aurora = new THREE.Mesh(auroraGeometry, auroraMaterial);
    aurora.position.set(0, 0, -25);
    aurora.rotation.x = Math.PI / 2;
    //scene.add(aurora);
    //camera.position.set(1, 0, 5);
    // Animate the glass squares
    const animateGlassSquares = () => {
      if (!isRunning) return;

      auroraMaterial.uniforms.time.value += 0.01;

      glassSquares.forEach((glassSquare, index) => {
        glassSquare.position.y += 0.02 * ((index % 13) + 1); // Vary the speed slightly based on the index

        // Reset the position when it leaves the canvas
        if (glassSquare.position.y - glassSquareSize > viewHeight) {
          glassSquare.position.y = -viewHeight - glassSquareSize;
          glassSquare.position.x = randomRange(-viewWidth * 2, viewWidth * 2);
          glassSquare.position.z = randomRange(
            camera.position.z - 1,
            camera.position.z - 50
          );
        }
      });

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animateGlassSquares);
    };

    animateGlassSquares();

    // Create a floor grid
    const floorGrid = new THREE.GridHelper(800, 60, 0xffffff, 0xffffff);
    floorGrid.position.set(0, -15, 150);

    //Create neon lights for floor grid
    const floorLines = floorGrid.geometry;
    const floorLineMaterial = new THREE.LineBasicMaterial({
      color: 0xff00ff,
      linewidth: 2,
      transparent: true,
      opacity: 0.5,
    });
    const floorLineSegments = new THREE.LineSegments(
      floorLines,
      floorLineMaterial
    );
    floorGrid.add(floorLineSegments);
    scene.add(floorGrid);

    // Create a wall grid
    const wallGrid = new THREE.GridHelper(1000, 200, 0xffffff, 0xffffff);
    wallGrid.position.set(0, 489, -200);
    wallGrid.rotation.set(Math.PI / 2, 0, 0);
    scene.add(wallGrid);

    // Create neon lights for wall grid
    const wallLines = wallGrid.geometry;
    const wallLineMaterial = new THREE.LineBasicMaterial({
      color: 0xff00ff,
      linewidth: 2,
      transparent: true,
      opacity: 0.5,
    });
    const wallLineSegments = new THREE.LineSegments(
      wallLines,
      wallLineMaterial
    );
    wallGrid.add(wallLineSegments);

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0xe60073 });

    // Clean up event listeners when component unmounts
    return () => {
      renderer.dispose();
      controls.dispose();
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);

      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
      if (!containerRef.current) {
        return;
      }
      containerRef.current.innerHTML = "";
    };
  }, [isRunning]);

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default Dot3D;
