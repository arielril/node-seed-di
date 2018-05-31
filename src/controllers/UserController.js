const Logger = require('../helpers/Logger');

function sendResponse(res, data) {
  res.status(data ? 200 : 204)
    .send({
      success: true,
      data,
    });
}

const makeUserController = ({ service }) => ({
  list: async (req, res) => {
    try {
      const { data } = await service.list();

      sendResponse(res, data);
    } catch (e) {
      Logger.throw(res, '2015167517', e);
    }
  },

  get: async (req, res) => {
    try {
      const find = {
        ...req.params,
        ...req.body,
      };

      const { data } = await service.get(find);

      sendResponse(res, data);
    } catch (e) {
      Logger.throw(res, '4076319627', e);
    }
  },

  insert: async (req, res) => {
    try {
      const insertData = {
        ...req.body,
      };

      const { data } = await service.insert(insertData);

      sendResponse(res, data);
    } catch (e) {
      Logger.throw(res, '2082461482', e);
    }
  },

  update: async (req, res) => {
    try {
      const updateData = {
        ...req.params,
        ...req.body,
      };

      const { data } = await service.update(updateData);

      sendResponse(res, data);
    } catch (e) {
      Logger.throw(res, '2351002392', e);
    }
  },

  delete: async (req, res) => {
    try {
      const deleteData = {
        ...req.params,
        ...req.query,
      };

      await service.delete(deleteData);

      sendResponse(res);
    } catch (e) {
      throw e;
    }
  },
});

module.exports = { makeUserController };
