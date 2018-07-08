/* .env lib */
require('dotenv').config();

/* Dependencies */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const Logger = require('./helpers/Logger');

const { knex } = require('./config/db');
const { makeUserModel } = require('./models/userModel');
const { makeUserService } = require('./services/userService');
const { makeUserController } = require('./controllers/userController');
const { makeUserRoutes } = require('./routes/user');

/* Express initialization */
const app = express();

/* Controllers */
const userController = makeUserController({
  Logger,
  service: makeUserService({
    model: makeUserModel(knex),
  }),
});

/* Routes */
const userRoutes = makeUserRoutes({
  controller: userController,
});

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
