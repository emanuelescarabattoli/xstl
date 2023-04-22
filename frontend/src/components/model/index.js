import { useLoader } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

const Model = ({ file, fileName, color }) => {
  const geom = useLoader(STLLoader, file)
  const geomRef = useRef();

  useEffect(() => {
    if (geomRef.current.rotation.x === 0) {
      geomRef.current.rotateX(-Math.PI / 2);
    }
  }, [])

  if (!geom.boundingBox) {
    geom.center()
    geom.computeBoundingBox();
  }

  return (
    <mesh ref={geomRef} position={[0, (geom?.boundingBox?.max.z - geom?.boundingBox?.min.z) / 2, 0,]}>
      <primitive object={geom} attach="geometry" />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Model;