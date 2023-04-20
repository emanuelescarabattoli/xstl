const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
  "electronAPI", {
  onLoadArgsFile: (callback) => ipcRenderer.on("loadArgsFile", (event, result) => callback(result)),
})
