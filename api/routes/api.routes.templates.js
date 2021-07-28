const express = require("express");
const router = express.Router();
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);
const cookieParser = require("cookie-parser");

express().use(cookieParser());

/** ROUTE TEMPLATES**/
router.get("/", async (req, res) => {
  await knex("route_templates")
    .select("*")
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.get("/:route_id", async (req, res) => {
  await knex("stage_templates")
    .join(
      "route_templates",
      "route_templates.id",
      "stage_templates.route_template_id"
    )
    .where({ route_template_id: req.params.route_id })
    .select(
      "route_templates.name as route_name",
      "route_templates.group_id",
      "route_templates.instructions as route_instructions",
      "stage_templates.name as stage_name",
      "stage_templates.instructions as stage_instructions",
      "stage_templates.suspense_hours"
    )
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.post("/post", async (req, res) => {
  await knex("route_templates")
    .insert({
      name: req.body.name,
      group_id: req.body.group_id,
      instructions: req.body.instructions,
    })
    .returning("id")
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch(() =>
      res
        .status(404)
        .json({
          message: `Provided route name has already been used and created. Please use a different name or modify the existing route.`,
        })
        .end()
    );
});

router.patch("/patch", async (req, res) => {
  await knex("route_templates")
    .where({
      id: req.body.route_template_id,
    })
    .update({
      name: req.body.name,
      group_id: req.body.group_id,
      instructions: req.body.instructions,
      updated_at: new Date(),
    })
    .returning("id")
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch(() =>
      res
        .status(404)
        .json({
          message: `Provided route name has already been used and created. Please use a different name or modify the existing route.`,
        })
        .end()
    );
});

router.delete("/delete", async (req, res) => {
  await knex("route_templates")
    .del()
    .where({
      id: req.body.route_template_id,
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then(res.status(200).json({ message: `Success` }).end());
});

/** STAGE TEMPLATES**/
router.get("/stages/templates", async (req, res) => {
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
