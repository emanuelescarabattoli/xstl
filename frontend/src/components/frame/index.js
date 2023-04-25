/* eslint-disable react-hooks/exhaustive-deps */

import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, Suspense } from 'react'
import style from "./style.module.css"
import Helpers from '../../components/helpers'
import Model from '../../components/model'
import { OrbitControls } from "@react-three/drei"

const defaultSettings = { modelColor: "#cc8800" }

const parseSettings = () => {
  const settingsString = localStorage.getItem("settings");
  if (settingsString) {
    return JSON.parse(settingsString);
  }
  return defaultSettings;
}

const Frame = ({ file, filePath, size }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }, []);

  return (
    <div style={{ width: size, height: size }} ref={containerRef} className={style.mainWrapper}>
      <Canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          {filePath ? <Model file={file} color={parseSettings().modelColor} yOffset={-40} /> : <></>}
          <Helpers cameraPosition={[80, 80, 80]} isBedVisible={false} isVisible={false} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Frame
