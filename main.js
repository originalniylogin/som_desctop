'use strict';

const    { app, BrowserWindow, ipcMain } = require('electron');
const                               path = require('path');
const                                url = require('url');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    acceptFirstMouse: true,
    titleBarStyle: 'hidden',
    frame: false,
    resizable: false,
    width: 820,
    height: 875
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-clsed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('close-main-window', () => app.quit());
ipcMain.on('minimize-main-window', () => mainWindow.minimize());