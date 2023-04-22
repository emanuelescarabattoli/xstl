const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs");

const getArgvFile = () => {
  if (!isDevelopmentEnv) {
    const argsFile = process.argv[1]
    if (argsFile) {
      return { content: fs.readFileSync(process.argv[1]), name: process.argv[1] };
    }
  }
  return undefined;
};

const isDevelopmentEnv = process.env.ENV === "development";

const developmentSettings = {
  width: 920,
  height: 680,
  minWidth: 920,
  minHeight: 680,
  icon: path.join(__dirname, "icon.png"),
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    nodeIntegration: true,
    devTools: true,
    webSecurity: false,
  },
  fullscreen: false,
  frame: true,
};

const productionSettings = {
  width: 920,
  height: 680,
  minWidth: 920,
  minHeight: 680,
  icon: path.join(__dirname, "icon.png"),
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    nodeIntegration: true,
    devTools: true,
    webSecurity: false,
  },
  fullscreen: false,
  frame: true,
};

const createWindow = () => {
  const mainWindow = new BrowserWindow(isDevelopmentEnv ? developmentSettings : productionSettings)
  if (isDevelopmentEnv) {
    mainWindow.loadURL("http://localhost:3000/");
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  }
}

app.whenReady().then(() => {
  ipcMain.handle("get-argv-file", getArgvFile)

  // if (process.env.ENV !== 'development') {
  //   Menu.setApplicationMenu(null)
  // }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})