import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./App.css";
import { Perf } from "r3f-perf";

function App() {
  return (
    <Canvas
      shadows
      dpr={Math.min(2, window.devicePixelRatio)}
      camera={{ fov: 75, near: 0.1, far: 100, position: [4, 2, 5] }}
    >
      <OrbitControls enableDamping enablePan={false} />
      <Perf minimal openByDefault={false} />
      <Scene />
    </Canvas>
  );
}

export default App;
