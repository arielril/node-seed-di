// Update with your config settings.
require('dotenv').config();

module.exports = {
  local: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    pool: {
      min: process.env.DB_POOL_MIN,
      max: process.env.DB_POOL_MAX,
    },
    migrations: {
      tableName: process.env.DB_TABLE_MIGRATIONS,
    },
  },
};
