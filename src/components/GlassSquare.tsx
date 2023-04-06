import * as THREE from "three";
import { randomRange } from "../utils/utils";

export function createGlassSquares(
  numGlassSquares: number,
  glassSquareSize: number,
  viewWidth: number,
  viewHeight: number,
  cameraZ: number
): THREE.Mesh[] {
  const glassSquares: THREE.Mesh[] = [];
  const glassSquareGeometry = new THREE.BoxGeometry(0.5, glassSquareSize, 0.01);
  const glassSquareMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
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
      randomRange(cameraZ - 1, cameraZ - 40)
    );
    glassSquares.push(glassSquare);
  }

  return glassSquares;
}
