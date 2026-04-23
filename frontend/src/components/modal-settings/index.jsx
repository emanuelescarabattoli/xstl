import React from 'react'
import style from "./style.module.css"
import Button from "../button"
import InputNumeric from "../input-numeric"
import InputFile from '../input-file'
import ColorSelector from '../color-selector'

const ModalSettings = ({ onCLickClose, isVisible, title, onChangeSettings, settings }) => {
  const onChangeExternalApplication = event => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const selectedPath = window.electronAPI?.getPathForFile?.(selectedFile) || selectedFile.path || selectedFile.name
    onChangeSettings("openWithPath", selectedPath)
  }

  return (
    <div className={style.popupContainer} style={{ display: isVisible ? "block" : "none" }}>
      <span className={style.title}>{title}</span>
      <div className={style.contentWrapper}>
        <div className={style.sectionWrapper}>
          <span className={style.sectionTitle}>Colors</span>
          <div className={style.sectionColumns}>
            <ColorSelector
              label="Bed color"
              value={settings?.bedColor}
              onChange={value => onChangeSettings("bedColor", value)}
              />
            <ColorSelector
              label="Model color"
              value={settings?.modelColor}
              onChange={value => onChangeSettings("modelColor", value)}
              />
            </div>
        </div>
        <div className={style.sectionWrapper}>
          <span className={style.sectionTitle}>Elements visibility</span>
          <div className={style.sectionColumns}>
            <div className={style.sectionColumn}>
              <span className={style.columnLabel}>Bed visible</span>
            </div>
            <div className={style.sectionColumn}>
              <Button text="Toggle" onClick={() => onChangeSettings("isBedVisible", !settings?.isBedVisible ?? true)} />
            </div>
            <div className={style.sectionColumn}>
              <span className={style.columnLabel}>Axes visible</span>
            </div>
            <div className={style.sectionColumn}>
              <Button text="Toggle" onClick={() => onChangeSettings("isAxesVisible", !settings?.isAxesVisible ?? false)} />
            </div>
          </div>
        </div>
        <div className={style.sectionWrapper}>
          <span className={style.sectionTitle}>Bed and grid</span>
          <div className={style.sectionColumns}>
            <div className={style.sectionColumn}>
              <span className={style.columnLabel}>Bed size</span>
            </div>
            <div className={style.sectionColumn}>
              <InputNumeric value={settings?.bedSize ?? 220} onChange={value => onChangeSettings("bedSize", value)} minimumValue={100} maximumValue={500} step={10} />
            </div>
            <div className={style.sectionColumn}>
              <span className={style.columnLabel}>Bed grid cell size</span>
            </div>
            <div className={style.sectionColumn}>
              <InputNumeric value={settings?.bedGridCellSize ?? 10} onChange={value => onChangeSettings("bedGridCellSize", value)} minimumValue={5} maximumValue={100} step={5} />
            </div>
          </div>
        </div>
        <div className={style.sectionWrapper}>
          <span className={style.sectionTitle}>Open with external application</span>
          <div className={style.sectionColumns}>
            <div className={style.sectionColumn}>
              <span className={style.columnLabel}>External application</span>
            </div>
            <div className={style.sectionColumn}>
              <InputFile value={settings?.openWithPath} onChange={onChangeExternalApplication} />
            </div>
          </div>
        </div>
      </div>
      <div className={style.actionsWrapper}>
        <Button onClick={onCLickClose} text="Close" />
      </div>
    </div>
  )
}

export default ModalSettings;