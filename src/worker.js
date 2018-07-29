/* .env lib */
require('dotenv').config();
const debug = require('debug')('worker');

/* Settings */
const Settings = require('./config/settings');

/* Logger */
const LoggerConfig = require('./config/loggerConfig');

/* Dependencies */
const Cron = require('./helpers/cron');

/* Crons */
const EverySecond = require('./crons/everySecond.js');

/* Services */
const services = [];

debug('load settings');
(async () => {
  await Settings.load();
  await LoggerConfig.init();

  debug('load workers');
  Cron.add(Settings.get('CRON_EVERY_SECOND'), EverySecond.runner);

  debug('start workers');
  Cron.startAll();

  debug(`Worker started ${services.length} services`);
})();
