/* eslint-disable react-hooks/exhaustive-deps */

import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, Suspense, useState } from 'react'
import * as THREE from 'three'
import style from "./style.module.css"
import { OrbitControls } from "@react-three/drei"
import Bed from '../../components/bed'
import Helpers from '../../components/helpers'
import Model from '../../components/model'
import Loader from '../../components/loader'
import Controls from '../../components/controls'
import ErrorBoundary from '../../components/error-boundary'
import ModalSettings from '../../components/modal-settings'
import { saveSettings, parseSettings } from '../../utils/settings'

const getDefaultCameraPosition = (bedSize = 220) => {
  const distance = Math.max(140, Math.round(bedSize * 0.8));
  return [distance, distance, distance];
}

const toBlobPart = content => {
  if (!content) return content;
  if (content instanceof Blob) return content;
  if (content instanceof ArrayBuffer) return new Uint8Array(content);
  if (ArrayBuffer.isView(content)) {
    return new Uint8Array(content.buffer, content.byteOffset, content.byteLength);
  }
  if (content?.type === "Buffer" && Array.isArray(content.data)) {
    return new Uint8Array(content.data);
  }
  return content;
}

const createModelObjectUrl = content => {
  const blobPart = toBlobPart(content)
  const blob = blobPart instanceof Blob ? blobPart : new Blob([blobPart], { type: "application/octet-stream" })
  return URL.createObjectURL(blob)
}

const Application = () => {
  const [file, setFile] = useState(undefined)
  const [filePath, setFilePath] = useState(undefined)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const [settings, setSetting] = useState(parseSettings())
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState(() => getDefaultCameraPosition(settings.bedSize))
  const orbitRef = useRef(null);
  const controlsHideTimeoutRef = useRef(null);

  const clearControlsHideTimeout = () => {
    if (controlsHideTimeoutRef.current) {
      clearTimeout(controlsHideTimeoutRef.current)
      controlsHideTimeoutRef.current = null
    }
  }

  const scheduleControlsHide = () => {
    clearControlsHideTimeout()
    controlsHideTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false)
    }, 2000)
  }

  const setModelSource = (nextSource, nextPath) => {
    setFile(previousSource => {
      if (previousSource?.startsWith("blob:")) {
        URL.revokeObjectURL(previousSource)
      }
      return nextSource
    })
    setFilePath(nextPath)
  }

  const readFile = toReadFile => {
    const source = createModelObjectUrl(toReadFile.content)
    setModelSource(source, toReadFile.path || toReadFile.name)
  }

  useEffect(() => {
    const getArgvFile = async argvFile => {
      const argsFile = argvFile || await window.electronAPI.getArgvFile()
      if (argsFile) {
        const source = createModelObjectUrl(argsFile.content)
        setModelSource(source, argsFile.path || argsFile.name)
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

  const onChangeFile = async event => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const selectedFilePath = window.electronAPI.getPathForFile(selectedFile) || selectedFile.path || selectedFile.name
    const source = URL.createObjectURL(selectedFile)
    setModelSource(source, selectedFilePath)
  }

  useEffect(() => {
    return () => {
      clearControlsHideTimeout()
      if (file?.startsWith("blob:")) {
        URL.revokeObjectURL(file)
      }
    }
  }, [file])

  useEffect(() => {
    const onFullscreenChange = () => {
      const nextIsFullscreen = Boolean(document.fullscreenElement)
      setIsFullscreen(nextIsFullscreen)

      if (nextIsFullscreen) {
        setIsControlsVisible(false)
      } else {
        clearControlsHideTimeout()
        setIsControlsVisible(true)
      }
    }

    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  useEffect(() => {
    const onMouseMove = () => {
      if (!isFullscreen) return
      setIsControlsVisible(true)
      scheduleControlsHide()
    }

    window.addEventListener("mousemove", onMouseMove)
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [isFullscreen])

  const onClickZoomIn = () => {
    setCameraPosition(value => [value[0] - 10, value[1] - 10, value[2] - 10])
  }

  const onClickZoomOut = () => {
    setCameraPosition(value => [value[0] + 10, value[1] + 10, value[2] + 10])
  }

  const onClickSideX = () => {
    orbitRef?.current?.reset();
    setCameraPosition(() => [0, 0, 100])
  }

  const onClickSideY = () => {
    orbitRef?.current?.reset();
    setCameraPosition(() => [0, 100, 0])
  }

  const onClickSideZ = () => {
    orbitRef?.current?.reset();
    setCameraPosition(() => [100, 0, 0])
  }

  const onClickResetPosition = () => {
    orbitRef?.current?.reset();
    setCameraPosition(() => getDefaultCameraPosition(settings.bedSize))
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

  useEffect(() => {
    const onKeyDown = event => {
      if (!filePath) return;

      const targetTagName = event.target?.tagName?.toLowerCase();
      if (targetTagName === "input" || targetTagName === "textarea" || event.target?.isContentEditable) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onClickPreviousFile();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onClickNextFile();
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [filePath])

  const onClickOpenWith = async () => {
    if (filePath) {
      await window.electronAPI.openWith(settings.openWithPath, filePath)
    }
  }

  const onClickToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.()
      return
    }

    await document.exitFullscreen?.()
  }

  const onCanvasCreated = ({ gl }) => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.12

    if ('outputColorSpace' in gl) {
      gl.outputColorSpace = THREE.SRGBColorSpace
    }
  }

  const shouldHideCursor = isFullscreen && !isControlsVisible

  return (
    <div ref={containerRef} className={`${style.mainWrapper} ${shouldHideCursor ? style.hideCursor : ""}`}>
      <ErrorBoundary>
        <Controls
          filePath={filePath}
          isVisible={isControlsVisible}
          isFullscreen={isFullscreen}
          onChangeFile={onChangeFile}
          onClickZoomIn={onClickZoomIn}
          onClickZoomOut={onClickZoomOut}
          onClickSideX={onClickSideX}
          onClickSideY={onClickSideY}
          onClickSideZ={onClickSideZ}
          onClickResetPosition={onClickResetPosition}
          onClickSettings={onClickSettings}
          onClickToggleFullscreen={onClickToggleFullscreen}
          onClickPreviousFile={onClickPreviousFile}
          onClickNextFile={onClickNextFile}
          onClickOpenWith={onClickOpenWith}
        />
        <Canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true }}
          camera={{ near: 0.1, far: 20000, fov: 70 }}
          onCreated={onCanvasCreated}
        >
          <Bed bedSize={settings.bedSize} cellSize={settings.bedGridCellSize} isVisible={settings.isBedVisible} color={settings.bedColor} />
          <Suspense fallback={<Loader bedSize={settings.bedSize} color={settings.modelColor} />}>
            {file ? <Model key={filePath || file} file={file} color={settings.modelColor} /> : <></>}
          </Suspense>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} maxDistance={9000} ref={orbitRef}/>
          <Helpers cameraPosition={cameraPosition} isAxesVisible={settings.isAxesVisible} />
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
