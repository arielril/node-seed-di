
exports.up = async (knex) => {
  try {
    await knex.raw(`
      CREATE DATABASE IF NOT EXISTS seedProjectDi
      DEFAULT CHARACTER SET utf8
      DEFAULT COLLATE utf8_general_ci;
    `);

    await knex.raw(`
      CREATE TABLE IF NOT EXISTS settings (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(80) NOT NULL,
        type ENUM('BOOLEAN', 'NUMBER', 'FLOAT', 'STRING', 'OBJECT') NOT NULL,
        value TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updateAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE INDEX name_UNIQUE (name ASC)
      ) ENGINE = InnoDB;
    `);

    await knex.raw(`
      CREATE TABLE IF NOT EXISTS user (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(500) NOT NULL,
        status VARCHAR (7) NOT NULL DEFAULT 'VALID',
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedAt TIMESTAMP NULL,
        PRIMARY KEY (id)
      ) ENGINE = InnoDB;
    `);

    await knex('settings').insert([
      {
        name: 'LOG_BODY_BLACKLIST',
        type: 'OBJECT',
        value: '["password"]',
      },
      {
        name: 'CRON_EVERY_SECOND',
        type: 'STRING',
        value: '* * * * * *',
      },
    ]);
  } catch (e) {
    throw e;
  }
};

exports.down = async () => {};
