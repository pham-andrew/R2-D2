const path = require("path");

const dbConnection =
  process.env.NODE_ENV === "production"
    ? `postgres://${process.env.PG_USER}:${process.env.APP_DB_ADMIN_PASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PG_DATABASE}`
    : `postgres://postgres:docker@localhost:5432/r2d2`;

console.log(dbConnection);

module.exports = {
  development: {
    client: "pg",
    connection: dbConnection,
    ssl: {
      rejectUnauthorized: false,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.join(__dirname, "/migrations"),
    },
    seeds: { directory: path.join(__dirname, "/seeds") },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: dbConnection,
    ssl: {
      rejectUnauthorized: false,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
