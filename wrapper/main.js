const { app, BrowserWindow, ipcMain, Menu } = require("electron")
const path = require("path")
const fs = require("fs");

const getArgvFile = () => {
  if (!isDevelopmentEnv) {
    const argsFile = process.argv[1]
    if (argsFile) {
      return { content: fs.readFileSync(argsFile), name: argsFile };
    }
  }
  return undefined;
};

const getPreviousFile = (event, filePath) => {
  const basename = path.basename(filePath);
  const dirname = path.dirname(filePath);
  const files = fs.readdirSync(dirname).filter(item => item.endsWith(".stl"));
  let index = files.indexOf(basename) + 1;
  if (index > files.length - 1) index = 0;
  return { content: fs.readFileSync(path.join(dirname, files[index])), name: path.join(dirname, files[index]) };
};

const getNextFile = (event, filePath) => {
  const basename = path.basename(filePath);
  const dirname = path.dirname(filePath);
  const files = fs.readdirSync(dirname).filter(item => item.endsWith(".stl"));
  let index = files.indexOf(basename) - 1;
  if (index < 0) index = files.length - 1;
  return { content: fs.readFileSync(path.join(dirname, files[index])), name: path.join(dirname, files[index]) };
};

const isDevelopmentEnv = process.env.ENV === "development";

const developmentSettings = {
  width: 1000,
  height: 680,
  minWidth: 1000,
  minHeight: 680,
  icon: path.join(__dirname, "build", "icons", "icon_256x256.png"),
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
  width: 1000,
  height: 680,
  minWidth: 1000,
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
    mainWindow.loadFile(path.join(__dirname, "frontend-build", "index.html"));
  }
}

app.whenReady().then(() => {
  ipcMain.handle("get-argv-file", getArgvFile)
  ipcMain.handle("get-previous-file", getPreviousFile)
  ipcMain.handle("get-next-file", getNextFile)

  if (process.env.ENV !== 'development') {
    // Menu.setApplicationMenu(null)
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})