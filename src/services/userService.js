function makeUserService(userModel) {
  return {
    list,
    get,
    insert,
    update,
    delete: _delete,
  };

  async function list() {
    try {
      const users = await userModel.list().catch(() => {
        throw new Error('Não foi possível listar usuários');
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

      const user = await userModel.get({ id }).catch(() => {
        throw new Error('Falha ao adiquirir usuario');
      });

      return {
        data: {
          user,
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async function insert(info) {
    try {
      const id = await userModel.insert(info).catch(() => {
        throw new Error('Não foi possível adicionar usuário');
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

      const user = await userModel.get({ id }).catch(() => {
        throw new Error('Usuário inexistente');
      });

      if (!user) {
        throw new Error('Usuário inexistente');
      }

      const updateData = {
        where: {
          id,
        },
        data: {
          name,
        },
      };

      await userModel.update(updateData).catch(() => {
        throw new Error('Falha ao atualizar usuário');
      });

      return;
    } catch (e) {
      throw e;
    }
  }

  async function _delete(info) {
    try {
      const { userId: id } = info;

      const user = await userModel.get({ id }).catch(() => {
        throw new Error('Usuário inexistente');
      });

      if (!user) {
        throw new Error('Usuário inexistente');
      }

      await userModel.remove({ id }).catch(() => {
        throw new Error('Falha ao deletar usuário');
      });

      return;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = { makeUserService };
