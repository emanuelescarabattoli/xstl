import React from 'react'
import style from "./style.module.css"
import Button from "../button"

const ModalSettings = ({ onCLickClose, isVisible, title, onChangeSettings, settings }) => {
  return (
    <div className={style.popupContainer} style={{ display: isVisible ? "block" : "none" }}>
      <span className={style.title}>{title}</span>
      <div className={style.contentWrapper}>
        <div className={style.sectionWrapper}>
          <div>
            <span className={style.label}>Bed color</span>
          </div>
          <div>
            <button className={style.buttonColor} style={{ backgroundColor: "#336592" }} onClick={() => onChangeSettings("bedColor", "#336592")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#cc8800" }} onClick={() => onChangeSettings("bedColor", "#cc8800")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#770000" }} onClick={() => onChangeSettings("bedColor", "#770000")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#111111" }} onClick={() => onChangeSettings("bedColor", "#111111")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#007700" }} onClick={() => onChangeSettings("bedColor", "#007700")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#000077" }} onClick={() => onChangeSettings("bedColor", "#000077")} />
          </div>
        </div>
        <div className={style.sectionWrapper}>
          <div>
            <span className={style.label}>Model color</span>
          </div>
          <div>
            <button className={style.buttonColor} style={{ backgroundColor: "#336592" }} onClick={() => onChangeSettings("modelColor", "#336592")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#cc8800" }} onClick={() => onChangeSettings("modelColor", "#cc8800")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#770000" }} onClick={() => onChangeSettings("modelColor", "#770000")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#111111" }} onClick={() => onChangeSettings("modelColor", "#111111")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#007700" }} onClick={() => onChangeSettings("modelColor", "#007700")} />
            <button className={style.buttonColor} style={{ backgroundColor: "#000077" }} onClick={() => onChangeSettings("modelColor", "#000077")} />
          </div>
        </div>
        <div className={style.sectionWrapper}>
          <div>
            <span className={style.label}>Bed visible</span>
          </div>
          <div>
            <Button text="Toggle" onClick={() => onChangeSettings("isBedVisible", !settings.isBedVisible)} />
          </div>
        </div>
        <div className={style.sectionWrapper}>
          <div>
            <span className={style.label}>Axes visible</span>
          </div>
          <div>
            <Button text="Toggle" onClick={() => onChangeSettings("isAxesVisible", !settings.isAxesVisible)} />
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