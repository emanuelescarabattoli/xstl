import style from "./style.module.css"

const Button = ({ text, onClick }) => {
  return (
    <button className={style.buttonStandard} onClick={onClick}>{text}</button>

  );
};

export default Button;