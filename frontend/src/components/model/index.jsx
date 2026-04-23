import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Billboard, Line, Text } from '@react-three/drei'
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

const FixedSizeBillboardLabel = ({ position, color, text, pixelHeight = 18 }) => {
  const ref = useRef(null)
  const { camera, size } = useThree()
  const worldPositionRef = useRef(new THREE.Vector3())

  useEffect(() => {
    if (!ref.current) return
    if (ref.current.material) {
      ref.current.material.depthTest = false
      ref.current.material.depthWrite = false
      ref.current.material.renderOrder = 1000
    }
  }, [])

  useFrame(() => {
    if (!ref.current) return

    ref.current.getWorldPosition(worldPositionRef.current)
    const distance = camera.position.distanceTo(worldPositionRef.current)
    const scale = getWorldRadiusForPixels(camera, distance, size.height, pixelHeight)
    ref.current.scale.setScalar(Math.max(scale, 0.1))
  })

  return (
    <Billboard ref={ref} position={position} follow>
      <Text
        color={color}
        fontSize={1}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#111111"
      >
        {text}
      </Text>
    </Billboard>
  )
}

const Model = ({ file, color, yOffset = 0, isWireframe = false, isBoundingBoxVisible = false, isMeasureMode = false, measurePoints = [], measureDistance = null, onAddMeasurePoint }) => {
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

  const modelSize = useMemo(() => {
    if (!modelGeometry?.boundingBox) return null
    const size = new THREE.Vector3()
    modelGeometry.boundingBox.getSize(size)
    return size
  }, [modelGeometry])

  const bboxPosition = useMemo(() => [0, modelHeight / 2 + yOffset, 0], [modelHeight, yOffset])

  const bboxEdges = useMemo(() => {
    if (!modelSize) return null
    const boxGeometry = new THREE.BoxGeometry(modelSize.x, modelSize.y, modelSize.z)
    return new THREE.EdgesGeometry(boxGeometry)
  }, [modelSize])

  const bboxLabelPositions = useMemo(() => {
    if (!modelSize) return null

    const offset = 8
    return {
      x: [0, -(modelSize.y / 2 + offset), modelSize.z / 2],
      y: [modelSize.x / 2, 0, modelSize.z / 2 + offset],
      z: [modelSize.x / 2 + offset, modelSize.y / 2, 0]
    }
  }, [modelSize])

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
      {isBoundingBoxVisible && modelSize && bboxEdges ? (
        <group position={bboxPosition} rotation={[-Math.PI / 2, 0, 0]}>
          <lineSegments geometry={bboxEdges}>
            <lineBasicMaterial color={measurementColor} toneMapped={false} />
          </lineSegments>
          {bboxLabelPositions ? (
            <>
              <FixedSizeBillboardLabel
                position={bboxLabelPositions.x}
                color={measurementColor}
                text={`X: ${modelSize.x.toFixed(2)} mm`}
              />
              <FixedSizeBillboardLabel
                position={bboxLabelPositions.y}
                color={measurementColor}
                text={`Y: ${modelSize.y.toFixed(2)} mm`}
              />
              <FixedSizeBillboardLabel
                position={bboxLabelPositions.z}
                color={measurementColor}
                text={`Z: ${modelSize.z.toFixed(2)} mm`}
              />
            </>
          ) : null}
        </group>
      ) : null}
      {measurementVectors.map((point, index) => (
        <MeasurementPin key={`measure-point-${index}`} position={point} color={measurementColor} />
      ))}
      {measurementVectors.length === 2 ? (
        <>
          <Line points={measurementVectors} color={measurementColor} lineWidth={1.5} />
          {measurementMidpoint ? (
            <FixedSizeBillboardLabel
              position={measurementMidpoint.toArray()}
              color={measurementColor}
              text={`${measureDistance?.toFixed(2)} mm`}
            />
          ) : null}
        </>
      ) : null}
    </ErrorBoundary>
  );
};

export default Model;