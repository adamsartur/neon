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

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Create a floor grid
    const floorGrid = new THREE.GridHelper(800, 60, 0xffffff, 0xffffff);
    floorGrid.position.set(0, -15, 150);
    scene.add(floorGrid);

    // Create a wall grid
    const wallGrid = new THREE.GridHelper(1000, 200, 0xffffff, 0xffffff);
    wallGrid.position.set(0, 489, -200);
    wallGrid.rotation.set(Math.PI / 2, 0, 0);
    scene.add(wallGrid);

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0xe60073 });

    const animate = () => {
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const zPosition = randomRange(
        camera.position.z - 1,
        camera.position.z - 20
      );
      const aspectRatio = width / height;
      const viewWidth =
        2 *
        Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) *
        Math.abs(zPosition);
      const viewHeight = viewWidth / aspectRatio;

      mesh.position.set(
        randomRange(-viewWidth / 2, viewWidth / 2),
        randomRange(-viewHeight / 2, viewHeight / 2),
        zPosition
      );

      const direction = new THREE.Vector3(
        randomRange(-0.05, 0.05),
        randomRange(-0.05, 0.05),
        -randomRange(0.05, 0.15)
      );

      gsap.to(mesh.position, {
        duration: 3,
        x: "+=" + direction.x * 60,
        y: "+=" + direction.y * 60,
        z: "-=" + direction.z * 60,
        onUpdate: () => {
          if (renderer) {
            renderer.render(scene, camera);
          }
        },
        onComplete: () => {
          scene.remove(mesh);
          if (animationRef.current && isRunning) {
            animationRef.current = requestAnimationFrame(animate);
          }
        },
      });
    };

    camera.position.z = 5;

    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      renderer.dispose();
      if (!containerRef.current) {
        return;
      }
      containerRef.current.innerHTML = "";
      cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default Dot3D;
