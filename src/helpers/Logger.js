function makeLogger({ logger }) {
  return {
    alert,
    critic,
    error,
    warning,
    throw: _throw,
  };

  function alert(...args) {
    logger.alert(args);
  }

  function critic(...args) {
    logger.critic(args);
  }

  function error(...args) {
    logger.error(args);
  }

  function warning(...args) {
    logger.warn(args);
  }

  function _throw(...args) {
    const [res, code, err] = args && args.length > 0 ? args : [];

    if (err && err.code) {
      code += `.${err.code}`;
    }

    const message = err && err.message ? err.message : 'logger throw';

    error(...args);
    res.status(500)
      .send({
        success: false,
        code,
        message,
      });
  }
}

module.exports = makeLogger;
