const    { app, BrowserWindow } = require('electron');
const                      path = require('path');
const                       url = require('url');
const { ClusterElem, readData } = require('./app/som/cluster-elem');
const                       SOM = require('./app/som/som');

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

// Console Output

const data = readData('dataset.txt', false);
const som = new SOM(data, 2);
const clusters = som.clusters(data);

clusters.forEach((cluster) => cluster.print());
console.log(`clusters count: ${clusters.length}`);
