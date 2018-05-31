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

const list = jest.fn().mockImplementation(async () => userList);

const get = jest.fn()
  .mockImplementation(async ({ id }) =>
    (userList.length - 1 < id ? [] : userList[id]));

const insert = jest.fn()
  .mockImplementation(async (info) => {
    const nextId = userList.length;

    userList.push(info);

    return String(nextId);
  });

const update = jest.fn().mockImplementation(async (params) => {
  const {
    where: {
      id,
    },
    data,
  } = params;

  if (id > userList.length - 1) {
    return;
  }

  const old = userList[id - 1];

  userList[id - 1] = {
    ...old,
    ...data,
  };
});

const remove = jest.fn().mockImplementation(async ({ id }) => {
  if (id > userList.length) {
    return;
  }

  userList[id - 1] = undefined;

  userList = JSON.parse(JSON.stringify(userList));
});

const makeUserModel = () => ({
  list,
  get,
  insert,
  update,
  remove,
});

module.exports = {
  makeUserModel,
};
