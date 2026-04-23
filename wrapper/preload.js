const { contextBridge, ipcRenderer, webUtils } = require("electron");

const electronAPI = {
  getArgvFile: () => ipcRenderer.invoke("get-argv-file"),
  getNextFile: filePath => ipcRenderer.invoke("get-next-file", filePath),
  getPreviousFile: filePath => ipcRenderer.invoke("get-previous-file", filePath),
  openWith: (executable, filePath) => ipcRenderer.invoke("open-with", executable, filePath),
  getPathForFile: file => webUtils.getPathForFile(file),
  onFileReceived: callback => ipcRenderer.on('file-received', (event, argvFile) => callback(argvFile)),
}

contextBridge.exposeInMainWorld("electronAPI", electronAPI)
