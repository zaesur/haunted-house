import { useFrame } from "@react-three/fiber";
import { FunctionComponent, useRef } from "react";
import { Color, PointLight } from "three";

interface GhostProps {
    color: Color | string;
    onChange: (elapsedTime: number, ghost: PointLight) => void;
}

const Ghost: FunctionComponent<GhostProps> = ({ onChange, ...props }) => {
  const ghostRef = useRef(null);

  useFrame(({ clock }) => {
    if (ghostRef.current) {
      const elapsedTime = clock.getElapsedTime();
      onChange(elapsedTime, ghostRef.current);
    }
  });

  return (
    <pointLight
      intensity={2}
      distance={3}
      castShadow
      shadowCameraFar={7}
      shadowMapHeight={256}
      shadowMapWidth={256}
      ref={ghostRef}
      {...props}
    />
  );
};

const ghosts: Array<{ color: string, onChange: (elapsedTime: number, ghost: PointLight) => void }> = [
  {
    color: "#ff00ff",
    onChange: (elapsedTime, ghost) => {
      const angle = elapsedTime * 0.5;
      ghost.position.x = Math.cos(angle) * 4;
      ghost.position.z = Math.sin(angle) * 4;
      ghost.position.y = Math.sin(elapsedTime * 3);
    },
  },
  {
    color: "#00ffff",
    onChange: (elapsedTime, ghost) => {
      const angle = -elapsedTime * 0.32;
      ghost.position.x = Math.cos(angle) * 5;
      ghost.position.z = Math.sin(angle) * 5;
      ghost.position.y =
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
    },
  },
  {
    color: "#ffff00",
    onChange: (elapsedTime, ghost) => {
      const angle = -elapsedTime * 0.18;
      ghost.position.x = Math.cos(angle) * (7 + Math.sin(elapsedTime * 0.32));
      ghost.position.z = Math.sin(angle) * (7 + Math.sin(elapsedTime * 0.5));
      ghost.position.y =
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
    },
  },
];

const Ghosts: FunctionComponent = () => {
  return (
    <group name="ghosts">
      {ghosts.map((props, i) => (
        <Ghost {...props} key={i} />
      ))}
    </group>
  );
};

export default Ghosts;
