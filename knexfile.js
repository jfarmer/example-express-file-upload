module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/express_file_upload_dev',
    debug: false,
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
