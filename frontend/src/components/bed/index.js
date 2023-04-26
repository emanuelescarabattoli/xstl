/* eslint-disable react-hooks/exhaustive-deps */

import { useLoader } from '@react-three/fiber'
import React, { useEffect, useRef, useLayoutEffect } from 'react'
import * as THREE from "three";

const getGridLines = (bedSize, cellSize) => {
  const result = [];
  for (let index = cellSize; index <= bedSize - cellSize; index += cellSize) {
    result.push([
      {
        start: [bedSize / 2 - index, .01, -(bedSize / 2 - cellSize)],
        end: [bedSize / 2 - index, .01, bedSize / 2 - cellSize],
      },
      {
        start: [-(bedSize / 2 - cellSize), .01, bedSize / 2 - index],
        end: [bedSize / 2 - cellSize, .01, bedSize / 2 - index],
      }
    ])
  }
  return result
}

const Line = ({ start, end, color }) => {
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
    ref.current.material = new THREE.LineBasicMaterial({ opacity: .5, color, transparent: true })
  }, [start, end])
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} opacity={.1} />
    </line>
  )
}

const Bed = ({ isVisible, bedSize = 220, cellSize = 10, color = "#336592" }) => {
  const logo = useLoader(THREE.TextureLoader, "logo.png");
  const logoRef = useRef();

  useEffect(() => {
    if (logoRef.current.rotation.x === 0) {
      logoRef.current.rotateX(-Math.PI / 2);
    }
  }, [])

  useEffect(() => {
    logoRef.current.material = new THREE.MeshBasicMaterial({ opacity: .5, color, transparent: true, map: logo })
  }, [color])

  const lines = getGridLines(bedSize, cellSize)

  return (
    <group visible={isVisible}>
      <mesh ref={logoRef} position={[bedSize / 2 - 5 - cellSize * 2, .1, bedSize / 2 - 5 - cellSize * 2]}>
        <planeBufferGeometry attach="geometry" args={[24, 24]} />
      </mesh>
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[bedSize, 1, bedSize]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {
        lines.map((line, index) => (
          <React.Fragment key={`grid_lines_${index}`}>
            <Line start={line[0].start} end={line[0].end} color={color} />
            <Line start={line[1].start} end={line[1].end} color={color} />
          </React.Fragment>
        ))
      }
    </group>
  );
};

export default Bed;