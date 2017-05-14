const corePreset = require('./core-preset');
const jestPreset = require('neutrino-preset-jest');

module.exports = (neutrino) => {
  neutrino.use(corePreset);
  neutrino.use(jestPreset);
};
