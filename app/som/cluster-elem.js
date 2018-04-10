'use strict';

const fs = require('fs');

class ClusterElem {
  constructor(val, type) {
    this.val = val;
    this.type = type;
  }

  print() {
    console.log(`type: ${this.type}, value: ${this.val}`);
  }
}

const readData = function (fileName, hasType = true) {
  let data = [];

  const contests = fs.readFileSync(`${__dirname}/${fileName}`, { encoding: 'utf8' });
  contests.split(/\r\n|\r|\n/).forEach((line) => {
    line = line.match(/\d+/g);
    const type = hasType ? parseInt(line.shift()) : null;
    const elem = line.map((x) => parseFloat(x));

    data.push(new ClusterElem(elem, type));
  })

  return data;
};

module.exports = { ClusterElem, readData };
