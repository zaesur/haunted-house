import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import Floor from "./Floor";
import House from "./House";
import Graves from "./Graves";
import Ghosts from "./Ghosts";
import Snowflakes from "./Snowflakes";

const Scene = () => {
  const fogColor = "#262837";
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor(fogColor);
  }, [gl]);

  return (
    <>
      <fog attach="fog" color={fogColor} near={1} far={15} />
      <ambientLight color="#b9d5ff" intensity={0.12} />
      <directionalLight
        position={[4, 5, -2]}
        color="#b9d5ff"
        intensity={0.12}
        castShadow
        shadowCameraFar={7}
        shadowMapHeight={256}
        shadowMapWidth={256}
      />

      <House>
        <pointLight
          castShadow
          color="#ff7d46"
          intensity={1}
          distance={7}
          position={[0, 2.2, 2.7]}
        />
      </House>
      <Graves count={100} />
      <Ghosts />
      <Floor />
      <Snowflakes count={500} />
    </>
  );
};

export default Scene;