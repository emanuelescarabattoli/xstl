/* eslint-disable react-hooks/exhaustive-deps */

import { useLoader } from '@react-three/fiber'
import React, { useRef, useLayoutEffect, useMemo } from 'react'
import * as THREE from "three";

const getGridLines = (bedSize, cellSize) => {
  const result = [];
  for (let index = cellSize; index <= bedSize - cellSize; index += cellSize) {
    result.push([
      {
        start: [bedSize / 2 - index, -.475, -(bedSize / 2 - cellSize)],
        end: [bedSize / 2 - index, -.475, bedSize / 2 - cellSize],
      },
      {
        start: [-(bedSize / 2 - cellSize), -.475, bedSize / 2 - index],
        end: [bedSize / 2 - cellSize, -.475, bedSize / 2 - index],
      }
    ])
  }
  return result
}

const Line = ({ start, end, color }) => {
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
  }, [start, end])

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} transparent opacity={0.72} depthTest={true} toneMapped={false} />
    </line>
  )
}

const Bed = ({ isVisible, bedSize = 220, cellSize = 10, color = "#336592" }) => {
  const logo = useLoader(THREE.TextureLoader, "logo.png");
  const plateThickness = 1
  const plateCornerRadius = Math.max(4, Math.min(16, bedSize * 0.05))
  const logoSize = Math.max(cellSize + 4, Math.round(bedSize * 0.1))
  const logoInset = Math.max(cellSize * 1.25, Math.round(bedSize * 0.06))
  const logoPosition = [bedSize / 2 - logoSize / 2 - logoInset, -0.485, bedSize / 2 - logoSize / 2 - logoInset]

  const plateShape = useMemo(() => {
    const half = bedSize / 2
    const radius = Math.min(plateCornerRadius, half - 1)
    const shape = new THREE.Shape()

    shape.moveTo(-half + radius, -half)
    shape.lineTo(half - radius, -half)
    shape.absarc(half - radius, -half + radius, radius, -Math.PI / 2, 0, false)
    shape.lineTo(half, half - radius)
    shape.absarc(half - radius, half - radius, radius, 0, Math.PI / 2, false)
    shape.lineTo(-half + radius, half)
    shape.absarc(-half + radius, half - radius, radius, Math.PI / 2, Math.PI, false)
    shape.lineTo(-half, -half + radius)
    shape.absarc(-half + radius, -half + radius, radius, Math.PI, Math.PI * 1.5, false)

    return shape
  }, [bedSize, plateCornerRadius])

  const plateExtrudeSettings = useMemo(() => ({ depth: plateThickness, bevelEnabled: false }), [plateThickness])

  const lines = getGridLines(bedSize, cellSize)
  const gridColor = useMemo(() => new THREE.Color(color).offsetHSL(0, 0, 0.2).getStyle(), [color])

  return (
    <group visible={isVisible}>
      <mesh position={logoPosition} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <planeGeometry attach="geometry" args={[logoSize, logoSize]} />
        <meshBasicMaterial map={logo} color={gridColor} transparent opacity={0.42} alphaTest={0.08} toneMapped={false} side={THREE.FrontSide} depthTest={true} depthWrite={false} />
      </mesh>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[plateShape, plateExtrudeSettings]} />
        <meshStandardMaterial
          color={color}
          roughness={0.68}
          metalness={0.06}
          emissive={color}
          emissiveIntensity={0.01}
        />
      </mesh>
      {
        lines.map((line, index) => (
          <React.Fragment key={`grid_lines_${index}`}>
            <Line start={line[0].start} end={line[0].end} color={gridColor} />
            <Line start={line[1].start} end={line[1].end} color={gridColor} />
          </React.Fragment>
        ))
      }
    </group>
  );
};

export default Bed;