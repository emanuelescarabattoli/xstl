import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import ErrorBoundary from '../error-boundary';
import { getInvertedColor } from '../../utils'

const getWorldRadiusForPixels = (camera, distance, viewportHeight, pixelRadius) => {
  if (camera.isPerspectiveCamera) {
    const verticalFov = THREE.MathUtils.degToRad(camera.fov)
    const worldHeight = 2 * Math.max(distance, 1e-3) * Math.tan(verticalFov / 2)
    return (worldHeight * pixelRadius) / Math.max(viewportHeight, 1)
  }

  if (camera.isOrthographicCamera) {
    const worldHeight = (camera.top - camera.bottom) / Math.max(camera.zoom, 1e-3)
    return (worldHeight * pixelRadius) / Math.max(viewportHeight, 1)
  }

  return 1
}

const MeasurementPin = ({ position, color, pixelRadius = 6 }) => {
  const ref = useRef(null)
  const { camera, size } = useThree()

  useFrame(() => {
    if (!ref.current) return
    const distance = camera.position.distanceTo(ref.current.position)
    const radius = getWorldRadiusForPixels(camera, distance, size.height, pixelRadius)
    ref.current.scale.setScalar(Math.max(radius, 0.35))
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} depthTest={true} depthWrite={true} />
    </mesh>
  )
}

const Model = ({ file, color, yOffset = 0, isWireframe = false, isMeasureMode = false, measurePoints = [], measureDistance = null, onAddMeasurePoint }) => {
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

  const measurementVectors = useMemo(
    () => measurePoints.map(point => new THREE.Vector3(point[0], point[1], point[2])),
    [measurePoints]
  )

  const measurementMidpoint = useMemo(() => {
    if (measurementVectors.length !== 2) return null
    return measurementVectors[0].clone().add(measurementVectors[1]).multiplyScalar(0.5)
  }, [measurementVectors])

  const measurementColor = useMemo(() => getInvertedColor(color), [color])

  const onModelClick = event => {
    if (!isMeasureMode) return
    event.stopPropagation()
    const point = event.point
    onAddMeasurePoint?.([point.x, point.y, point.z])
  }

  return (
    <ErrorBoundary>
      <mesh ref={geomRef} geometry={modelGeometry} position={[0, modelHeight / 2 + yOffset, 0]} onClick={onModelClick}>
        <meshStandardMaterial
          color={color}
          roughness={0.62}
          metalness={0.08}
          emissive={color}
          emissiveIntensity={0.015}
          wireframe={isWireframe}
        />
      </mesh>
      {measurementVectors.map((point, index) => (
        <MeasurementPin key={`measure-point-${index}`} position={point} color={measurementColor} />
      ))}
      {measurementVectors.length === 2 ? (
        <>
          <Line points={measurementVectors} color={measurementColor} lineWidth={1.5} />
          {measurementMidpoint ? (
            <Html position={measurementMidpoint} center>
              <div style={{ background: "#111111dd", color: "#f0f0f0", padding: "4px", borderRadius: "4px", fontSize: "12px", border: "1px solid #555", whiteSpace: "nowrap" }}>
                {measureDistance?.toFixed(2)} mm
              </div>
            </Html>
          ) : null}
        </>
      ) : null}
    </ErrorBoundary>
  );
};

export default Model;