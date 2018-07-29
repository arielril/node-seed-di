const winston = require('winston');
const expressWinston = require('express-winston');
const request = require('request');
const debug = require('request-debug');
const moment = require('moment-timezone');
const { clone, each } = require('lodash');

const instances = {
  init: false,
  expressRequest: false,
  expressError: false,
};

function makeLoggerConf({ settings, logger }) {
  return {
    init,
    expressRequest,
    expressError,
  };

  function init() {
    if (instances.init) {
      throw Error('Logger: init already executed');
    }

    instances.init = true;
    winston.configure({
      exitOnError: false,
      levels: getLevels(),
      colors: getColors(),
      transports: getTransports(),
    });

    debug(request, requestDebugFormatter);
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
  }

  function getTransports() {
    const transports = [
      new winston.transports.Console({
        timestamp: () => {
          return moment.utc().format('YYYY-MM-DD HH:mm:ss');
        },
        json: false,
        colorize: true,
      }),
    ];


    return transports;
  }

  function getLevels() {
    return {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7, // 'debug' entries were not displayed
    };
  }

  function getColors() {
    return {
      emerg: 'bgRed',
      alert: 'bgMagenta',
      crit: 'bgRed',
      error: 'red',
      warning: 'yellow',
      notice: 'bgBlue',
      info: 'green',
      debug: 'white',
    };
  }

  function requestDebugFormatter(type, data) {
    let message = null;
    let status = 0;

    if (type === 'request') {
      message = {
        id: data.debugId,
        type,
        date: moment.utc().format('YYYY-MM-DD hh:mm:ss'),
        url: data.uri,
        method: data.method,
        message: data.body,
      };
    } else if (type === 'response') {
      status = data.statusCode;
      message = {
        id: data.debugId,
        type,
        date: moment.utc().format('YYYY-MM-DD hh:mm:ss'),
        status,
        message: data.body,
      };
    }

    if (message) {
      switch (getLevelByStatusCode(status)) {
        case 'warning': logger.warning(message); break;
        case 'error': logger.error(message); break;
        case 'crit': logger.crit(message); break;
        default: logger.info(message);
      }
    } else {
      logger.warning(type, data);
    }
  }

  function replacePropertyValue(keys, object) {
    const newObject = clone(object);

    each(object, (val, key) => {
      if (keys.indexOf(key) !== -1) {
        newObject[key] = '******';
      } else if (typeof (val) === 'object') {
        newObject[key] = replacePropertyValue(keys, val);
      }
    });

    return newObject;
  }

  function expressRequest(app) {
    if (instances.expressRequest) {
      throw Error('Logger: expressRequest already executed');
    }

    instances.expressRequest = true;
    app.use(expressWinston.logger(getLoggerOptions()));
  }

  function expressError(app) {
    if (instances.expressError) {
      throw Error('Logger: expressError already executed');
    }

    instances.expressError = true;
    app.use(expressWinston.errorLogger(getLoggerOptions()));

    app.use((err, req, res, next) => { // eslint-disable-line
      res.status(err.status || 500);
      res.send({ code: 0, message: 'Falha interna do servidor' });
    });
  }

  function getLevelByStatusCode(code) {
    let level = 'info';
    if (code >= 400) { level = 'warning'; }
    if (code >= 500) { level = 'error'; }
    if (code === 401 || code === 403) { level = 'crit'; }
    return level;
  }

  function getLoggerOptions() {
    const requestFilterBlacklist = ['headers', 'httpVersion', 'originalUrl'];
    const responseFilterBlacklist = [];
    const bodyBlacklist = settings.get('LOG_BODY_BLACKLIST') || [];
    const ignoredRoutes = ['/', '/status', '/favicon.ico'];

    return {
      winstonInstance: winston,
      meta: true,
      msg: 'HTTP {{res.statusCode}} {{req.method}} {{req.url}}',
      expressFormat: false,
      colorStatus: true,
      ignoredRoutes,
      requestFilter: (req, propName) => {
        if (requestFilterBlacklist.indexOf(propName) >= 0) {
          return undefined;
        }
        return req[propName];
      },
      responseFilter: (res, propName) => {
        if (responseFilterBlacklist.indexOf(propName) >= 0) {
          return undefined;
        }

        if (propName === 'body' && res[propName] && bodyBlacklist.length > 0) {
          return replacePropertyValue(bodyBlacklist, res[propName]);
        }

        return res[propName];
      },
      dynamicMeta: (req) => {
        return {
          session: req.session ? req.session.id : null,
          user: req.session ? req.session.user.id : null,
        };
      },
      skip: (req) => {
        const method = req.method.toUpperCase();
        if (method === 'GET' || method === 'OPTIONS') {
          return true;
        }

        return false;
      },
    };
  }
}

module.exports = {
  makeLoggerConf,
};
