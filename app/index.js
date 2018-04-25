const  { ClusterElem, readData } = require('./som/cluster-elem');
const                        SOM = require('./som/som');
const { drawIris, drawClusters } = require('./drawing');
const            { ipcRenderer } = require('electron');
const                     Photon = require("electron-photon");

const closeEl = document.querySelector('.close');
const minimizeEl = document.querySelector('.minimize');
const chooseDataSetEl = document.querySelector('.choose-dataset');
const clusteringEl = document.querySelector('.clustering');
const alphaEl = document.querySelector('.alpha');
const saveEl = document.querySelector('.save');

let data = [];
let stage = null;

closeEl.addEventListener('click', () => ipcRenderer.send('close-main-window'));

minimizeEl.addEventListener('click', () => ipcRenderer.send('minimize-main-window'));

clusteringEl.addEventListener('click', () => {
  const som = new SOM(data, 4, parseFloat(alphaEl.value) || 2.2);
  const clusters = som.clusters(data);
  stage = drawClusters(clusters, data);
})

chooseDataSetEl.addEventListener('click', () => {
  Photon.DropDown(chooseDataSetEl, [
    {
      label: 'Fisher Iris',
      click: () => {
        data = readData('iris.txt');
        stage = drawIris(data);
      }
    },
    {
      label: 'Dataset I',
      click: () => {
        console.log('Clicked Item 2');
      }
    }
  ]);
});

function triggerDownload(imgURI) {
  var evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true
  });

  var a = document.createElement('a');
  a.setAttribute('download', 'Graphics.png');
  a.setAttribute('href', imgURI);
  a.setAttribute('target', '_blank');

  a.dispatchEvent(evt);
}

saveEl.addEventListener('click', () => {
  const svg = document.querySelector('svg');
  const canvas = document.getElementById('canvas');
  const svgSize = svg.getBoundingClientRect();
  canvas.width = svgSize.width;
  canvas.height = svgSize.height;
  const ctx = canvas.getContext('2d');
  const imgData = (new XMLSerializer()).serializeToString(svg);
  const DOMURL = window.URL || window.webkitURL || window;

  const img = new Image();
  const svgBlob = new Blob([imgData], {type: 'image/svg+xml;charset=utf-8'});
  const url = DOMURL.createObjectURL(svgBlob);

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    console.log(ctx);
    DOMURL.revokeObjectURL(url);

    const imgURI = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');

    triggerDownload(imgURI);
  };

  img.src = url;
});
