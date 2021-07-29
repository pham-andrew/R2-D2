const express = require("express");
const router = express.Router();
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);
const cookieParser = require("cookie-parser");

express().use(cookieParser());

/** STAGE TEMPLATES**/
router.get("/", async (req, res) => {
  await knex("stage_templates")
    .select("*")
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.post("/post", async (req, res) => {
  await knex("stage_templates")
    .insert({
      name: req.body.name,
      route_template_id: req.body.route_template_id,
      suspense_hours: req.body.suspense_hours,
      instructions: req.body.instructions,
    })
    .returning("id")
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch((err) =>
      res
        .status(404)
        .json({
          message: `Encountered ${err}`,
        })
        .end()
    );
});

module.exports = router;
