/* .env lib */
require('dotenv').config();

const Settings = require('./config/Settings');
const debug = require('debug')('app');
const LoggerConfig = require('./config/LoggerConfig');
const { knex } = require('./config/db');

const app = require('./app');

debug('load settings');
(async () => {
  await Settings.load({ db: knex })
    .catch((err) => {
      console.log('ERRO SETTING LOAD', err);
    });
  await LoggerConfig.init();

  debug('Starting server');
  app.listen(process.env.PORT, () => {
    debug(`Server started on port ${process.env.PORT}`);
  });
})();
