/* .env lib */
require('dotenv').config();
const debug = require('debug')('worker');

/* Settings */
const Settings = require('./config/Settings');

/* Logger */
const LoggerConfig = require('./config/LoggerConfig');

/* Dependencies */
const Cron = require('./helpers/Cron');

/* Crons */
const EverySecond = require('./crons/EverySecond.js');

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
