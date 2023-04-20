const { contextBridge, ipcRenderer } = require("electron");
const path = require('path');


contextBridge.exposeInMainWorld(
  "electronAPI", {
    getArgvFile: () => ipcRenderer.invoke("get-argv-file")
})
