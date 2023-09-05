import { useRef } from "react"
import style from "./style.module.css"
import Icon from "../icon"
import Button from "../button"
import { getFileName } from "../../utils"

const InputFile = ({ value, onChange }) => {
  const inputRef = useRef()

  const onClickChooseFile = () => {
    inputRef.current.click()
  }
  return (
    <>
      <Button onClick={onClickChooseFile} text={<Icon name="folder-open" />} />
      <span className={style.filePath}>{getFileName(value)}</span>
      <input ref={inputRef} style={{ display: "none" }} type="file" onChange={onChange} />
    </>
  );
};

export default InputFile;