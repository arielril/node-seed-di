const Logger = require('../helpers/Logger');

function runner() {
  return Logger.info('Every second started...');
}

module.exports = {
  runner,
};
