import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

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
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    camera.position.set(1, 0, 3); // Change the X position to 10

    const aspectRatio = width / height;
    const viewWidth =
      2 *
      Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) *
      Math.abs(camera.position.z);
    const viewHeight = viewWidth / aspectRatio;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Add light source
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

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
        randomRange(-viewWidth, viewWidth),
        -viewHeight / 2,
        randomRange(camera.position.z - 1, camera.position.z - 20)
      );
      scene.add(glassSquare);
      glassSquares.push(glassSquare);
    }

    // Animate the glass squares
    const animateGlassSquares = () => {
      if (!isRunning) return;

      glassSquares.forEach((glassSquare, index) => {
        glassSquare.position.y += 0.02 * ((index % 5) + 1); // Vary the speed slightly based on the index

        // Reset the position when it leaves the canvas
        if (glassSquare.position.y - glassSquareSize > viewHeight) {
          glassSquare.position.y = -viewHeight - glassSquareSize;
          glassSquare.position.x = randomRange(-viewWidth, viewWidth);
          glassSquare.position.z = randomRange(
            camera.position.z - 1,
            camera.position.z - 20
          );
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animateGlassSquares);
    };

    animateGlassSquares();

    // Create a floor grid
    const floorGrid = new THREE.GridHelper(800, 60, 0xffffff, 0xffffff);
    floorGrid.position.set(0, -15, 150);
    scene.add(floorGrid);

    // Create neon lights for floor grid
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

    return () => {
      renderer.dispose();
      if (!containerRef.current) {
        return;
      }
      containerRef.current.innerHTML = "";
    };
  }, [isRunning]);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default Dot3D;
