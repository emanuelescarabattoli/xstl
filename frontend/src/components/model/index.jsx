import { useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import ErrorBoundary from '../error-boundary';

const Model = ({ file, color, yOffset = 0, isWireframe = false }) => {
  const geom = useLoader(STLLoader, file)
  const geomRef = useRef();

  const modelGeometry = useMemo(() => {
    geom.computeBoundingBox();
    geom.center();
    geom.computeBoundingBox();
    geom.computeVertexNormals();
    return geom;
  }, [geom])

  const modelHeight = useMemo(() => {
    if (!modelGeometry?.boundingBox) return 0;
    return modelGeometry.boundingBox.max.z - modelGeometry.boundingBox.min.z;
  }, [modelGeometry])

  useEffect(() => {
    if (geomRef.current.rotation.x === 0) {
      geomRef.current.rotateX(-Math.PI / 2);
    }
  }, [])

  return (
    <ErrorBoundary>
      <mesh ref={geomRef} geometry={modelGeometry} position={[0, modelHeight / 2 + yOffset, 0]}>
        <meshStandardMaterial
          color={color}
          roughness={0.62}
          metalness={0.08}
          emissive={color}
          emissiveIntensity={0.015}
          wireframe={isWireframe}
        />
      </mesh>
    </ErrorBoundary>
  );
};

export default Model;