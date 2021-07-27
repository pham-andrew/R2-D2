const express = require("express");
const router = express.Router();
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);

router.get("/", async (req, res) => {
  await knex("groups")
    .select("*")
    .then((data) => {
    res.status(200).json(data).end()
    })
});

module.exports = router;