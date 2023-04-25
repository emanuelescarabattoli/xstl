import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from "three";

const Helpers = ({ cameraPosition, isAxesVisible }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.x = cameraPosition[0];
    camera.position.y = cameraPosition[1];
    camera.position.z = cameraPosition[2];
  }, [camera.position, cameraPosition])

  return (
    <>
      <ambientLight />
      <pointLight position={[200, 200, 200]} intensity={.75} />
      <pointLight position={[-200, 200, -200]} intensity={.75} />
      <pointLight position={[200, 200, -200]} intensity={.75} />
      <pointLight position={[-200, 200, 200]} intensity={.75} />
      <group visible={isAxesVisible}>
        <primitive object={new THREE.AxesHelper(2000)} />
      </group>
    </>
  );
};

export default Helpers;