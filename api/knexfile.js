const path = require("path");

const dbConnection =  process.env.DATABASE_URL ||
  `postgres://postgres:docker@localhost:5432/r2d2`;

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
    ssl: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
