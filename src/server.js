/* .env lib */
require('dotenv').config();

const settings = require('./config/settings');
const debug = require('debug')('app');
const winston = require('winston');
const { knex } = require('./config/db');
const { makeLogger } = require('./helpers/logger');
const { makeLoggerConf } = require('./config/loggerConfig');

const app = require('./app');

/* Logger */
const logger = makeLogger(winston);

debug('load settings');
(async () => {
  await settings.load({ db: knex });
  const loggerConfig = makeLoggerConf({ settings, logger });
  loggerConfig.init();
  loggerConfig.expressError(app);
  loggerConfig.expressRequest(app);

  debug('Starting server');
  app.listen(process.env.PORT, () => {
    debug(`Server started on port ${process.env.PORT}`);
  });
})();
