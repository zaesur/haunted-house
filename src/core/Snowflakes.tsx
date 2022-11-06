import { useFrame } from "@react-three/fiber";
import { FunctionComponent, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  InterleavedBufferAttribute,
} from "three";

const isBufferAttribute = (
  attribute: BufferAttribute | InterleavedBufferAttribute
): attribute is BufferAttribute =>
  (attribute as BufferAttribute).isBufferAttribute;

const isY = (index: number): boolean => index % 3 === 1;

const generateRandomCoordinate = (index: number): number =>
  isY(index) ? Math.random() * 5 + 5 : (Math.random() - 0.5) * 15;

interface SnowflakesProps {
  count: number;
}

const Snowflakes: FunctionComponent<SnowflakesProps> = ({ count }) => {
  const geometryRef = useRef<BufferGeometry>(null!);

  const positions = useMemo(() => {
    const raw = new Array(count * 3)
      .fill(0)
      .map((_, i) => generateRandomCoordinate(i));

    return new BufferAttribute(new Float32Array(raw), 3);
  }, [count]);

  const velocities = useMemo(() => {
    const raw = new Array(count * 3)
      .fill(0)
      .map((_, i) =>
        isY(i)
          ? Math.floor(Math.random() * 5 + 1) * -0.3
          : Math.floor(Math.random() * 6 - 3) * 0.1
      );

    return new BufferAttribute(new Float32Array(raw), 3);
  }, [count]);

  useFrame((_, delta) => {
    const { position, velocity } = geometryRef.current.attributes;

    if (isBufferAttribute(position)) {
      position.set(
        new Array(count * 3)
          .fill(0)
          .map((_, i) =>
            isY(i) && position.array[i] < 0
              ? generateRandomCoordinate(i)
              : position.array[i] + velocity.array[i] * delta
          )
      );
    }

    position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" {...positions} />
        <bufferAttribute attach="attributes-velocity" {...velocities} />
      </bufferGeometry>
      <pointsMaterial sizeAttenuation size={0.05} />
    </points>
  );
};

export default Snowflakes;
