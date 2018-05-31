const moment = require('moment-timezone');

const toUnixEpoch = dateString => moment.utc(dateString).valueOf();

module.exports = {
  toUnixEpoch,
};
