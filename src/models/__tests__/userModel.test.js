const { makeUserModel } = require('../userModel');

describe('Should test user model', () => {
  let userModel;

  const userToAdd = {
    name: 'Teste 123',
  };

  beforeAll(() => {
    const db = {
      from: jest.fn(),
      where: jest.fn(),
      whereNot: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      returning: jest.fn(value => (value === 'id' ? (Math.random() * 100).toFixed(0) : 'return')),
    };

    db.from = jest.fn().mockReturnValue(db);
    db.insert = jest.fn().mockReturnValue(db);
    db.where = jest.fn().mockReturnValue(db);
    db.whereNot = jest.fn().mockReturnValue(db);
    db.update = jest.fn().mockReturnValue(db);

    userModel = makeUserModel(db);
  });

  it('Test user model (insert)', () => {
    expect(userModel.insert(userToAdd)).toBeDefined();
  });
});
