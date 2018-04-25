const _ = require('lodash');

const colors = [
  '#e6194b',
	'#3cb44b',
  '#ffe119',
  '#0082c8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#d2f53c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#aa6e28',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000080',
  '#808080',
  '#FFFFFF',
	'#000000'
]
const irisDimensions = [
  'Sepal.Length',
  'Sepal.Width',
  'Petal.Length',
  'Petal.Width',
];
const irisScales = [
  ['4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5'],
  ['2.0', '2.5', '3.0', '3.5', '4.0', '4.5'],
  ['1', '2', '3', '4', '5', '6', '7'],
  ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5'],
];
const irisColors = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
];
const square = [
  [
    {top: null, right: null, bottom: null, left: null},
    {top: irisScales[1], right: null, bottom: null, left: null},
    {top: irisScales[2], right: null, bottom: null, left: null},
    {top: irisScales[3], right: irisScales[0], bottom: null, left: null},
  ],
  [
    {top: null, right: null, bottom: null, left: irisScales[1]},
    {top: null, right: null, bottom: null, left: null},
    {top: null, right: null, bottom: null, left: null},
    {top: null, right: irisScales[1], bottom: null, left: null},
  ],
  [
    {top: null, right: null, bottom: null, left: irisScales[2]},
    {top: null, right: null, bottom: null, left: null},
    {top: null, right: null, bottom: null, left: null},
    {top: null, right: irisScales[2], bottom: null, left: null},
  ],
  [
    {top: null, right: null, bottom: irisScales[0], left: irisScales[3]},
    {top: null, right: null, bottom: irisScales[1], left: null},
    {top: null, right: null, bottom: irisScales[2], left: null},
    {top: null, right: null, bottom: null, left: null},
  ],
];

const drawIris = function(data) {
  const container = document.getElementById('container');
  container.innerHTML = '';

  const stage = acgraph.create('container');
  for (let i = 0; i < 4; ++i) {
    const x0 = 190 * i + 40;
    for (let j = 0; j < 4; ++j) {
      const y0 = 190 * j + 40;
      stage.rect(x0, y0, 150, 150);

      if (i == j) {
        const text = stage.text(x0, y0, irisDimensions[i], { fontSize: '25px' });
        const posPath = stage.path();
        const xText = (150 - text.getWidth()) / 2;
        const yText = (150 + text.getHeight() - 10) / 2;

        posPath.moveTo(x0 + xText, y0 + yText);
        posPath.lineTo(x0 + xText + 2* text.getWidth(), y0 + yText);
        text.path(posPath)
      }
      else {
        scales = square[j][i];

        if (scales.top) {
          step = 150 / (scales.top.length - 1)

          for (let k = 0; k < scales.top.length; ++k) {
            const scalePath = stage.path();
            scalePath.moveTo(x0 + step * k, y0);
            scalePath.lineTo(x0 + step * k, y0 - 20);
            stage.text(x0 + step * k, y0 - 35, scales.top[k], { fontSize: '15px' });
          }
        }

        if (scales.right) {
          step = 150 / (scales.right.length - 1)

          for (let k = 0; k < scales.right.length; ++k) {
            const scalePath = stage.path();
            scalePath.moveTo(x0 + 150, y0 + step * k);
            scalePath.lineTo(x0 + 170, y0 + step * k);
            stage.text(x0 + 170, y0 + step * k - 15, scales.right[k], { fontSize: '15px' });
          }
        }

        if (scales.bottom) {
          step = 150 / (scales.bottom.length - 1)

          for (let k = 0; k < scales.bottom.length; ++k) {
            const scalePath = stage.path();
            scalePath.moveTo(x0 + step * k, y0 + 150);
            scalePath.lineTo(x0 + step * k, y0 + 170);
            stage.text(x0 + step * k, y0 + 167, scales.bottom[k], { fontSize: '15px' });
          }
        }

        if (scales.left) {
          step = 150 / (scales.left.length - 1)

          for (let k = 0; k < scales.left.length; ++k) {
            const scalePath = stage.path();
            scalePath.moveTo(x0, y0 + step * k);
            scalePath.lineTo(x0 - 20, y0 + step * k);
            stage.text(x0 - 35, y0  + step * k - 15, scales.left[k], { fontSize: '15px' });
          }
        }

        const minX = _.minBy(data, (clusterElem) => clusterElem.val[3 - i]).val[3 - i];
        const minY = _.minBy(data, (clusterElem) => clusterElem.val[3 - j]).val[3 - j];
        const xStep = 146 / (_.maxBy(data, (clusterElem) => clusterElem.val[3 - i]).val[3 - i] - minX);
        const yStep = 146 / (_.maxBy(data, (clusterElem) => clusterElem.val[3 - j]).val[3 - j] - minY);
        data.forEach(clusterElem => {
          point = stage.circle(x0 + 2 + Math.round(xStep * (clusterElem.val[3 - i] - minX)),
                                y0 + 2 + Math.round(yStep * (clusterElem.val[3 - j] - minY)), 2);

          point.fill(irisColors[clusterElem.type]);
        });
      }
    }
  }
  return stage;
}

const drawClusters = function(clusters, data) {
  const container = document.getElementById('container');
  container.innerHTML = '';

  const stage = acgraph.create('container');
  for (let i = 0; i < 4; ++i) {
    const x0 = 190 * i + 40;
    for (let j = 0; j < 4; ++j) {
      const y0 = 190 * j + 40;
      stage.rect(x0, y0, 150, 150);

      if (i == j) {
        const text = stage.text(x0, y0, irisDimensions[i], { fontSize: '25px' });
        const posPath = stage.path();
        const xText = (150 - text.getWidth()) / 2;
        const yText = (150 + text.getHeight() - 10) / 2;

        posPath.moveTo(x0 + xText, y0 + yText);
        posPath.lineTo(x0 + xText + 2* text.getWidth(), y0 + yText);
        text.path(posPath)
      }
      else {
        scales = square[j][i];

        if (scales.top) {
          step = 150 / (scales.top.length - 1)

          for (let k = 0; k < scales.top.length; ++k) {
            const scalePath = stage.path();
            scalePath.moveTo(x0 + step * k, y0);
            scalePath.lineTo(x0 + step * k, y0 - 20);
            stage.text(x0 + step * k, y0 - 35, scales.top[k], { fontSize: '15px' });
          }
        }

        if (scales.right) {
          step = 150 / (scales.right.length - 1)

          for (let k = 0; k < scales.right.length; ++k) {
            const scalePath = stage.path();
            scalePath.moveTo(x0 + 150, y0 + step * k);
            scalePath.lineTo(x0 + 170, y0 + step * k);
            stage.text(x0 + 170, y0 + step * k - 15, scales.right[k], { fontSize: '15px' });
          }
        }

        if (scales.bottom) {
          step = 150 / (scales.bottom.length - 1)

          for (let k = 0; k < scales.bottom.length; ++k) {
            const scalePath = stage.path();
            scalePath.moveTo(x0 + step * k, y0 + 150);
            scalePath.lineTo(x0 + step * k, y0 + 170);
            stage.text(x0 + step * k, y0 + 167, scales.bottom[k], { fontSize: '15px' });
          }
        }

        if (scales.left) {
          step = 150 / (scales.left.length - 1)

          for (let k = 0; k < scales.left.length; ++k) {
            const scalePath = stage.path();
            scalePath.moveTo(x0, y0 + step * k);
            scalePath.lineTo(x0 - 20, y0 + step * k);
            stage.text(x0 - 35, y0  + step * k - 15, scales.left[k], { fontSize: '15px' });
          }
        }

        const minX = _.minBy(data, (clusterElem) => clusterElem.val[3 - i]).val[3 - i];
        const minY = _.minBy(data, (clusterElem) => clusterElem.val[3 - j]).val[3 - j];
        const xStep = 146 / (_.maxBy(data, (clusterElem) => clusterElem.val[3 - i]).val[3 - i] - minX);
        const yStep = 146 / (_.maxBy(data, (clusterElem) => clusterElem.val[3 - j]).val[3 - j] - minY);

        clusters.forEach((cluster, index) => {
          cluster.elems.forEach(clusterElem => {
            point = stage.circle(x0 + 2 + Math.round(xStep * (clusterElem.val[3 - i] - minX)),
                                  y0 + 2 + Math.round(yStep * (clusterElem.val[3 - j] - minY)), 2);
  
            point.fill(colors[index]);
          });
        });
      }
    }
  }
  return stage;
}

module.exports = { drawIris, drawClusters }