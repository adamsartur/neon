import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { MathUtils } from "three";
import { createGlassSquares } from "./GlassSquare";
import { randomRange } from "@/utils/utils";

interface Dot3DProps {
  isRunning: boolean;
}
type CustomMesh = THREE.Mesh & {
  currentHex?: number;
};
const Dot3D: React.FC<Dot3DProps> = ({ isRunning }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const hoveredSquare = useRef<CustomMesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);

    // Create a raycaster instance
    const raycaster = new THREE.Raycaster();
    // Create a mouse instance
    const mouse = new THREE.Vector2();

    function handleClick(event: MouseEvent) {
      event.preventDefault();

      // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(glassSquares);

      // Check if any glass square was clicked and log a message
      if (intersects.length > 0) {
        console.log("Clicked on a glass square!");
      }
    }

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    let position = { x: 0, y: 0, z: 5 };
    camera.position.set(position.x, position.y, position.z);
    const cameraPosition = new THREE.Vector3(
      position.x,
      position.y,
      position.z
    );

    const aspectRatio = width / height;
    const viewWidth =
      2 *
      Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) *
      Math.abs(camera.position.z);
    const viewHeight = viewWidth / aspectRatio;

    // Initialize the camera direction vector
    const cameraDirection = new THREE.Vector3(0, 0, -1);

    const handleMouseMove = (event: MouseEvent) => {
      if (event.buttons !== 1) return; // Only allow the left mouse button for dragging

      const deltaX = event.movementX;
      const deltaY = event.movementY;

      // Update the camera rotation based on the mouse movement
      camera.rotation.y -= deltaX * 0.005;
      camera.rotation.x -= deltaY * 0.005;
      camera.rotation.x = Math.max(
        Math.min(camera.rotation.x, Math.PI / 2),
        -Math.PI / 2
      );
    };

    function handleHoveredSquare(event: MouseEvent) {
      event.preventDefault();

      // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(glassSquares);

      // Reset the previous square if there's any
      if (hoveredSquare.current) {
        const currentMaterial = hoveredSquare.current.material;
        if (Array.isArray(currentMaterial)) {
          currentMaterial.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.emissive.setHex(
                hoveredSquare.current!.currentHex ?? 0x000000
              );
            }
          });
        } else if (currentMaterial instanceof THREE.MeshStandardMaterial) {
          currentMaterial.emissive.setHex(
            hoveredSquare.current!.currentHex ?? 0x000000
          );
        }
        hoveredSquare.current = null;
      }

      // Check if any glass square is hovered
      if (intersects.length > 0) {
        hoveredSquare.current = intersects[0].object as CustomMesh;

        // Add the type assertion for the material
        const currentMaterial = hoveredSquare.current.material;
        if (Array.isArray(currentMaterial)) {
          currentMaterial.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              // Store the current emissive color
              hoveredSquare.current!.currentHex = material.emissive.getHex();

              // Set a new emissive color to make the square shine
              material.emissive.setHex(0xffa500);
            }
          });
        } else if (currentMaterial instanceof THREE.MeshStandardMaterial) {
          // Store the current emissive color
          hoveredSquare.current.currentHex = currentMaterial.emissive.getHex();

          // Set a new emissive color to make the square shine
          currentMaterial.emissive.setHex(0xffa500);
        }
      }
    }

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
    const numGlassSquares = 30;
    const glassSquareSize = 5;
    const glassSquares = createGlassSquares(
      numGlassSquares,
      glassSquareSize,
      viewWidth,
      viewHeight,
      camera.position.z
    );
    glassSquares.forEach((glassSquare) => {
      scene.add(glassSquare);
    });

    // Animate the glass squares
    const animateGlassSquares = () => {
      if (!isRunning) return;

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
      if (hoveredSquare) {
        if (hoveredSquare.current) {
          hoveredSquare.current.rotation.x += 0.05;
          hoveredSquare.current.rotation.y += 0.05;
        }
      }
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

    renderer.domElement.addEventListener("mousemove", handleHoveredSquare);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);
    // Clean up event listeners when component unmounts
    return () => {
      renderer.dispose();
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove); // Clean up the mousemove event listener
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.domElement.removeEventListener("mousemove", handleHoveredSquare);

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
