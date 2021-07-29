const express = require("express");
const router = express.Router();
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);

router.get("/", async (req, res) => {
  let include_users = req.query.include_users;
  if (include_users) {
    await knex
      .select("id AS group_id", "name AS group_name")
      .from("groups")
      .then(async (groups) => {
        let results = [];
        // return groups.map(async (group) => {
        for (let i = 0; i < groups.length; i++) {
          let tmpObj = {};
          tmpObj.group_id = groups[i].group_id;
          tmpObj.group_name = groups[i].group_name;
          tmpObj.users = await knex
            .select(
              "users.id AS user_id",
              "users.fname",
              "users.lname",
              "users.rank",
              "users.email",
              "users.supervisor_id"
            )
            .from("users")
            .join("memberships", "users.id", "=", "memberships.user_id")
            .where("memberships.group_id", groups[i].group_id);
          results.push(tmpObj);
        }
        return results;
      })
      .then((data) => {
        res.status(201).json(data).end();
      });
  } else {
    await knex("groups")
      .select("*")
      .then((data) => {
        res.status(200).json(data).end();
      });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  await knex("groups")
    .where("groups.id", id)
    .select(
      "groups.id AS group_id",
      "groups.name",
      "users.id AS user_id",
      "users.fname",
      "users.lname",
      "users.rank",
      "users.email",
      "users.supervisor_id"
    )
    .join("memberships", "groups.id", "=", "memberships.group_id")
    .join("users", "memberships.user_id", "=", "users.id")
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.post("/post", async (req, res) => {
  await knex("groups")
    .insert({
      name: req.body.name,
      parent_id: req.body.parent_id,
    })
    .returning("id")
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch(() =>
      res
        .status(404)
        .json({
          message: `Provided group has already been registered and exists in our database. Please try creating a different group name.`,
        })
        .end()
    );
});

router.patch("/update", async (req, res) => {
  await knex("groups")
    .where("id", req.body.group_id)
    .update({
      name: req.body.name,
      parent_id: req.body.parent_id,
    })
    .returning("id")
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch(() =>
      res
        .status(404)
        .json({
          message: `Unable to find group id.`,
        })
        .end()
    );
});

router.delete("/delete", async (req, res) => {
  await knex("groups")
    .del()
    .where({
      id: req.body.group_id,
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then(res.status(200).json({ message: `Success` }).end());
});

router.get("/memberships", async (req, res) => {
  await knex("memberships")
    .select("*")
    .then((data) => {
      res.status(200).json(data).end();
    });
});

module.exports = router;
