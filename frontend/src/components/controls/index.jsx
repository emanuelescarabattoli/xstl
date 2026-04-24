/* eslint-disable jsx-a11y/no-access-key */

import style from "./style.module.css"
import { useState } from 'react'
import Button from "../button"
import Tooltip from "../tooltip"
import Icon from "../icon"
import InputFile from "../input-file"

const Controls = ({
  filePath,
  isVisible,
  isFullscreen,
  isPerspective,
  isWireframe,
  isBoundingBoxVisible,
  isMeasureMode,
  measureDistance,
  snapshotScale,
  snapshotTransparentBg,
  onChangeFile,
  onClickZoomIn,
  onClickZoomOut,
  onClickSideX,
  onClickSideY,
  onClickSideZ,
  onClickResetPosition,
  onClickSettings,
  onClickToggleFullscreen,
  onClickTogglePerspective,
  onClickToggleWireframe,
  onClickToggleBoundingBox,
  onClickToggleMeasureMode,
  onClearMeasurement,
  onChangeSnapshotScale,
  onChangeSnapshotTransparentBg,
  onClickExportSnapshot,
  onClickPreviousFile,
  onClickNextFile,
  onClickOpenWith,
}) => {
  const TOOL_ORDER = ["measure", "snapshot"]
  const [toolStack, setToolStack] = useState([])

  const isMeasureToolActive = toolStack.includes("measure")
  const isSnapshotToolActive = toolStack.includes("snapshot")

  const toggleToolInStack = toolName => {
    setToolStack(previous => {
      if (previous.includes(toolName)) {
        return previous.filter(name => name !== toolName)
      }
      return [...previous, toolName]
    })
  }

  const onClickToggleMeasureOptions = () => {
    if (isMeasureToolActive) {
      if (isMeasureMode) {
        onClickToggleMeasureMode()
      }
      toggleToolInStack("measure")
      return
    }

    toggleToolInStack("measure")
    if (!isMeasureMode) {
      onClickToggleMeasureMode()
    }
  }

  const onClickToggleSnapshotOptions = () => {
    toggleToolInStack("snapshot")
  }

  const orderedToolStack = TOOL_ORDER.filter(toolName => toolStack.includes(toolName))

  return (
    <>
      <div className={`${style.controlsWrapper} ${isVisible ? style.visible : style.hidden}`}>
        <div>
          {
            filePath ? (
              <>
                <Tooltip text="Arrow Left">
                  <Button onClick={onClickPreviousFile} text={<Icon name="chevron-left" />} />
                </Tooltip>
                <Tooltip text="Arrow Right">
                  <Button onClick={onClickNextFile} text={<Icon name="chevron-right" />} />
                </Tooltip>
                <Tooltip text="Open with external application">
                  <Button onClick={onClickOpenWith} text={<Icon name="external-link" />} />
                </Tooltip>
              </>
            ) : <></>
          }
          <InputFile value={filePath} onChange={onChangeFile} />
        </div>
      <div>
        <Button onClick={onClickZoomIn} text={<Icon name="plus" />} />
        <Button onClick={onClickZoomOut} text={<Icon name="minus" />} />
        <Tooltip text={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
          <Button onClick={onClickToggleFullscreen} text={<Icon name={isFullscreen ? "compress" : "expand"} />} />
        </Tooltip>
      </div>
      <div>
        <Button onClick={onClickSideX} text={<Icon name="x" />} />
        <Button onClick={onClickSideY} text={<Icon name="y" />} />
        <Button onClick={onClickSideZ} text={<Icon name="z" />} />
        <Button onClick={onClickResetPosition} text={<Icon name="rotate-left" />} />
      </div>
      <div>
        <Tooltip text={isPerspective ? "Switch to orthographic" : "Switch to perspective"}>
          <Button onClick={onClickTogglePerspective} text={<Icon name={isPerspective ? "cube" : "square"} />} />
        </Tooltip>
        <Tooltip text={isWireframe ? "Disable wireframe" : "Enable wireframe"}>
          <Button onClick={onClickToggleWireframe} text={<Icon name={isWireframe ? "border-all" : "cubes"} />} />
        </Tooltip>
        <Tooltip text={isBoundingBoxVisible ? "Hide bounding box" : "Show bounding box"}>
          <Button onClick={onClickToggleBoundingBox} text={<Icon name={isBoundingBoxVisible ? "vector-square" : "draw-polygon"} />} />
        </Tooltip>
      </div>
      <div>
        <Tooltip text="Measurement tool">
          <Button
            onClick={onClickToggleMeasureOptions}
            text={<Icon name="ruler-combined" />}
            className={isMeasureToolActive ? style.activeToolToggle : ""}
          />
        </Tooltip>
        <Tooltip text="Snapshot tool">
          <Button
            onClick={onClickToggleSnapshotOptions}
            text={<Icon name="camera" />}
            className={isSnapshotToolActive ? style.activeToolToggle : ""}
          />
        </Tooltip>
      </div>
      <div>
        <Button onClick={onClickSettings} text={<Icon name="cog" />} />
      </div>
      </div>

      {orderedToolStack.length > 0 ? (
        <div className={`${style.toolStack} ${isVisible ? style.visible : style.hidden}`}>
          {orderedToolStack.map(toolName => {
            if (toolName === "measure") {
              return (
                <div key="measure" className={style.toolPanel}>
                  <div className={style.toolPanelTitle}>Ruler</div>
                  <span className={style.measureReadout}>{measureDistance === null ? "Pick 2 points" : `${measureDistance.toFixed(2)} mm`}</span>
                  <Button onClick={onClearMeasurement} text="Clear" />
                </div>
              )
            }

            if (toolName === "snapshot") {
              return (
                <div key="snapshot" className={style.toolPanel}>
                  <div className={style.toolPanelTitle}>Snapshot</div>
                  <label className={style.snapshotLabel}>
                    Resolution
                    <select className={style.snapshotSelect} value={snapshotScale} onChange={event => onChangeSnapshotScale(Number(event.target.value))}>
                      <option value={1}>1x</option>
                      <option value={2}>2x</option>
                      <option value={4}>4x</option>
                    </select>
                  </label>
                  <label className={style.snapshotLabelInline}>
                    <input type="checkbox" checked={snapshotTransparentBg} onChange={event => onChangeSnapshotTransparentBg(event.target.checked)} />
                    Transparent
                  </label>
                  <Button onClick={onClickExportSnapshot} text="Export PNG" />
                </div>
              )
            }

            return null
          })}
        </div>
      ) : null}
    </>
  )
}

export default Controls;
