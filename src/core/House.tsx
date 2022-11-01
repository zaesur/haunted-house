import { useEffect, useRef, FunctionComponent, ReactNode } from "react";
import { useTexture } from "@react-three/drei";
import {
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
} from "three";

const bushGeometry = new SphereGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({ color: "#89c854" });

interface BushProps {
  position: [number, number, number];
  scale: number;
}

const Bush: FunctionComponent<BushProps> = ({ position, scale }) => {
  const bushRef = useRef<Mesh>(null!);

  useEffect(() => {
    bushRef.current.scale.set(scale, scale, scale);
    bushRef.current.position.set(...position);
  }, [position, scale]);

  return (
    <mesh
      castShadow
      ref={bushRef}
      geometry={bushGeometry}
      material={bushMaterial}
    />
  );
};

const bushes: Array<BushProps> = [
  { position: [0.8, 0.2, 2.2], scale: 0.5 },
  { position: [1.4, 0.1, 2.1], scale: 0.25 },
  { position: [-0.8, 0.1, 2.2], scale: 0.4 },
  { position: [-1, 0.05, 2.6], scale: 0.15 },
];

interface HouseProps {
  children?: ReactNode;
}

const House: FunctionComponent<HouseProps> = ({ children }) => {
  const [
    doorColorTexture,
    doorAlphaTexture,
    doorAmbientOcclusionTexture,
    doorHeightTexture,
    doorNormalTexture,
    doorMetalnessTexture,
    doorRoughnessTexture,
    bricksColorTexture,
    bricksAmbientOcclusionTexture,
    bricksNormalTexture,
    bricksRoughnessTexture,
  ] = useTexture([
    "/textures/door/color.jpg",
    "/textures/door/alpha.jpg",
    "/textures/door/ambientOcclusion.jpg",
    "/textures/door/height.jpg",
    "/textures/door/normal.jpg",
    "/textures/door/metalness.jpg",
    "/textures/door/roughness.jpg",
    "/textures/bricks/color.jpg",
    "/textures/bricks/ambientOcclusion.jpg",
    "/textures/bricks/normal.jpg",
    "/textures/bricks/roughness.jpg",
  ]);

  const wallsRef = useRef<Mesh>(null!);
  const wallsWidth = 4;
  const wallsHeight = 2.5;

  const roofRef = useRef<Mesh>(null!);
  const roofWidth = 3.5;
  const roofHeight = 1;

  const doorRef = useRef<Mesh>(null!);
  const doorSize = 2.2;

  useEffect(() => {
    wallsRef.current.position.y = wallsHeight * 0.5;

    wallsRef.current.geometry.setAttribute(
      "uv2",
      new Float32BufferAttribute(
        wallsRef.current.geometry.attributes.uv.array,
        2
      )
    );
  }, []);

  useEffect(() => {
    roofRef.current.position.y = wallsHeight + roofHeight / 2;
    roofRef.current.rotation.y = Math.PI * 0.25;
  }, []);

  useEffect(() => {
    doorRef.current.position.z = wallsWidth / 2 + 0.01;
    doorRef.current.position.y = doorSize / 2;

    doorRef.current.geometry.setAttribute(
      "uv2",
      new Float32BufferAttribute(
        doorRef.current.geometry.attributes.uv.array,
        2
      )
    );
  }, []);

  return (
    <group name="house">
      <mesh castShadow ref={wallsRef}>
        <boxGeometry args={[wallsWidth, wallsHeight, wallsWidth]} />
        <meshStandardMaterial
          color="#ac8e28"
          map={bricksColorTexture}
          aoMap={bricksAmbientOcclusionTexture}
          normalMap={bricksNormalTexture}
          roughnessMap={bricksRoughnessTexture}
        />
      </mesh>

      <mesh ref={roofRef}>
        <coneGeometry args={[roofWidth, roofHeight, 4]} />
        <meshStandardMaterial color="#b35f45" />
      </mesh>

      <mesh ref={doorRef}>
        <planeGeometry args={[doorSize, doorSize, 100, 100]} />
        <meshStandardMaterial
          color="#aa7b7b"
          transparent
          map={doorColorTexture}
          alphaMap={doorAlphaTexture}
          aoMap={doorAmbientOcclusionTexture}
          displacementMap={doorHeightTexture}
          displacementScale={0.1}
          normalMap={doorNormalTexture}
          metalnessMap={doorMetalnessTexture}
          roughnessMap={doorRoughnessTexture}
        />
      </mesh>

      {bushes.map((props, i) => (
        <Bush key={i} {...props} />
      ))}
      {children}
    </group>
  );
};

export default House;
