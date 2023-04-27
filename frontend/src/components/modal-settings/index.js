import React from 'react'
import style from "./style.module.css"
import Button from "../button"
import InputNumeric from "../input-numeric"

const ModalSettings = ({ onCLickClose, isVisible, title, onChangeSettings, settings }) => {
  return (
    <div className={style.popupContainer} style={{ display: isVisible ? "block" : "none" }}>
      <span className={style.title}>{title}</span>
      <div className={style.contentWrapper}>
        <div className={style.sectionWrapper}>
          <span className={style.sectionTitle}>Colors</span>
          <div className={style.sectionColumns}>
            <div className={style.sectionColumn}>
              <span className={style.columnLabel}>Bed color</span>
            </div>
            <div className={style.sectionColumn}>
              <button className={style.buttonColor} style={{ backgroundColor: "#336592" }} onClick={() => onChangeSettings("bedColor", "#336592")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#cc8800" }} onClick={() => onChangeSettings("bedColor", "#cc8800")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#770000" }} onClick={() => onChangeSettings("bedColor", "#770000")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#111111" }} onClick={() => onChangeSettings("bedColor", "#111111")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#007700" }} onClick={() => onChangeSettings("bedColor", "#007700")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#000077" }} onClick={() => onChangeSettings("bedColor", "#000077")} />
            </div>
            <div className={style.sectionColumn}>
              <span className={style.columnLabel}>Model color</span>
            </div>
            <div className={style.sectionColumn}>
              <button className={style.buttonColor} style={{ backgroundColor: "#336592" }} onClick={() => onChangeSettings("modelColor", "#336592")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#cc8800" }} onClick={() => onChangeSettings("modelColor", "#cc8800")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#770000" }} onClick={() => onChangeSettings("modelColor", "#770000")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#111111" }} onClick={() => onChangeSettings("modelColor", "#111111")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#007700" }} onClick={() => onChangeSettings("modelColor", "#007700")} />
              <button className={style.buttonColor} style={{ backgroundColor: "#000077" }} onClick={() => onChangeSettings("modelColor", "#000077")} />
            </div>
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
      </div>
      <div className={style.actionsWrapper}>
        <Button onClick={onCLickClose} text="Close" />
      </div>
    </div>
  )
}

export default ModalSettings;