const customError = (code, message = '') => {
  let erro;

  if (message instanceof Error) {
    erro = message;
  } else {
    erro = new Error(message);
  }

  erro.code = `${erro.code ? `${erro.code}.` : ''}${code}`;

  return erro;
};

module.exports = {
  customError,
};
