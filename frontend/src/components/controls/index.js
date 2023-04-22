import style from "./style.module.css"

const Controls = ({
  onChange,
  onClickZoomBed,
  onClickZoomAxes,
  onClickZoomIn,
  onClickZoomOut,
  onClickSideX,
  onClickSideY,
  onClickSideZ,
  onClickResetPosition,
  onClickChangeColor
}) => {
  return (
    <div className={style.controlsWrapper}>
      <div>
        <input className={style.chooseFile} type="file" onChange={onChange} />
      </div>
      <div>
        <button className={style.buttonStandard} onClick={onClickZoomBed}>Bed</button>
        <button className={style.buttonStandard} onClick={onClickZoomAxes}>Axes</button>
      </div>
      <div>
        <button className={style.buttonStandard} onClick={onClickZoomIn}>+</button>
        <button className={style.buttonStandard} onClick={onClickZoomOut}>-</button>
      </div>
      <div>
        <button className={style.buttonStandard} onClick={onClickSideX}>X</button>
        <button className={style.buttonStandard} onClick={onClickSideY}>Y</button>
        <button className={style.buttonStandard} onClick={onClickSideZ}>Z</button>
        <button className={style.buttonStandard} onClick={onClickResetPosition}>Reset</button>
      </div>
      <div>
        <button className={style.buttonColor} style={{ backgroundColor: "#cc8800" }} onClick={() => onClickChangeColor("#cc8800")} />
        <button className={style.buttonColor} style={{ backgroundColor: "#770000" }} onClick={() => onClickChangeColor("#770000")} />
        <button className={style.buttonColor} style={{ backgroundColor: "#111111" }} onClick={() => onClickChangeColor("#111111")} />
        <button className={style.buttonColor} style={{ backgroundColor: "#007700" }} onClick={() => onClickChangeColor("#007700")} />
        <button className={style.buttonColor} style={{ backgroundColor: "#000077" }} onClick={() => onClickChangeColor("#000077")} />
      </div>
    </div>
  )
}

export default Controls;
