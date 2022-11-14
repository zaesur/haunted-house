import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FunctionComponent, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  RawShaderMaterial,
} from "three";


import vertexShader from "../shaders/snowflake/snowflake.vert";
import fragmentShader from "../shaders/snowflake/snowflake.frag";
import snowflakeTexturePath from "/textures/snowflake.png";

const MIN_X = -15;
const MAX_X = 15;
const MIN_Y = 0;
const MAX_Y = 5;
const MIN_Z = MIN_X;
const MAX_Z = MAX_X;

const MIN_X_SPEED = -0.5;
const MAX_X_SPEED = 0.5;
const MIN_Y_SPEED = -0.25;
const MAX_Y_SPEED = -1;
const MIN_Z_SPEED = MIN_X_SPEED;
const MAX_Z_SPEED = MAX_X_SPEED;

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

interface SnowflakesProps {
  count: number;
}

const Snowflakes: FunctionComponent<SnowflakesProps> = ({ count }) => {
  const geometryRef = useRef<BufferGeometry>(null!);
  const materialRef = useRef<RawShaderMaterial>(null!);
  const texture = useTexture(snowflakeTexturePath);

  const uniforms = useMemo(() => ({
    uSize: { value: 50.0 },
    uTime: { value: 1.0 },
    uColor: { value: new Color("white") },
    uTexture: { value: texture }
  }), [texture])

  const positions = useMemo(() => {
    const raw = new Array(count * 3).fill(0).map(generateRandomCoordinate);

    return new BufferAttribute(new Float32Array(raw), 3);
  }, [count]);

  const velocities = useMemo(() => {
    const raw = new Array(count * 3).fill(0).map(generateRandomVelocity);

    return new BufferAttribute(new Float32Array(raw), 3);
  }, [count]);

  useFrame(({ clock }) => {
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" {...positions} />
        <bufferAttribute attach="attributes-velocity" {...velocities} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
};

export default Snowflakes;
