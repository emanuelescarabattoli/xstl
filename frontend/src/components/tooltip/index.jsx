import style from "./style.module.css"

const Tooltip = ({ text, children, isVisible = true }) => {
  return (
    <div className={style.tooltip}>
      {isVisible ? (
        <span className={style.tooltipContent}>
          {text}
        </span>
      ) : null}
      <div className={style.tooltipParent}>
        {children}
      </div>
    </div>
  );
};

export default Tooltip;