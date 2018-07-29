/* Logger use RFC5424 */
function makeLogger(logger) {
  return {
    emerg,
    alert,
    crit,
    error,
    warning,
    notice,
    info,
    blacklists,
    throw: _throw,
  };

  function emerg(...args) {
    logger.log('emerg', ...args);
  }

  function alert(...args) {
    logger.log('alert', ...args);
  }

  function crit(...args) {
    logger.log('crit', ...args);
  }

  function error(...args) {
    logger.log('error', ...args);
  }

  function warning(...args) {
    logger.log('warning', ...args);
  }

  function notice(...args) {
    logger.log('notice', ...args);
  }

  function info(...args) {
    logger.log('info', ...args);
  }

  function blacklists(req, list = []) {
    req._routeBlacklists.body = list; // eslint-disable-line
  }

  function _throw(res, code, ...args) {
    const [err] = args && args.length > 0 ? args : [null];

    if (err && err.code) {
      code += `.${err.code}`; // eslint-disable-line
    }

    const message = err && err.message ? err.message : res.__('helpers.logger.throw');

    this.error(...args);
    res.status(500)
      .send({
        success: false,
        code,
        message,
      });
  }
}

module.exports = { makeLogger };
