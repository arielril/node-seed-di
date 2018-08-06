const sinon = require('sinon');
const makeContainer = require('../container.js');
const { makeUserService } = require('../services/UserService');

function getFakeUserModel() {
  return {
    list: sinon.stub().resolves([{ name: 'teste' }, { name: 'teste2' }]),
    get: sinon.stub().resolves({ name: 'teste' })
  };
}

describe('userService tests', () => {
  it('Should list users correctly', async () => {
    const container = makeContainer();
    container.register('userModel', getFakeUserModel());
    container.register('userService', makeUserService, ['userModel']);
    const userService = container.get('userService');
    const users = await userService.list();
    expect(users.data.users.length).toBe(2);
    expect(users.data.users[0].name).toBe('teste');
    expect(users.data.users[1].name).toBe('teste2');
  });

  it('Should throw error when userModel returns error', async () => {
    const container = makeContainer();
    const fakeUserModel = getFakeUserModel();
    fakeUserModel.list = sinon.stub().rejects('Erro no model');
    container.register('userModel', fakeUserModel);
    container.register('userService', makeUserService, ['userModel']);
    const userService = container.get('userService');
    let erroService;
    try {
      await userService.list();
    } catch (err) {
      erroService = err;
    }
    expect(erroService.message).toBe('Não foi possível listar usuários');
  });

  it('Should get user correctly', async () => {
    const container = makeContainer();
    container.register('userModel', getFakeUserModel());
    container.register('userService', makeUserService, ['userModel']);
    const userService = container.get('userService');
    const user = await userService.get({ userId: 1 });
    expect(user.data.user.name).toBe('teste');
  });

  it('Should throw error on get when userModel returns error', async () => {
    const container = makeContainer();
    const fakeUserModel = getFakeUserModel();
    fakeUserModel.get = sinon.stub().rejects('Erro no model');
    container.register('userModel', fakeUserModel);
    container.register('userService', makeUserService, ['userModel']);
    const userService = container.get('userService');
    let erroService;
    try {
      await userService.get({ userId: 1 });
    } catch (err) {
      erroService = err;
    }
    expect(erroService.message).toBe('Falha ao adiquirir usuario');
  });
});
