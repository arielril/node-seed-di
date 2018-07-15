const { customError } = require('../helpers/customError');

function makeUserService(model) {
  return {
    list,
    get,
    insert,
    update,
    delete: _delete,
  };

  async function list() {
    try {
      const users = await model.list()
        .catch(() => {
          throw customError('772042367', 'Não foi possível listar usuários');
        });

      const result = users.map(item => item);

      return {
        data: {
          users: result,
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async function get(data) {
    try {
      const { userId: id } = data;

      const user = await model.get({ id })
        .catch(() => {
          throw customError('772042367', 'Falha ao adiquirir usuario');
        });

      return {
        data: {
          user: Array.isArray(user) ? {} : user,
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async function insert(info) {
    try {
      const id = await model.insert(info)
        .catch(() => {
          throw customError('772042367', 'Não foi possível adicionar usuário');
        });

      return {
        data: {
          insertedId: id,
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async function update(data) {
    try {
      const { userId: id, name } = data;

      const user = await model.get({ id })
        .catch(() => {
          throw customError('772042367', 'Usuário inexistente');
        });

      if (!user) {
        throw customError('772042367', 'Usuário inexistente');
      }

      const updateData = {
        where: {
          id,
        },
        data: {
          name,
        },
      };

      await model.update(updateData)
        .catch(() => {
          throw customError('772042367', 'Falha ao atualizar usuário');
        });

      return;
    } catch (e) {
      throw e;
    }
  }

  async function _delete(info) {
    try {
      const { userId: id } = info;

      const user = await model.get({ id })
        .catch(() => {
          throw customError('772042367', 'Usuário inexistente');
        });

      if (!user) {
        throw customError('772042367', 'Usuário inexistente');
      }

      await model.remove({ id })
        .catch(() => {
          throw customError('772042367', 'Falha ao deletar usuário');
        });

      return;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = { makeUserService };
