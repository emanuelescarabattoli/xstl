import style from "./style.module.css"

const Tooltip = ({ text, children }) => {
  return (
    <div className={style.tooltip}>
      <span className={style.tooltipContent}>
        {text}
      </span>
      <div className={style.tooltipParent}>
        {children}
      </div>
    </div>
  );
};

export default Tooltip;