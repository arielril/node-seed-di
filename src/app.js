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
const { makeUserModel } = require('./models/UserModel');
const { makeUserService } = require('./services/UserService');
const { makeUserController } = require('./controllers/UserController');

/* Logger */
const LoggerConfig = require('./config/LoggerConfig');
const Logger = require('./helpers/logger')({
  logger: bunyan,
});

container.register('db', knex);
container.register('Logger', Logger, null, true);
container.register('userModel', makeUserModel, ['db']);
container.register('userService', makeUserService, ['userModel']);
container.register('userController', makeUserController, [
  'Logger',
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
    Logger.error(err);
    res.status(500).send('error');
  }
});

/* Instatiate routes */
app.use('/user', userRoutes);

app.all('*', (req, res) => {
  res.status(404).send({ success: false, code: '404' });
});

module.exports = app;
