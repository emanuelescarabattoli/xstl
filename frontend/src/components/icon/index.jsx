import style from "./style.module.css"

const Icon = ({ name }) => {
  return (
    <div className={style.mainWrapper}>
      <i className={`fa-solid fa-${name}`} />
    </div>
  );
};

export default Icon;