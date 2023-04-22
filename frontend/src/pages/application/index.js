/* eslint-disable react-hooks/exhaustive-deps */

import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, Suspense, useState } from 'react'
import style from "./style.module.css"
import { OrbitControls } from "@react-three/drei"
import Bed from '../../components/bed'
import Helpers from '../../components/helpers'
import Model from '../../components/model'
import Controls from '../../components/controls'
import ErrorBoundary from '../../components/error-boundary'
import ModalSettings from '../../components/modal-settings'

const Application = () => {
  const [file, setFile] = useState(undefined)
  const [fileName, setFileName] = useState(undefined)
  const [isBedVisible, setIsBedVisible] = useState(true)
  const [isAxesVisible, setIsAxesVisible] = useState(false)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState([100, 100, 100])
  const [settings, setSetting] = useState({ bedColor: "#336592", modelColor: "#cc8800" })

  useEffect(() => {
    const getArgvFile = async () => {
      const argsFile = await window.electronAPI.getArgvFile()
      if (argsFile) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          console.log(reader.result)
          setFile(reader.result);
          setFileName(argsFile.name)
        }, false);
        reader.readAsDataURL(new Blob([argsFile.content], { type: "model/stl" }));
      }
    }
    const container = containerRef.current;
    const canvas = canvasRef.current;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    getArgvFile()
  }, []);

  const onChangeFile = event => {
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

  const onClickBed = () => setIsBedVisible(value => !value)

  const onClickAxes = () => setIsAxesVisible(value => !value)

  const onClickSettings = () => setIsSettingsVisible(true)

  const onClickCloseSettings = () => setIsSettingsVisible(false)

  const onChangeSettings = (element, value) => {
    const updatedSettings = { ...settings, [element]: value }
    setSetting(updatedSettings)
  }


  return (
    <div ref={containerRef} className={style.mainWrapper}>
      <ErrorBoundary>
        <Controls
          fileName={fileName}
          onChangeFile={onChangeFile}
          onClickBed={onClickBed}
          onClickAxes={onClickAxes}
          onClickZoomIn={onClickZoomIn}
          onClickZoomOut={onClickZoomOut}
          onClickSideX={onClickSideX}
          onClickSideY={onClickSideY}
          onClickSideZ={onClickSideZ}
          onClickResetPosition={onClickResetPosition}
          onClickSettings={onClickSettings}
        />
        <Canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}>
          <Suspense fallback={null}>
            <Bed bedSize={220} cellSize={10} isVisible={isBedVisible} color={settings.bedColor} />
            {fileName ? <Model file={file} color={settings.modelColor} /> : <></>}
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <Helpers cameraPosition={cameraPosition} isBedVisible={isBedVisible} isVisible={isAxesVisible} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      <ModalSettings
        isVisible={isSettingsVisible}
        onCLickClose={onClickCloseSettings}
        title="Settings"
        onChangeSettings={onChangeSettings}
        settings={settings}
      />
    </div>
  )
}

export default Application
