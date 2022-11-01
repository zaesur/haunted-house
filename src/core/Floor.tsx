import { useRef, useEffect, FunctionComponent } from "react";
import { Float32BufferAttribute, Mesh, RepeatWrapping } from "three";
import { useTexture } from "@react-three/drei";

const Floor: FunctionComponent = () => {
  const floorRef = useRef<Mesh>(null!);

  const [
    grassColorTexture,
    grassAmbientOcclusionTexture,
    grassNormalTexture,
    grassRoughnessTexture
  ] = useTexture([
    "/textures/grass/color.jpg",
    "/textures/grass/ambientOcclusion.jpg",
    "/textures/grass/normal.jpg",
    "/textures/grass/roughness.jpg",
  ]).map(texture => {
    texture.repeat.set(8, 8);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    return texture;
  });

  useEffect(() => {
    floorRef.current.rotation.x = -Math.PI * 0.5;
    floorRef.current.position.y = 0;

    floorRef.current.geometry.setAttribute(
      "uv2",
      new Float32BufferAttribute(
        floorRef.current.geometry.attributes.uv.array,
        2
      )
    );
  }, []);

  return (
    <mesh receiveShadow ref={floorRef}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#a9c388"
        map={grassColorTexture}
        aoMap={grassAmbientOcclusionTexture}
        normalMap={grassNormalTexture}
        roughnessMap={grassRoughnessTexture}
      />
    </mesh>
  );
};

export default Floor;
