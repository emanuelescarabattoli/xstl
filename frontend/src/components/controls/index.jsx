/* eslint-disable jsx-a11y/no-access-key */

import style from "./style.module.css"
import { useState, useEffect } from 'react'
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
  onClickToggleMeasureMode,
  onClearMeasurement,
  onChangeSnapshotScale,
  onChangeSnapshotTransparentBg,
  onClickExportSnapshot,
  onClickPreviousFile,
  onClickNextFile,
  onClickOpenWith,
}) => {
  const [isSnapshotOptionsVisible, setIsSnapshotOptionsVisible] = useState(false)
  const [isMeasureOptionsVisible, setIsMeasureOptionsVisible] = useState(false)

  const onClickToggleMeasureOptions = () => {
    setIsMeasureOptionsVisible(previous => !previous)
  }

  // Sync measure mode with measure options visibility
  useEffect(() => {
    if (isMeasureOptionsVisible && !isMeasureMode) {
      onClickToggleMeasureMode()
    } else if (!isMeasureOptionsVisible && isMeasureMode) {
      onClickToggleMeasureMode()
    }
  }, [isMeasureOptionsVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  // When snapshot options open, close measure options and disable measure mode
  useEffect(() => {
    if (isSnapshotOptionsVisible && isMeasureOptionsVisible) {
      setIsMeasureOptionsVisible(false)
    }
    if (isSnapshotOptionsVisible && isMeasureMode) {
      onClickToggleMeasureMode()
    }
  }, [isSnapshotOptionsVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  const onClickToggleSnapshotOptions = () => {
    setIsSnapshotOptionsVisible(previous => !previous)
  }

  return (
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
      </div>
      <div>
        <div className={style.measureWrapper}>
          <Tooltip text="Measurement options" isVisible={!isMeasureOptionsVisible}>
            <Button onClick={onClickToggleMeasureOptions} text={<Icon name="ruler-combined" />} />
          </Tooltip>
          {isMeasureOptionsVisible ? (
            <div className={style.measurePopover}>
              <span className={style.measureReadout}>{measureDistance === null ? "Pick 2 points" : `${measureDistance.toFixed(2)} mm`}</span>
              <Button onClick={onClearMeasurement} text="Clear" />
            </div>
          ) : null}
        </div>
        <div className={style.snapshotWrapper}>
          <Tooltip text="Snapshot options" isVisible={!isSnapshotOptionsVisible}>
            <Button onClick={onClickToggleSnapshotOptions} text={<Icon name="camera" />} />
          </Tooltip>
          {isSnapshotOptionsVisible ? (
            <div className={style.snapshotPopover}>
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
          ) : null}
        </div>
      </div>
      <div>
        <Button onClick={onClickSettings} text={<Icon name="cog" />} />
      </div>
    </div>
  )
}

export default Controls;
