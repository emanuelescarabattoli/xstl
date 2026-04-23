/* eslint-disable react-hooks/exhaustive-deps */

import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from "three";

const Helpers = ({ cameraPosition, isAxesVisible, isPerspective, orbitRef }) => {
  const { camera, set, size, scene } = useThree();
  const axesHelper = useMemo(() => new THREE.AxesHelper(2000), []);

  useEffect(() => {
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    camera.lookAt(0, 0, 0);
  }, [camera, cameraPosition]);

  useEffect(() => {
    const aspect = Math.max(size.width / size.height, 1e-4);
    const defaultDistance = Math.max(
      1,
      Math.sqrt(
        cameraPosition[0] * cameraPosition[0] +
        cameraPosition[1] * cameraPosition[1] +
        cameraPosition[2] * cameraPosition[2]
      )
    );
    const orthoHalfHeight = defaultDistance * Math.tan((70 * Math.PI) / 360);
    const orthoHalfWidth = orthoHalfHeight * aspect;

    const newCamera = isPerspective
      ? new THREE.PerspectiveCamera(70, aspect, 0.1, 20000)
      : new THREE.OrthographicCamera(
          -orthoHalfWidth,
          orthoHalfWidth,
          orthoHalfHeight,
          -orthoHalfHeight,
          0.1,
          20000
        );

    newCamera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    newCamera.up.copy(camera.up);
    newCamera.lookAt(0, 0, 0);
    newCamera.updateProjectionMatrix();
    set({ camera: newCamera });

    if (orbitRef?.current) {
      orbitRef.current.object = newCamera;
      orbitRef.current.target.set(0, 0, 0);
      orbitRef.current.saveState();
      orbitRef.current.update();
    }
  }, [isPerspective, cameraPosition, size.width, size.height]);

  useEffect(() => {
    const dirLight1 = new THREE.DirectionalLight("#fff8f0", 1.95);
    dirLight1.position.set(240, 320, 180);

    const dirLight2 = new THREE.DirectionalLight("#edf5ff", 0.95);
    dirLight2.position.set(-180, 140, -220);

    const pointLight1 = new THREE.PointLight("#ffffff", 0.75, 700);
    pointLight1.position.set(0, 180, 0);

    const pointLight2 = new THREE.PointLight("#fff8f4", 0.42, 640);
    pointLight2.position.set(180, 110, 120);

    const pointLight3 = new THREE.PointLight("#eaf3ff", 0.36, 640);
    pointLight3.position.set(-180, 90, -140);

    scene.add(camera);
    camera.add(dirLight1, dirLight2, pointLight1, pointLight2, pointLight3);

    return () => {
      camera.remove(dirLight1, dirLight2, pointLight1, pointLight2, pointLight3);
    };
  }, [camera, scene]);

  return (
    <>
      <ambientLight intensity={0.42} />
      <hemisphereLight intensity={1.0} color="#f7faff" groundColor="#a8b5c1" />
      <group visible={isAxesVisible}>
        <primitive object={axesHelper} />
      </group>
    </>
  );
};

export default Helpers;