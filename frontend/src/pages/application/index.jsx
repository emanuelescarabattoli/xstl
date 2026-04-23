/* eslint-disable react-hooks/exhaustive-deps */

import { Canvas } from '@react-three/fiber'
import { useEffect, useMemo, useRef, Suspense, useState } from 'react'
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
import { getFileName } from '../../utils'

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
  const [isPerspective, setIsPerspective] = useState(true)
  const [isWireframe, setIsWireframe] = useState(false)
  const [isMeasureMode, setIsMeasureMode] = useState(false)
  const [measurePoints, setMeasurePoints] = useState([])
  const [snapshotScale, setSnapshotScale] = useState(1)
  const [snapshotTransparentBg, setSnapshotTransparentBg] = useState(false)
  const [settings, setSetting] = useState(parseSettings())
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState(() => getDefaultCameraPosition(settings.bedSize))
  const orbitRef = useRef(null);
  const controlsHideTimeoutRef = useRef(null);
  const isExportingRef = useRef(false);

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

  const onClickTogglePerspective = () => {
    const defaultPosition = getDefaultCameraPosition(settings.bedSize)
    orbitRef?.current?.reset()
    setCameraPosition(defaultPosition)
    setIsPerspective(v => !v)
  }

  const onClickToggleWireframe = () => setIsWireframe(v => !v)

  const onClickToggleMeasureMode = () => {
    setIsMeasureMode(value => !value)
    setMeasurePoints([])
  }

  const onClearMeasurement = () => setMeasurePoints([])

  const onAddMeasurePoint = point => {
    setMeasurePoints(previous => {
      if (previous.length >= 2) return [point]
      return [...previous, point]
    })
  }

  const onClickToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.()
      return
    }

    await document.exitFullscreen?.()
  }

  const onClickExportSnapshot = () => {
    // Debounce: prevent multiple simultaneous exports
    if (isExportingRef.current) return
    isExportingRef.current = true

    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current

    if (!renderer || !scene || !camera) {
      isExportingRef.current = false
      return
    }

    const currentSize = renderer.getSize(new THREE.Vector2())
    const currentPixelRatio = renderer.getPixelRatio()
    const clearColor = renderer.getClearColor(new THREE.Color()).clone()
    const clearAlpha = renderer.getClearAlpha()
    const containerBackground = window.getComputedStyle(containerRef.current).backgroundColor || "#111111"
    const sceneBackgroundColor = scene.background?.isColor ? `#${scene.background.getHexString()}` : containerBackground

    const previousAspect = camera.isPerspectiveCamera ? camera.aspect : null

    try {
      renderer.setPixelRatio(currentPixelRatio * snapshotScale)
      renderer.setSize(currentSize.x, currentSize.y, false)

      if (snapshotTransparentBg) {
        renderer.setClearColor(clearColor, 0)
        renderer.setClearAlpha(0)
      } else {
        renderer.setClearColor(sceneBackgroundColor, 1)
      }

      if (camera.isPerspectiveCamera) {
        camera.aspect = currentSize.x / currentSize.y
        camera.updateProjectionMatrix()
      }

      renderer.render(scene, camera)

      const dataUrl = renderer.domElement.toDataURL("image/png")

      // Format date as yyyy-mm-dd-hh-mm-ss
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0] // yyyy-mm-dd
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-') // hh-mm-ss
      const dateFormatted = `${dateStr}-${timeStr}`

      // Export scale (1x, 2x, 4x, etc.)
      const scaleStr = `${snapshotScale}x`

      const baseName = getFileName(filePath || "snapshot").replace(/\.[^/.]+$/, "") || "snapshot"
      const anchor = document.createElement("a")
      anchor.href = dataUrl
      anchor.download = `${baseName}_${scaleStr}_${dateFormatted}.png`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
    } finally {
      isExportingRef.current = false
      renderer.setPixelRatio(currentPixelRatio)
      renderer.setSize(currentSize.x, currentSize.y, false)
      renderer.setClearColor(clearColor, clearAlpha)

      if (camera.isPerspectiveCamera && previousAspect) {
        camera.aspect = previousAspect
        camera.updateProjectionMatrix()
      }

      renderer.render(scene, camera)
    }
  }

  const onCanvasCreated = ({ gl, scene, camera }) => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.12

    rendererRef.current = gl
    sceneRef.current = scene
    cameraRef.current = camera

    if ('outputColorSpace' in gl) {
      gl.outputColorSpace = THREE.SRGBColorSpace
    }
  }

  const shouldHideCursor = isFullscreen && !isControlsVisible
  const measureDistance = useMemo(() => {
    if (measurePoints.length !== 2) return null
    const [a, b] = measurePoints
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const dz = b[2] - a[2]
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }, [measurePoints])

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
          isPerspective={isPerspective}
          onClickTogglePerspective={onClickTogglePerspective}
          isWireframe={isWireframe}
          onClickToggleWireframe={onClickToggleWireframe}
          isMeasureMode={isMeasureMode}
          measureDistance={measureDistance}
          onClickToggleMeasureMode={onClickToggleMeasureMode}
          onClearMeasurement={onClearMeasurement}
          snapshotScale={snapshotScale}
          snapshotTransparentBg={snapshotTransparentBg}
          onChangeSnapshotScale={value => setSnapshotScale(value)}
          onChangeSnapshotTransparentBg={value => setSnapshotTransparentBg(value)}
          onClickExportSnapshot={onClickExportSnapshot}
        />
        <Canvas
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true }}
          camera={{ near: 0.1, far: 20000, fov: 70 }}
          onCreated={onCanvasCreated}
        >
          <Bed bedSize={settings.bedSize} cellSize={settings.bedGridCellSize} isVisible={settings.isBedVisible} color={settings.bedColor} />
          <Suspense fallback={<Loader bedSize={settings.bedSize} color={settings.modelColor} />}>
            {file ? <Model key={filePath || file} file={file} color={settings.modelColor} isWireframe={isWireframe} isMeasureMode={isMeasureMode} measurePoints={measurePoints} measureDistance={measureDistance} onAddMeasurePoint={onAddMeasurePoint} /> : <></>}
          </Suspense>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} maxDistance={9000} minZoom={0.001} maxZoom={400} ref={orbitRef}/>
          <Helpers cameraPosition={cameraPosition} isAxesVisible={settings.isAxesVisible} isPerspective={isPerspective} orbitRef={orbitRef} />
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
