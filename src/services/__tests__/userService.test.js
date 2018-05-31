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

  const validGetResponse = {
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
    },
  };

  const validInsertResponse = {
    data: {
      type: 'object',
      properties: {
        insertedId: {
          type: 'string',
        },
      },
    },
  };

  beforeAll(() => {
    userService = makeUserService({
      model: makeUserModel(),
    });
  });

  it('Should LIST users', async () => {
    const response = await userService.list();

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(Object);
    expect(response).toMatchSchema(validGetResponse);
  });

  it('Should GET one user', async () => {
    const response = await userService.get({
      userId: (Math.random() * 10).toFixed(0),
    });

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(Object);
    expect(response).toMatchSchema({
      data: {
        type: 'object',
        properties: {
          user: validUser,
        },
      },
    });
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
    } = await userService.get({ userId: response.data.insertedId });

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(Object);
    expect(newUser.name).toBe(user.name);
  });
});
