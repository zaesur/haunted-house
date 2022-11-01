import { useRef, useEffect, FunctionComponent } from "react";
import { Mesh } from "three";

const Floor: FunctionComponent = () => {
  const floorRef = useRef<Mesh>(null!);

  useEffect(() => {
    floorRef.current.rotation.x = -Math.PI * 0.5;
    floorRef.current.position.y = 0;
  }, []);

  return (
    <mesh receiveShadow ref={floorRef}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#a9c388" />
    </mesh>
  );
};

export default Floor;
