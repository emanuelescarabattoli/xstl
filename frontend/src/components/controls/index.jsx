/* eslint-disable jsx-a11y/no-access-key */

import style from "./style.module.css"
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
  onClickPreviousFile,
  onClickNextFile,
  onClickOpenWith,
}) => {
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
      <div className={style.measureControls}>
        <Tooltip text={isMeasureMode ? "Disable measure mode" : "Enable measure mode"}>
          <Button onClick={onClickToggleMeasureMode} text={<Icon name="ruler-combined" />} />
        </Tooltip>
        {isMeasureMode ? (
          <>
            <span className={style.measureReadout}>{measureDistance === null ? "Pick 2 points" : `${measureDistance.toFixed(2)} mm`}</span>
            <Tooltip text="Clear measurement">
              <Button onClick={onClearMeasurement} text={<Icon name="xmark" />} />
            </Tooltip>
          </>
        ) : null}
      </div>
      <div>
        <Button onClick={onClickSettings} text={<Icon name="cog" />} />
      </div>
    </div>
  )
}

export default Controls;
