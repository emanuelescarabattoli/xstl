/* eslint-disable jsx-a11y/no-access-key */

import style from "./style.module.css"
import Button from "../button"
import Tooltip from "../tooltip"
import Icon from "../icon"
import InputFile from "../input-file"

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
  onClickOpenWith,
}) => {
  return (
    <div className={style.controlsWrapper}>
      <div>
        {
          filePath ? (
            <>
              <Tooltip text="Alt + Z">
                <Button onClick={onClickPreviousFile} text={<Icon name="chevron-left" />} accessKey="z" />
              </Tooltip>
              <Tooltip text="Alt + X">
                <Button onClick={onClickNextFile} text={<Icon name="chevron-right" />} accessKey="x" />
              </Tooltip>
              <Tooltip text="Open with external application">
                <Button onClick={onClickOpenWith} text={<Icon name="external-link" />} accessKey="z" />
              </Tooltip>
            </>
          ) : <></>
        }
        <InputFile value={filePath} onChange={onChangeFile} />
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
