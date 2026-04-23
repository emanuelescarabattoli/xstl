import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

const Loader = ({ bedSize = 220, color = "#cc8800" }) => {
  const cubeRef = useRef()
  const size = Math.max(10, bedSize * 0.08)
  const baseHeight = size / 2 + 12

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime

    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.9
      cubeRef.current.rotation.y += delta * 1.2
      cubeRef.current.position.y = baseHeight + Math.sin(elapsed * 2) * 1.2
    }
  })

  return (
    <mesh ref={cubeRef} position={[0, baseHeight, 0]}>
      <pointLight position={[0, 6, 0]} intensity={0.7} color={color} distance={100} />
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.25}
        roughness={0.3}
        transparent
        opacity={0.62}
      />
    </mesh>
  )
}

export default Loader
