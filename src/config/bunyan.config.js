require('dotenv').config();

const bunyan = require('bunyan');

// TODO: Configurar para por de modo humano os logs no console

/** Configure Bunyan Logger */
const config = {
  name: 'node-seed-di',
  streams: [
    {
      level: 'debug',
      stream: process.stdout,
    },
  ],
  // nao usar esta propriedade em producao
  // utilizacao muito lenta!!!
  src: !(process.env.NODE_ENV === 'production'),
  serializers: bunyan.stdSerializers,
};

/** Exports the logger */
const logger = bunyan.createLogger(config);
// modifica o nome da funcao por questoes de compatibilidade com o
// logger helper
logger.critic = logger.fatal;

module.exports = logger;
