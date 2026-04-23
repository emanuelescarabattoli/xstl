import { useEffect, useMemo, useRef, useState } from "react"
import style from "./style.module.css"

const isHexColor = value => /^#[0-9a-f]{6}$/i.test(value || "")

const clamp = value => Math.min(255, Math.max(0, value))

const rgbToHex = (r, g, b) => {
  const toHex = channel => clamp(channel).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const hexToRgb = value => {
  const hex = (value || "").replace("#", "")
  if (!/^[0-9a-f]{6}$/i.test(hex)) return { r: 255, g: 255, b: 255 }

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  }
}

const PRESET_COLORS = [
  "#ffffff",
  "#f5f5f5",
  "#ebebeb",
  "#d6d6d6",
  "#c2c2c2",
  "#a8a8a8",
  "#8a8a8a",
  "#666666",
  "#4a4a4a",
  "#2d2d2d",
  "#111111",
  "#1f3a5f",
  "#264653",
  "#336592",
  "#2f7fb8",
  "#3182ce",
  "#4ea8de",
  "#5dade2",
  "#7bdff2",
  "#00b4d8",
  "#90e0ef",
  "#f4a261",
  "#cc8800",
  "#e49a1f",
  "#f6aa1c",
  "#f2c14e",
  "#e9c46a",
  "#ffd166",
  "#770000",
  "#8b0000",
  "#b22222",
  "#c1121f",
  "#e63946",
  "#ef476f",
  "#ff5d8f",
  "#007700",
  "#1b7f5a",
  "#1f9d55",
  "#2a9d8f",
  "#52b788",
  "#74c69d",
  "#95d5b2",
  "#003566",
  "#000077",
  "#14213d",
  "#1d3557",
  "#3a0ca3",
  "#4361ee",
  "#4895ef",
  "#560bad",
  "#7209b7",
  "#8338ec",
  "#b5179e",
  "#e6e6e6",
  "#ff4f81",
  "#ff7f50",
  "#ffb703",
  "#06d6a0",
  "#f72585",
  "#ff006e",
]

const ColorSelector = ({ label, value, onChange }) => {
  const normalizedValue = String(value || "").toLowerCase()
  const initialHex = isHexColor(normalizedValue) ? normalizedValue : "#ffffff"
  const initialRgb = useMemo(() => hexToRgb(initialHex), [initialHex])

  const [isOpen, setIsOpen] = useState(false)
  const [hexInput, setHexInput] = useState(initialHex)
  const [rgb, setRgb] = useState(initialRgb)
  const pickerRef = useRef(null)

  useEffect(() => {
    const nextHex = isHexColor(normalizedValue) ? normalizedValue : "#ffffff"
    setHexInput(nextHex)
    setRgb(hexToRgb(nextHex))
  }, [normalizedValue])

  useEffect(() => {
    if (!isOpen) return undefined

    const onClickOutside = event => {
      if (!pickerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    window.addEventListener("mousedown", onClickOutside)
    return () => window.removeEventListener("mousedown", onClickOutside)
  }, [isOpen])

  const currentHex = rgbToHex(rgb.r, rgb.g, rgb.b)

  const onChangeRgb = (channel, nextValue) => {
    const parsedValue = Number(nextValue)
    const updatedRgb = { ...rgb, [channel]: clamp(parsedValue) }
    const updatedHex = rgbToHex(updatedRgb.r, updatedRgb.g, updatedRgb.b)
    setRgb(updatedRgb)
    setHexInput(updatedHex)
    onChange(updatedHex)
  }

  const onChangeHexInput = event => {
    const nextValue = event.target.value.toLowerCase()
    setHexInput(nextValue)

    if (!isHexColor(nextValue)) return

    const updatedRgb = hexToRgb(nextValue)
    setRgb(updatedRgb)
    onChange(nextValue)
  }

  const onSelectPreset = preset => {
    const presetHex = preset.toLowerCase()
    setHexInput(presetHex)
    setRgb(hexToRgb(presetHex))
    onChange(presetHex)
  }

  return (
    <div className={style.row}>
      <span className={style.label}>{label}</span>
      <div className={style.colors} ref={pickerRef}>
        <button
          type="button"
          className={style.customTrigger}
          style={{ backgroundColor: currentHex }}
          onClick={() => setIsOpen(value => !value)}
          aria-label={`${label}: open custom color picker`}
          title="Custom color"
        />
        {isOpen ? (
          <div className={style.pickerPopover}>
            <div className={style.previewRow}>
              <input
                className={style.hexInput}
                value={hexInput}
                onChange={onChangeHexInput}
                aria-label={`${label}: hex color`}
                maxLength={7}
                spellCheck={false}
              />
            </div>
            <div className={style.presetRow}>
              {PRESET_COLORS.map(preset => {
                const normalizedPreset = preset.toLowerCase()
                const isSelected = normalizedPreset === currentHex
                return (
                  <button
                    key={preset}
                    type="button"
                    className={`${style.presetButton} ${isSelected ? style.presetSelected : ""}`}
                    style={{ backgroundColor: preset }}
                    onClick={() => onSelectPreset(preset)}
                    aria-label={`${label}: preset ${preset}`}
                    title={preset}
                  />
                )
              })}
            </div>
            <label className={style.sliderRow}>
              <span>R</span>
              <input type="range" min="0" max="255" value={rgb.r} onChange={event => onChangeRgb("r", event.target.value)} />
              <span>{rgb.r}</span>
            </label>
            <label className={style.sliderRow}>
              <span>G</span>
              <input type="range" min="0" max="255" value={rgb.g} onChange={event => onChangeRgb("g", event.target.value)} />
              <span>{rgb.g}</span>
            </label>
            <label className={style.sliderRow}>
              <span>B</span>
              <input type="range" min="0" max="255" value={rgb.b} onChange={event => onChangeRgb("b", event.target.value)} />
              <span>{rgb.b}</span>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ColorSelector