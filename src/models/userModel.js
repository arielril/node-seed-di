const moment = require('moment-timezone');

const userType = require('../types/user');

const TABLE_NAME = 'user';

function makeUserModel(db) {
  return {
    list,
    get,
    insert,
    update,
    remove,
  };

  function list() {
    return db.from(TABLE_NAME);
  }

  function get({ id }) {
    return db.from(TABLE_NAME)
      .where('id', id)
      .whereNot('status', userType.DELETED);
  }

  function insert(info) {
    const insertData = JSON.parse(JSON.stringify(info));

    return db.from(TABLE_NAME)
      .insert(insertData)
      .returning('id');
  }

  function update(params) {
    const {
      where,
      data,
    } = params;

    const updateData = JSON.parse(JSON.stringify(data));

    return db.from(TABLE_NAME)
      .update(updateData)
      .where(where)
      .whereNot('status', userType.DELETED);
  }

  function remove({ id }) {
    return db.from(TABLE_NAME)
      .where({ id })
      .update({
        status: userType.DELETED,
        deletedAt: moment().format('YYYY-MM-DD HH:MM:ss'),
      });
  }
}

module.exports = { makeUserModel };
