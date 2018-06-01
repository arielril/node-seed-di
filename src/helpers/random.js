const moment = require('moment-timezone');

function getRandomInt10() {
  return (moment().valueOf() * parseInt((Math.random() * 10).toFixed(), 10)) % 11;
}

module.exports = {
  getRandomInt10,
};
