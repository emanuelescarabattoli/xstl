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
import { saveSettings, parseSettings } from '../../utils/settings'

const Application = () => {
  const [file, setFile] = useState(undefined)
  const [filePath, setFilePath] = useState(undefined)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState([100, 100, 100])
  const [settings, setSetting] = useState(parseSettings())

  const readFile = toReadFile => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setFile(reader.result);
      setFilePath(toReadFile.name)
    }, false);
    reader.readAsDataURL(new Blob([toReadFile.content], { type: "model/stl" }));
  }

  useEffect(() => {
    const getArgvFile = async argvFile => {
      const argsFile = argvFile || await window.electronAPI.getArgvFile()
      if (argsFile) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setFile(reader.result);
          setFilePath(argsFile.name)
        }, false);
        reader.readAsDataURL(new Blob([argsFile.content], { type: "model/stl" }));
      }
    }
    const container = containerRef.current;
    const canvas = canvasRef.current;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    getArgvFile()
    window.electronAPI.onFileReceived(async argvFile => {
      await getArgvFile(argvFile)
    })
  }, []);

  const onChangeFile = event => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setFile(reader.result);
      setFilePath(event.target.files[0].path)
    }, false);
    if (event.target.files[0]) {
      setFilePath(undefined);
      setFile(undefined);
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  const onClickZoomIn = () => {
    setCameraPosition(value => [value[0] - 10, value[1] - 10, value[2] - 10])
  }

  const onClickZoomOut = () => {
    setCameraPosition(value => [value[0] + 10, value[1] + 10, value[2] + 10])
  }

  const onClickSideX = () => {
    setCameraPosition(() => [0, 0, 100])
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

  const onClickSettings = () => setIsSettingsVisible(true)

  const onClickCloseSettings = () => setIsSettingsVisible(false)

  const onChangeSettings = (element, value) => {
    const updatedSettings = { ...settings, [element]: value }
    setSetting(updatedSettings)
    saveSettings(updatedSettings)
  }

  const onClickPreviousFile = async () => {
    if (filePath) {
      const previousFile = await window.electronAPI.getPreviousFile(filePath)
      if (previousFile) readFile(previousFile);
    }
  }

  const onClickNextFile = async () => {
    if (filePath) {
      const nextFile = await window.electronAPI.getNextFile(filePath)
      if (nextFile) readFile(nextFile);
    }
  }

  const onClickOpenWith = async () => {
    if (filePath) {
      await window.electronAPI.openWith(settings.openWithPath, filePath)
    }
  }

  return (
    <div ref={containerRef} className={style.mainWrapper}>
      <ErrorBoundary>
        <Controls
          filePath={filePath}
          onChangeFile={onChangeFile}
          onClickZoomIn={onClickZoomIn}
          onClickZoomOut={onClickZoomOut}
          onClickSideX={onClickSideX}
          onClickSideY={onClickSideY}
          onClickSideZ={onClickSideZ}
          onClickResetPosition={onClickResetPosition}
          onClickSettings={onClickSettings}
          onClickPreviousFile={onClickPreviousFile}
          onClickNextFile={onClickNextFile}
          onClickOpenWith={onClickOpenWith}
        />
        <Canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}>
          <Suspense fallback={<></>}>
            <Bed bedSize={settings.bedSize} cellSize={settings.bedGridCellSize} isVisible={settings.isBedVisible} color={settings.bedColor} />
            {filePath ? <Model file={file} color={settings.modelColor} /> : <></>}
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <Helpers cameraPosition={cameraPosition} isAxesVisible={settings.isAxesVisible} />
          </Suspense>
        </Canvas>
        <ModalSettings
          isVisible={isSettingsVisible}
          onCLickClose={onClickCloseSettings}
          title="Settings"
          onChangeSettings={onChangeSettings}
          settings={settings}
        />
      </ErrorBoundary>
    </div>
  )
}

export default Application
