const Joi = require('joi');
const RouteValidator = require('../../middlewares/routeValidator');

class UserSchema extends RouteValidator {
  static get get() {
    const schema = {
      params: Joi.object().keys({
        userId: Joi.number().integer().required(),
      }),
    };

    return this.validate(schema);
  }

  static get list() {
    const schema = {};

    return this.validate(schema);
  }

  static get insert() {
    const schema = {
      body: Joi.object().keys({
        name: Joi.string().required(),
      }),
    };

    return this.validate(schema);
  }

  static get update() {
    const schema = {
      params: Joi.object().keys({
        userId: Joi.number().integer().required(),
      }),
      body: Joi.object().keys({
        name: Joi.string().required(),
      }),
    };

    return this.validate(schema);
  }

  static get delete() {
    const schema = {
      params: Joi.object().keys({
        userId: Joi.number().integer().required(),
      }),
    };

    return this.validate(schema);
  }

}

module.exports = UserSchema;
