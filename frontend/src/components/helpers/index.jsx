import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from "three";

const Helpers = ({ cameraPosition, isAxesVisible }) => {
  const { camera } = useThree();
  const axesHelper = useMemo(() => new THREE.AxesHelper(2000), []);

  useEffect(() => {
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    camera.lookAt(0, 0, 0);
  }, [camera, cameraPosition])

  return (
    <>
      <ambientLight intensity={0.42} />
      <hemisphereLight intensity={1.0} color="#f7faff" groundColor="#a8b5c1" />
      <directionalLight position={[240, 320, 180]} intensity={1.95} color="#fff8f0" />
      <directionalLight position={[-180, 140, -220]} intensity={0.95} color="#edf5ff" />
      <pointLight position={[0, 180, 0]} intensity={0.75} color="#ffffff" distance={700} />
      <pointLight position={[180, 110, 120]} intensity={0.42} color="#fff8f4" distance={640} />
      <pointLight position={[-180, 90, -140]} intensity={0.36} color="#eaf3ff" distance={640} />
      <group visible={isAxesVisible}>
        <primitive object={axesHelper} />
      </group>
    </>
  );
};

export default Helpers;