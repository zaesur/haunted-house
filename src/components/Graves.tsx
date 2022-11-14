import { FunctionComponent, useEffect, useRef } from "react";
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";

const graveHeight = 0.8;
const graveGeometry = new BoxGeometry(0.6, graveHeight, 0.2);
const graveMaterial = new MeshStandardMaterial({ color: "#b2b6b1" });

const Grave: FunctionComponent = () => {
  const graveRef = useRef<Mesh>(null!);

  useEffect(() => {
    const coverage = 0.9;
    const bonusAngle = (1 - coverage) * Math.PI;
    const angle = bonusAngle + Math.random() * 2 * Math.PI * coverage;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    graveRef.current.position.set(x, graveHeight * 0.5 * 0.9, z);
    graveRef.current.rotation.y = (Math.random() - 0.5) * 0.4;
    graveRef.current.rotation.z = (Math.random() - 0.5) * 0.4;
  }, []);

  return (
    <mesh
      castShadow
      ref={graveRef}
      geometry={graveGeometry}
      material={graveMaterial}
    />
  );
};

interface GravesProps {
  count: number;
}

const Graves: FunctionComponent<GravesProps> = ({ count }) => {
  return (
    <group>
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <Grave key={i} />
        ))}
    </group>
  );
};

export default Graves;
