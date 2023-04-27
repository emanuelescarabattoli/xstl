import style from "./style.module.css"
import Icon from "../icon"

const InputNumeric = ({ value, onChange, minimumValue, maximumValue, step }) => {
  const onIncreaseValue = () => {
    onChange(value + step);
  }
  const onDecreaseValue = () => {
    onChange(value - step);
  }
  return (
    <div className={style.mainWrapper}>
      <button disabled={value <= minimumValue} className={style.button} onClick={onDecreaseValue}><Icon name="minus" /></button>
      <span className={style.value}>{value}</span>
      <button disabled={value >= maximumValue} className={style.button} onClick={onIncreaseValue}><Icon name="plus" /></button>
    </div>
  );
};

export default InputNumeric;