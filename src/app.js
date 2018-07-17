/* .env lib */
require('dotenv').config();

/* Dependencies */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const container = require('./container')();

// make dependencies
const { knex } = require('./config/db');
const { makeUserModel } = require('./models/userModel');
const { makeUserService } = require('./services/userService');
const { makeUserController } = require('./controllers/userController');
const { makeLogger } = require('./helpers/logger');
const bunyan = require('./config/bunyan.config');

/* Attach dependencies */
container.register('db', knex);
container.singleton('loggerConfig', bunyan);
container.register('logger', makeLogger, ['loggerConfig']);
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
    const logger = container.get('logger');
    logger.error(err);
    res.status(500).send('error');
  }
});

/* Instatiate routes */
app.use('/user', userRoutes);

/* 404 - NOT FOUND ROUTE RESPONSE */
app.all('*', (req, res) => {
  res.status(404).send({ success: false, code: '404' });
});

module.exports = app;
