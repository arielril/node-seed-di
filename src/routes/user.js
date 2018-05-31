const express = require('express');
const schema = require('./schemas/UserSchema');

const { knex } = require('../config/db');
const { makeUserModel } = require('../models/userModel');
const { makeUserService } = require('../services/userService');
const { makeUserController } = require('../controllers/userController');

const model = makeUserModel(knex);
const service = makeUserService({ model });
const controller = makeUserController({ service });

const makeUserRoutes = () => {
  const router = express.Router();

  router.route('/')
    .get(schema.list, controller.list)
    .post(schema.insert, controller.insert);

  router.route('/:userId')
    .get(schema.get, controller.get)
    .put(schema.update, controller.update)
    .delete(schema.delete, controller.delete);

  return router;
};

module.exports = { makeUserRoutes };
