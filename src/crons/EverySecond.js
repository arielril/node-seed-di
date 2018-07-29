const Logger = require('../helpers/logger');

function runner() {
  return Logger.info('Every second started...');
}

module.exports = {
  runner,
};
