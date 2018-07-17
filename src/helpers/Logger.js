function makeLogger(logger) {
  return {
    info,
    critic,
    error,
    warn,
    throw: _throw,
    debug,
  };

  function debug(...args) {
    logger.debug(...args);
  }

  function info(...args) {
    logger.info(args);
  }

  function critic(...args) {
    logger.critic(args);
  }

  function error(...args) {
    logger.error(args);
  }

  function warn(...args) {
    logger.warn(args);
  }

  function _throw(...args) {
    // TODO: reescrever funcao para compartilhar com customError
    const [res, code, err] = args && args.length > 0 ? args : [];
    let errorCode = code;
    if (err && err.code) {
      errorCode += `.${err.code}`;
    }

    const message = err && err.message ? err.message : 'logger throw';

    error(...args);
    res.status(500)
      .send({
        success: false,
        code: errorCode,
        message,
      });
  }
}

module.exports = { makeLogger };
