import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FunctionComponent, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  InterleavedBufferAttribute,
} from "three";

import snowflakeTexturePath from "/textures/snowflake.png";

const MIN_X = -15;
const MAX_X = 15;
const MIN_Y = 0;
const MAX_Y = 5;
const MIN_Z = MIN_X;
const MAX_Z = MAX_X;

const MIN_X_SPEED = -1;
const MAX_X_SPEED = 1;
const MIN_Y_SPEED = -0.5;
const MAX_Y_SPEED = -2;
const MIN_Z_SPEED = MIN_X_SPEED;
const MAX_Z_SPEED = MAX_X_SPEED;

const isBufferAttribute = (
  attribute: BufferAttribute | InterleavedBufferAttribute
): attribute is BufferAttribute =>
  (attribute as BufferAttribute).isBufferAttribute;

const isY = (index: number): boolean => index % 3 === 1;

const generateNumberFromRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

const generateRandomCoordinate = (_: any, index: number): number => {
  const offset = index % 3;

  return offset === 0
    ? generateNumberFromRange(MIN_X, MAX_X)
    : offset === 1
    ? generateNumberFromRange(MIN_Y, MAX_Y)
    : offset === 2
    ? generateNumberFromRange(MIN_Z, MAX_Z)
    : NaN;
};

const generateRandomVelocity = (_: any, index: number): number => {
  const offset = index % 3;

  return offset === 0
    ? generateNumberFromRange(MIN_X_SPEED, MAX_X_SPEED)
    : offset === 1
    ? generateNumberFromRange(MIN_Y_SPEED, MAX_Y_SPEED)
    : offset === 2
    ? generateNumberFromRange(MIN_Z_SPEED, MAX_Z_SPEED)
    : NaN;
};

const createUpdateCoordinate =
  (position: ArrayLike<number>, velocity: ArrayLike<number>, delta: number) =>
  (_: any, index: number) => {
    const offset = index % 3;
    const coordinate = position[index];
    const isInRange =
      (offset === 0 && coordinate > MIN_X && coordinate < MAX_X) ||
      (offset === 1 && coordinate > MIN_Y && coordinate < MAX_Y) ||
      (offset === 2 && coordinate > MIN_Z && coordinate < MAX_Z);

    return isInRange
      ? coordinate + velocity[index] * delta
      : generateRandomCoordinate(_, index);
  };

interface SnowflakesProps {
  count: number;
}

const Snowflakes: FunctionComponent<SnowflakesProps> = ({ count }) => {
  const geometryRef = useRef<BufferGeometry>(null!);
  const snowflakeTexture = useTexture(snowflakeTexturePath);

  const positions = useMemo(() => {
    const raw = new Array(count * 3).fill(0).map(generateRandomCoordinate);

    return new BufferAttribute(new Float32Array(raw), 3);
  }, [count]);

  const velocities = useMemo(() => {
    const raw = new Array(count * 3).fill(0).map(generateRandomVelocity);

    return new BufferAttribute(new Float32Array(raw), 3);
  }, [count]);

  useFrame((_, delta) => {
    const { position, velocity } = geometryRef.current.attributes;

    if (isBufferAttribute(position)) {
      position.set(
        new Array(count * 3)
          .fill(0)
          .map(createUpdateCoordinate(position.array, velocity.array, delta))
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
      <pointsMaterial
        sizeAttenuation
        transparent
        depthWrite
        size={0.1}
        alphaMap={snowflakeTexture}
      />
    </points>
  );
};

export default Snowflakes;
