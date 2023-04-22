/* eslint-disable react-hooks/exhaustive-deps */

import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, Suspense, useState } from 'react'
import style from "./style.module.css"
import { OrbitControls } from "@react-three/drei"
import Bed from '../../components/bed'
import Helpers from '../../components/helpers'
import Model from '../../components/model'
import Controls from '../../components/controls'

const Application = () => {
  const [file, setFile] = useState("cube.stl")
  const [fileName, setFileName] = useState("cube.stl")
  const [isBedVisible, setIsBedVisible] = useState(true)
  const [isAxesVisible, setIsAxesVisible] = useState(false)
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState([100, 100, 100])
  const [color, setColor] = useState("#cc8800")

  useEffect(() => {
    const getArgvFile = async () => {
      const argsFile = await window.electronAPI.getArgvFile()
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        console.log(reader.result)
        setFile(reader.result);
        setFileName(argsFile.name)
      }, false);
      reader.readAsDataURL(new Blob([argsFile.content], { type: "model/stl" }));
    }
    const container = containerRef.current;
    const canvas = canvasRef.current;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    getArgvFile()
  }, []);

  const onChange = event => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setFile(reader.result);
    }, false);
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
      setFileName(event.target.files[0].name)
    }
  }

  const onClickZoomIn = () => {
    setCameraPosition(value => [value[0] - 10, value[1] - 10, value[2] - 10])
  }

  const onClickZoomOut = () => {
    setCameraPosition(value => [value[0] + 10, value[1] + 10, value[2] + 10])
  }

  const onClickSideX = () => {
    setCameraPosition(() => [0, 0, 1100])
  }

  const onClickSideY = () => {
    setCameraPosition(() => [0, 100, 0])
  }

  const onClickSideZ = () => {
    setCameraPosition(() => [100, 0, 0])
  }

  const onClickResetPosition = () => {
    setCameraPosition(() => [100, 100, 100])
  }

  const onClickChangeColor = value => {
    setColor(value)
  }

  const onClickZoomBed = () => setIsBedVisible(value => !value)

  const onClickZoomAxes = () => setIsAxesVisible(value => !value)

  return (
    <div ref={containerRef} className={style.mainWrapper}>
      <Controls
        onChange={onChange}
        onClickZoomBed={onClickZoomBed}
        onClickZoomAxes={onClickZoomAxes}
        onClickZoomIn={onClickZoomIn}
        onClickZoomOut={onClickZoomOut}
        onClickSideX={onClickSideX}
        onClickSideY={onClickSideY}
        onClickSideZ={onClickSideZ}
        onClickResetPosition={onClickResetPosition}
        onClickChangeColor={onClickChangeColor}
      />
      <Canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}>
        {fileName ? (
          <Suspense fallback={null}>
            <Bed bedSize={220} cellSize={10} isVisible={isBedVisible} />
            <Model file={file} fileName={fileName} color={color} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <Helpers cameraPosition={cameraPosition} isBedVisible={isBedVisible} isVisible={isAxesVisible} />
          </Suspense>
        ) : <></>}
      </Canvas>
    </div>
  )
}

export default Application
