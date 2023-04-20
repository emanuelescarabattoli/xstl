const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs");

const loadArgsFile = () => ({ content: fs.readFileSync(path.join(__dirname, "cube.stl")), fileName: "cube.stl" });

// Store the main window settings in a variable.
const mainWindowSettings = {
  width: 800,
  height: 600,
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    nodeIntegration: true
  }
};

// Enable the DevTools if the app is in development mode.
if (process.env.NODE_ENV === 'development') {
  mainWindowSettings.webPreferences.devTools = true;
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow(mainWindowSettings);

  win.webContents.send('loadArgsFile', loadArgsFile());

  // Load the appropriate URL depending on the environment.
  const startUrl = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'index.html')
    : 'http://localhost:3000';

  win.loadURL(startUrl);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // Menu.setApplicationMenu(null)

  // On macOS, it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});