const nodePreset = require('neutrino-preset-node');
const path = require('path');

module.exports = (neutrino) => {
  const { config } = neutrino;

  neutrino.use(nodePreset);

  config.resolve.modules
    .add(path.join(neutrino.options.root, 'packages'))
  ;
};
