'use strict';

const fs = require('es6-fs');

class ClusterElem {
  constructor(data, type) {
    this.data = data;
    this.type = type;
  }

  printConsole() {
    console.log(`type: ${this.type}, data: ${this.data}`);
  }
}

const readData = function (fileName, dim, hasType = true) {
  let data = [];

  fs.readFile(`${__dirname}/${fileName}`)
    .then(contests => {
      const lines = contests.toString('utf8').split('\n');
      lines.forEach(line => {
        line = line.split('\t');
        const type = hasType ? parseInt(line.shift()) : null;
        const elem = line.map(x => parseFloat(x));

        const clusterElem = new ClusterElem(elem, type);
        data.push(clusterElem);
      });
    })
    .catch(err => console.error(err));
    console.log(data);
    return data;
};

module.exports = { ClusterElem, readData };
