/* .env lib */
require('dotenv').config();
const debug = require('debug')('worker');

/* Settings */
const settings = require('./config/settings');

/* Logger */
const LoggerConfig = require('./config/LoggerConfig');

/* Dependencies */
const Cron = require('./helpers/cron');

/* Crons */
const EverySecond = require('./crons/everySecond.js');

/* Services */
const services = [];

debug('load settings');
(async () => {
  await settings.load();
  await LoggerConfig.init();

  debug('load workers');
  Cron.add(settings.get('CRON_EVERY_SECOND'), EverySecond.runner);

  debug('start workers');
  Cron.startAll();

  debug(`Worker started ${services.length} services`);
})();
