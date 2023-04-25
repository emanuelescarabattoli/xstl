/* eslint-disable jsx-a11y/no-access-key */

import style from "./style.module.css"

const Button = ({ text, onClick, accessKey }) => {
  return (
    <button className={style.buttonStandard} onClick={onClick} accessKey={accessKey}>{text}</button>
  );
};

export default Button;