/* .env lib */
require('dotenv').config();

/* Dependencies */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const bunyan = require('bunyan').createLogger({ name: 'some-app-name' });
const container = require('./container')();

const { knex } = require('./config/db');
const { makeUserModel } = require('./models/userModel');
const { makeUserService } = require('./services/userService');
const { makeUserController } = require('./controllers/userController');

/* Logger */
const LoggerConfig = require('./config/LoggerConfig');
const logger = require('./helpers/logger')({
  logger: bunyan,
});

container.register('db', knex);
// TODO: verificar se o logger tem como dependencia as suas configuracoes
container.register('logger', logger, null);
container.register('userModel', makeUserModel, ['db']);
container.register('userService', makeUserService, ['userModel']);
container.register('userController', makeUserController, [
  'logger',
  'userService',
]);

const { makeUserRoutes } = require('./routes/user');

/* Express initialization */
const app = express();
app.set('context', container);

/* Routes */
const userRoutes = makeUserRoutes(app);

/* Express utilites */
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json({
  limit: process.env.BODY_LIMIT,
}));

/* Status endpoint */
app.get(['/', '/status'], async (req, res) => {
  try {
    res.send('ok');
  } catch (err) {
    logger.error(err);
    res.status(500).send('error');
  }
});

/* Instatiate routes */
app.use('/user', userRoutes);

app.all('*', (req, res) => {
  res.status(404).send({ success: false, code: '404' });
});

module.exports = app;
