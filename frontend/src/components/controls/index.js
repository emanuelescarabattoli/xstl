import style from "./style.module.css"
import Button from "../button"
import { useRef } from "react"

const Controls = ({
  fileName,
  onChangeFile,
  onClickBed,
  onClickAxes,
  onClickZoomIn,
  onClickZoomOut,
  onClickSideX,
  onClickSideY,
  onClickSideZ,
  onClickResetPosition,
  onClickSettings,
}) => {
  const inputRef = useRef()

  const onClickChooseFile = () => {
    inputRef.current.click()
  }

  return (
    <div className={style.controlsWrapper}>
      <div>
        <Button onClick={onClickChooseFile} text="Open file" />
        <span className={style.fileName}>{fileName}</span>
        <input ref={inputRef} style={{ display: "none" }} type="file" onChange={onChangeFile} />
      </div>
      <div>
        <Button onClick={onClickBed} text="Bed" />
        <Button onClick={onClickAxes} text="Axes" />
      </div>
      <div>
        <Button onClick={onClickZoomIn} text="+" />
        <Button onClick={onClickZoomOut} text="-" />
      </div>
      <div>
        <Button onClick={onClickSideX} text="X" />
        <Button onClick={onClickSideY} text="Y" />
        <Button onClick={onClickSideZ} text="Z" />
        <Button onClick={onClickResetPosition} text="Reset" />
      </div>
      <div>
        <Button onClick={onClickSettings} text="Settings" />
      </div>
    </div>
  )
}

export default Controls;
