const moment = require('moment-timezone');

const toUnixEpoch = dateString => (dateString ? moment.utc(dateString).valueOf() : null);

module.exports = {
  toUnixEpoch,
};
