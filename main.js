const    { app, BrowserWindow } = require('electron');
const                      path = require('path');
const                       url = require('url');
const { ClusterElem, readData } = require('./app/som/cluster-elem');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.openDevTools();
  // readData('iris.txt', 4);

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

const irises = readData('iris.txt');
irises.forEach(iris => iris.printConsole());
/*
const fs = require('es6-fs');
fs.readFile(`${__dirname}/${filename = 'iris.txt'}`)
    .then(contests => {
      const lines = contests.toString('utf8').split('\n');
      lines.forEach(line => {
        console.log(line.split('\t'));
      })
    })
    .catch(err => console.error(err));
*/
