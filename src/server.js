/* .env lib */
require('dotenv').config();

const Settings = require('./config/settings');
const debug = require('debug')('app');
const { knex } = require('./config/db');

const app = require('./app');

/* Logger */
const LoggerConfig = require('./config/loggerConfig');

/* Log express request and response */
LoggerConfig.expressRequest(app);

/* Log errors */
LoggerConfig.expressError(app);

debug('load settings');
(async () => {
  await Settings.load({ db: knex });
  await LoggerConfig.init();

  debug('Starting server');
  app.listen(process.env.PORT, () => {
    debug(`Server started on port ${process.env.PORT}`);
  });
})();
