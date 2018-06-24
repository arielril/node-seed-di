const express = require('express');
const schema = require('./schemas/UserSchema');

function makeUserRoutes(app) {
  const container = app.get('context');
  const controller = container.get('userController');
  const router = express.Router();

  router
    .route('/')
    .get(schema.list, controller.list)
    .post(schema.insert, controller.insert);

  router
    .route('/:userId')
    .get(schema.get, controller.get)
    .put(schema.update, controller.update)
    .delete(schema.delete, controller.delete);

  return router;
}

module.exports = { makeUserRoutes };
