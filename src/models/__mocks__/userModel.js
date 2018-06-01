const moment = require('moment-timezone');

let userList = [
  {
    id: '1',
    name: 'nome correto agora',
    status: 'VALID',
    createdAt: '2018-05-31 12:24:51',
    updatedAt: '2018-05-31 12:27:07',
    deletedAt: null,
  },
  {
    id: '2',
    name: 'Ariel',
    status: 'DELETED',
    createdAt: '2018-05-31 12:25:10',
    updatedAt: '2018-05-31 12:36:49',
    deletedAt: '2018-05-31 12:05:48',
  },
  {
    id: '3',
    name: 'Ariel 2',
    status: 'VALID',
    createdAt: '2018-05-31 12:25:13',
    updatedAt: '2018-05-31 12:25:13',
    deletedAt: null,
  },
  {
    id: '4',
    name: 'Ariel 23',
    status: 'VALID',
    createdAt: '2018-05-31 12:25:15',
    updatedAt: '2018-05-31 12:25:15',
    deletedAt: null,
  },
  {
    id: '5',
    name: 'Ariel 234',
    status: 'VALID',
    createdAt: '2018-05-31 12:25:16',
    updatedAt: '2018-05-31 12:25:16',
    deletedAt: null,
  },
];

const list = jest.fn()
  .mockImplementation(async () => userList)
  .mockReturnValueOnce(Promise.reject());

const get = jest.fn()
  .mockImplementation(async ({ id }) => {
    id = parseInt(id, 10);
    if (userList.length < id) {
      return [];
    }

    return userList.find(user => user.id === String(id)) || {};
  })
  .mockReturnValueOnce(Promise.reject());

const insert = jest.fn()
  .mockImplementation(async (info) => {
    const nextId = userList.length + 1;

    const newUser = {
      ...info,
      id: String(nextId),
      createdAt: moment().format('YYYY-MM-DD HH:MM:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:MM:ss'),
    };

    userList.push(newUser);

    return String(nextId);
  })
  .mockReturnValueOnce(Promise.reject());

const update = jest.fn().mockImplementation(async (params) => {
  const {
    data,
  } = params;

  let {
    where: {
      id,
    },
  } = params;

  id = parseInt(id, 10);

  if (id > userList.length) {
    return;
  }

  const old = userList[id - 1];

  userList[id - 1] = {
    ...old,
    ...data,
  };
})
  .mockReturnValueOnce(Promise.reject());

const remove = jest.fn().mockImplementation(async ({ id }) => {
  id = parseInt(id, 10);

  if (id > userList.length) {
    return;
  }

  userList[id - 1] = undefined;

  userList = userList.filter(user => user);
})
  .mockReturnValueOnce(Promise.reject());

const makeUserModel = () => ({
  list,
  get,
  insert,
  update,
  remove,
  // catch: jest.fn().mockImplementation(val => val),
});

module.exports = {
  makeUserModel,
};
