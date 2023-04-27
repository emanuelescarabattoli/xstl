const { contextBridge, ipcRenderer } = require("electron");

const electronAPI = {
  getArgvFile: () => ipcRenderer.invoke("get-argv-file"),
  getNextFile: filePath => ipcRenderer.invoke("get-next-file", filePath),
  getPreviousFile: filePath => ipcRenderer.invoke("get-previous-file", filePath),
  onFileReceived: callback => ipcRenderer.on('file-received', (event, argvFile) => callback(argvFile)),
}

contextBridge.exposeInMainWorld("electronAPI", electronAPI)
