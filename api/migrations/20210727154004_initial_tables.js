exports.up = function (knex) {
  return knex.schema
    .createTable("groups", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.integer("parent_id");
      table.unique(["name"]);
    })

    .then(() => {
      return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("fname").notNullable();
        table.string("lname").notNullable();
        table.string("rank", [6]).notNullable();
        table.string("email").notNullable();
        table
          .integer("supervisor_id")
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE");
        table.string("role", [11]).defaultTo("Padawan").notNullable();
        table.string("password").notNullable();
        table.string("token");
        table.unique(["email"]);
      });
    })

    .then(() => {
      return knex.schema.createTable("memberships", (table) => {
        table.increments("id").primary();
        table
          .integer("user_id")
          .notNullable()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE");
        table
          .integer("group_id")
          .notNullable()
          .references("id")
          .inTable("groups")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
      });
    })

    .then(() => {
      return knex.schema.createTable("route_templates", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table
          .integer("group_id")
          .notNullable()
          .references("id")
          .inTable("groups")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.text("instructions").notNullable();
        table.timestamps(true, true); //created_at and updated_at
        table.unique(["name"]);
      });
    })

    .then(() => {
      return knex.schema.createTable("stage_templates", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table
          .integer("route_template_id")
          .notNullable()
          .references("id")
          .inTable("route_templates")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.integer("suspense_hours");
        table.text("instructions").notNullable();
      });
    })

    .then(() => {
      return knex.schema.createTable("substage_templates", (table) => {
        table.increments("id").primary();
        table
          .integer("group_id")
          .references("id")
          .inTable("groups")
          .onUpdate("CASCADE")
          .onDelete("CASCADE")
          .defaultTo(null);
        table
          .integer("supervisor_id")
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .defaultTo(null);
        table
          .integer("stage_template_id")
          .notNullable()
          .references("id")
          .inTable("stage_templates")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
      });
    })

    .then(() => {
      return knex.schema.createTable("requests", (table) => {
        table.increments("id").primary();
        table.string("subject").notNullable();
        table
          .integer("initiator_id")
          .notNullable()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE");
        table.integer("current_stage").defaultTo(0);
        table
          .integer("route_template_id")
          .notNullable()
          .references("id")
          .inTable("route_templates")
          .onUpdate("CASCADE");
        table.text("comments");
        table.text("change_log");
        table.text("status").defaultTo("En Route");
        table.timestamps(true, true); //created_at and updated_at
        table.date("completed_at");
      });
    })

    .then(() => {
      return knex.schema.createTable("request_stages", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.text("instructions").notNullable();
        table
          .integer("request_id")
          .notNullable()
          .references("id")
          .inTable("requests")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.integer("suspense_hours");
        table.string("status").defaultTo("Pending Action");
        table.timestamps(true, false);
        table.date("completed_at");
      });
    })

    .then(() => {
      return knex.schema.createTable("request_substages", (table) => {
        table.increments("id").primary();
        table
          .integer("group_id")
          .references("id")
          .inTable("groups")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .integer("supervisor_id")
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE");
        table
          .integer("request_stage_id")
          .notNullable()
          .references("id")
          .inTable("request_stages")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.string("status").defaultTo("Pending Action");
        table.text("notes");
        table
          .integer("user_id")
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE");
        table.timestamps(true, false);
        table.date("completed_at");
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("request_substages")
    .dropTableIfExists("request_stages")
    .dropTableIfExists("requests")
    .dropTableIfExists("substage_templates")
    .dropTableIfExists("stage_templates")
    .dropTableIfExists("route_templates")
    .dropTableIfExists("memberships")
    .dropTableIfExists("users")
    .dropTableIfExists("groups");
};
