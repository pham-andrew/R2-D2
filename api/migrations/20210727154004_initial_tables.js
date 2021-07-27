exports.up = function(knex) {

  return knex.schema
    .createTable("groups", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.integer("parent_id");
      table.unique(["name"]);
  })

  .then(() => {
    return knex.schema
      .createTable("users", (table) => {
        table.increments("id").primary();
        table.string("fname").notNullable();
        table.string("lname").notNullable();
        table.string("rank", [6]).notNullable();
        table.string("email").notNullable();
        table.integer("supervisor_id")
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE");
        table.string("role", [11]).defaultTo("Padawan").notNullable();
        table.string("password").notNullable();
        table.string("token");
        table.unique(["email", "password", "token"]);
      })
    })

    .then(() => {
      return knex.schema
        .createTable("memberships", (table) => {
          table.increments("id").primary();
          table.integer("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onUpdate("CASCADE");
          table.integer("group_id")
            .notNullable()
            .references("id")
            .inTable("groups")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        })
    })

    .then(() => {
      return knex.schema
        .createTable("routes", (table) => {
          table.increments("id").primary();
          table.string("name").notNullable();
          table.integer("group_id")
            .notNullable()
            .references("id")
            .inTable("groups")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
          table.timestamps(true, true); //created_at and updated_at
          table.unique(["name"]);
        })
    })
};

exports.down = function(knex) {
 return knex.schema
  .dropTableIfExists("routes")
  .dropTableIfExists("memberships")
  .dropTableIfExists("users")
  .dropTableIfExists("groups")
};
