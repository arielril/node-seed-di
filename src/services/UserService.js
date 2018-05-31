const makeUserService = ({ model }) => ({
  list: async () => {
    try {
      const users = await model.list()
        .catch(() => {
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
  },

  get: async (data) => {
    try {
      const {
        userId: id,
      } = data;

      const user = await model.get({ id })
        .catch(() => {
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
  },

  insert: async (info) => {
    try {
      const id = await model.insert(info)
        .catch(() => {
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
  },

  update: async (data) => {
    try {
      const {
        userId: id,
        name,
      } = data;

      const user = await model.get({ id })
        .catch(() => {
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

      await model.update(updateData)
        .catch(() => {
          throw new Error('Falha ao atualizar usuário');
        });

      return;
    } catch (e) {
      throw e;
    }
  },

  delete: async (info) => {
    try {
      const {
        userId: id,
      } = info;

      const user = await model.get({ id })
        .catch(() => {
          throw new Error('Usuário inexistente');
        });

      if (!user) {
        throw new Error('Usuário inexistente');
      }

      await model.remove({ id })
        .catch(() => {
          throw new Error('Falha ao deletar usuário');
        });

      return;
    } catch (e) {
      throw e;
    }
  },
});

module.exports = { makeUserService };

