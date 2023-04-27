const defaultSettings = { bedColor: "#336592", modelColor: "#cc8800", isBedVisible: true, isAxesVisible: false, bedSize: 220, bedGridCellSize: 10 };

export const parseSettings = () => {
  const settingsString = localStorage.getItem("settings");
  if (settingsString) {
    return JSON.parse(settingsString);
  }
  return defaultSettings;
}

export const saveSettings = settings => {
  localStorage.setItem("settings", JSON.stringify(settings));
}