const _ = require('lodash');

class Cluster {
  constructor(initializer) {
    this.elems = [];
    this.center = Array.isArray(initializer) ? initializer : new Array(initializer).fill(0);
  }

  print() {
    console.log(`center: ${this.center}, size: ${this.elems.length}`);
    console.log('elems: [');
    this.elems.forEach((elem) => elem.print());
    console.log(']\n');
  }

  addElem(clusterElem) {
    this.center = _.zipWith(this.center, clusterElem.val, (x, y) => {
      return (x * this.elems.length + y) / (this.elems.length + 1)
    });
    this.elems.push(clusterElem);
  }

  radius(alpha) {
    return alpha * _.sumBy(this.elems, (clusterElem) => {
      return Cluster.euclidianDistanse(this.center, clusterElem.val);
    }) / this.elems.length;
  }

  static euclidianDistanse(vec1, vec2) {
    return Math.sqrt(_.sum(_.zipWith(vec1, vec2, (x, y) => (x-y)*(x-y))));
  }
}

module.exports = Cluster;
