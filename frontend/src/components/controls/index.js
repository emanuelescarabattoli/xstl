/* eslint-disable jsx-a11y/no-access-key */

import style from "./style.module.css"
import Button from "../button"
import { useRef } from "react"
import Tooltip from "../tooltip"
import Icon from "../icon"

const getFileName = filePath => filePath?.replaceAll("\\", "/").split("/").pop() ?? "";

const Controls = ({
  filePath,
  onChangeFile,
  onClickZoomIn,
  onClickZoomOut,
  onClickSideX,
  onClickSideY,
  onClickSideZ,
  onClickResetPosition,
  onClickSettings,
  onClickPreviousFile,
  onClickNextFile,
}) => {
  const inputRef = useRef()

  const onClickChooseFile = () => {
    inputRef.current.click()
  }

  return (
    <div className={style.controlsWrapper}>
      <div>
        <Button onClick={onClickChooseFile} text={<Icon name="folder-open" />} />
        {
          filePath ? (
            <>
              <Tooltip text="alt + z">
                <Button onClick={onClickPreviousFile} text={<Icon name="chevron-left" />} accessKey="z" />
              </Tooltip>
              <Tooltip text="alt + x">
                <Button onClick={onClickNextFile} text={<Icon name="chevron-right" />} accessKey="x" />
              </Tooltip>
            </>
          ) : <></>
        }
        <span className={style.filePath}>{getFileName(filePath)}</span>
        <input ref={inputRef} style={{ display: "none" }} type="file" onChange={onChangeFile} />
      </div>
      <div>
        <Button onClick={onClickZoomIn} text={<Icon name="plus" />} />
        <Button onClick={onClickZoomOut} text={<Icon name="minus" />} />
      </div>
      <div>
        <Button onClick={onClickSideX} text={<Icon name="x" />} />
        <Button onClick={onClickSideY} text={<Icon name="y" />} />
        <Button onClick={onClickSideZ} text={<Icon name="z" />} />
        <Button onClick={onClickResetPosition} text={<Icon name="rotate-left" />} />
      </div>
      <div>
        <Button onClick={onClickSettings} text={<Icon name="cog" />} />
      </div>
    </div>
  )
}

export default Controls;
