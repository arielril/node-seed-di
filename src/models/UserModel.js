const moment = require('moment-timezone');

const userType = require('../types/user');

const TABLE_NAME = 'user';

const makeUserModel = db => ({
  list: () => db.from(TABLE_NAME)
    .whereNot('status', userType.DELETED),

  get: id => db.from(TABLE_NAME)
    .where('id', id)
    .whereNot('status', userType.DELETED),

  insert: (info) => {
    const insertData = JSON.parse(JSON.stringify(info));

    return db.from(TABLE_NAME)
      .insert(insertData)
      .returning('id');
  },

  update: (params) => {
    const {
      where,
      data,
    } = params;

    const updateData = JSON.parse(JSON.stringify(data));

    return db.from(TABLE_NAME)
      .update(updateData)
      .where(where)
      .whereNot('status', userType.DELETED);
  },

  delete: id => db.from(TABLE_NAME)
    .where({ id })
    .update({
      status: userType.DELETED,
      deletedAt: moment().toNow(),
    }),
});

module.exports = { makeUserModel };
