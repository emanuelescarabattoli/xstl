const { contextBridge, ipcRenderer } = require("electron");
const path = require('path');


contextBridge.exposeInMainWorld(
  "electronAPI", {
    getArgvFile: () => ipcRenderer.invoke("get-argv-file"),
    getNextFile: filePath => ipcRenderer.invoke("get-next-file", filePath),
    getPreviousFile: filePath => ipcRenderer.invoke("get-previous-file", filePath),
})
