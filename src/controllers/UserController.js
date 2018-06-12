function makeUserController({ Logger, service }) {
  return {
    list,
    get,
    insert,
    update,
    delete: _delete,
  };

  function sendResponse(res, data) {
    res.status(data ? 200 : 204)
      .send({
        success: true,
        data,
      });
  }

  async function list(req, res) {
    try {
      const { data } = await service.list();

      sendResponse(res, data);
    } catch (e) {
      Logger.throw(res, '2015167517', e);
    }
  }

  async function get(req, res) {
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
  }

  async function insert(req, res) {
    try {
      const insertData = {
        ...req.body,
      };

      const { data } = await service.insert(insertData);

      sendResponse(res, data);
    } catch (e) {
      Logger.throw(res, '2082461482', e);
    }
  }

  async function update(req, res) {
    try {
      const updateData = {
        ...req.params,
        ...req.body,
      };

      await service.update(updateData);

      sendResponse(res);
    } catch (e) {
      Logger.throw(res, '2351002392', e);
    }
  }

  async function _delete(req, res) {
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
  }
}

module.exports = { makeUserController };
