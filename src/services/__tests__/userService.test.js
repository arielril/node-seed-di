const { getRandomInt10: random } = require('../../helpers/random');

jest.mock('../../models/userModel.js');

const { makeUserModel } = require('../../models/userModel');
const { makeUserService } = require('../userService');

describe('Test of user service', () => {
  let userService;

  const validUser = {
    id: { type: 'string' },
    name: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    deletedAt: {
      type: 'string',
      allowNull: true,
    },
  };

  const validListResponse = {
    data: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: validUser,
          },
        },
      },
      require: ['users'],
    },
    required: ['data'],
  };

  const validGetResponse = {
    data: {
      type: 'object',
      properties: {
        user: validUser,
        required: ['user'],
      },
    },
    required: ['data'],
  };

  const validInsertResponse = {
    data: {
      type: 'object',
      properties: {
        insertedId: {
          type: 'string',
        },
      },
      required: ['insertedId'],
    },
    required: ['data'],
  };

  beforeAll(() => {
    userService = makeUserService({
      model: makeUserModel(),
    });
  });

  describe('Sad path', () => {
    it('Should LIST users', async () => {
      try {
        await userService.list();
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('Should GET one user', async () => {
      const testId = String(random());

      try {
        await userService.get({
          userId: testId,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('Should INSERT a new user', async () => {
      const newUser = {
        name: 'New user',
      };

      try {
        await userService.insert(newUser);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('Should UPDATE a user', async () => {
      const val = random();
      const testId = String(val === 0 ? 1 : val);
      const updateUser = {
        userId: testId,
        name: 'Thats a new name',
      };

      try {
        await userService.update(updateUser);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('Should DELETE a user', async () => {
      const val = random();
      const testId = String(val === 0 ? 1 : val);
      const deleteUser = {
        userId: testId,
      };

      try {
        await userService.delete(deleteUser);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }

      const {
        data: {
          user,
        },
      } = await userService.get(deleteUser);

      expect(user).toBeDefined();
      expect(user).toMatchSchema(validUser);

      expect(user.id).not.toBe(testId);
    });
  });

  describe('Happy path', () => {
    it('Should LIST users', async () => {
      const response = await userService.list();

      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(Object);
      expect(response).toMatchSchema(validListResponse);
    });

    it('Should GET one user', async () => {
      const testId = String(random());
      const response = await userService.get({
        userId: testId,
      });

      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(Object);
      expect(response).toMatchSchema(validGetResponse);

      const {
        data: {
          user,
        },
      } = response;

      expect(user).toMatchSchema(validUser);
      if (user.id) {
        expect(user.id).toBe(testId);
      }
    });

    it('Should INSERT a new user', async () => {
      const newUser = {
        name: 'New user',
      };

      const response = await userService.insert(newUser);

      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(Object);
      expect(response).toMatchSchema(validInsertResponse);

      const {
        data: {
          user,
        },
      } = await userService.get({
        userId: response.data.insertedId,
      });

      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(Object);
      expect(newUser.name).toBe(user.name);
    });

    it('Should UPDATE a user', async () => {
      const val = random();
      const testId = String(val === 0 ? 1 : val);
      const updateUser = {
        userId: testId,
        name: 'Thats a new name',
      };

      const response = await userService
        .update(updateUser);

      expect(response).toBe(undefined);

      const {
        data: {
          user,
        },
      } = await userService.get({
        userId: testId,
      });

      expect(user).toBeDefined();
      expect(user).toMatchSchema(validUser);
      if (user.id) {
        expect(user.id).toBe(updateUser.userId);
        expect(user.name).toBe(updateUser.name);
      }
    });

    it('Should DELETE a user', async () => {
      const val = random();
      const testId = String(val === 0 ? 1 : val);
      const deleteUser = {
        userId: testId,
      };

      const response = await userService.delete(deleteUser);

      expect(response).toBe(undefined);

      const {
        data: {
          user,
        },
      } = await userService.get(deleteUser);

      expect(user).toBeDefined();
      expect(user).toMatchSchema(validUser);

      expect(user.id).not.toBe(testId);
    });
  });
});
