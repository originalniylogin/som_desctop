const       _ = require('lodash');
const Cluster = require('./cluster');

class SOM {
  constructor(trainingSamples, dim) {
    this.neurons = trainingSamples.map((elem) => ({
      weight: elem.val, 
      cluster: new Cluster(4)
    }));

    for (let i = 0; i < trainingSamples.length/3*2; ++i)
      this.neurons.splice(Math.floor(Math.random() * this.neurons.length), 1);

    trainingSamples.forEach((elem, iteration) => {
      const sample = elem.val;
      const minNeuron = _.minBy(this.neurons, (neuron) => Cluster.euclidianDistanse(sample, neuron.weight));
      minNeuron.cluster.addElem(elem);

      this.neurons.forEach((neuron) => {
        const dist = Cluster.euclidianDistanse(neuron.weight, minNeuron.weight);
        const learning_rate = 0.5 * Math.exp(-iteration / trainingSamples.length);
        const decay = Math.exp(-iteration / trainingSamples.length);
        const adjust = Math.exp(-(dist*dist)/(2*decay*decay));

        neuron.weight = neuron.weight.map((x, i) => x + adjust*learning_rate*(sample[i] - x));
      })

      this._uniteNeurons(minNeuron);
    });
  }

  clusters(dataSet) {
    const clusters = this.neurons.map((neuron) => new Cluster(neuron.weight));

    dataSet.forEach((elem) => {
      const closest = _.minBy(clusters, (cluster) => Cluster.euclidianDistanse(elem.val, cluster.center));
      closest.addElem(elem);
    });

    return clusters;
  }

  _uniteNeurons(neuronToUnite) {
    let wereUniouns = false;
    let radius = neuronToUnite.cluster.radius();

    this.neurons = this.neurons.filter((neuron) => {
      if (
        !_.eq(neuron, neuronToUnite)
        && Cluster.euclidianDistanse(neuron.cluster.center, neuronToUnite.cluster.center) < radius
      ) {
        neuron.cluster.elems.forEach((elem) => neuronToUnite.cluster.addElem(elem));
        radius = neuronToUnite.cluster.radius();
        return false;
      } else {
        return true;
      }
    });

    if (wereUniouns) {
      this._uniteNeurons(neuronToUnite);
    }
  }
}

module.exports = SOM;
