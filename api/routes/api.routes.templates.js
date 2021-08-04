const express = require("express");
const router = express.Router();
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);
const cookieParser = require("cookie-parser");

express().use(cookieParser());

/** ROUTE TEMPLATE-ONLY ROUTES**/
router.get("/", async (req, res) => {
  await knex("route_templates")
    .select("*")
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
    .then(async (data) => {
      let stage_templates = req.body.stages;
      for (let i = 0; i < stage_templates.length; i++) {
        let substage_templates = stage_templates[i].substages;
        await knex("stage_templates")
          .insert({
            route_template_id: data[0],
            name: stage_templates[i].stage_name,
            suspense_hours: stage_templates[i].suspense_hours,
            instructions: stage_templates[i].stage_instructions,
          })
          .returning("id")
          .then(async (data) => {
            if (substage_templates.supervisor_id) {
              await knex("substage_templates").insert({
                stage_template_id: data[0],
                supervisor_id: substage_templates.supervisor_id,
              });
            } else {
              for (let j = 0; j < substage_templates.length; j++) {
                await knex("substage_templates").insert({
                  stage_template_id: data[0],
                  group_id: substage_templates[j].id,
                  supervisor_id: substage_templates.supervisor_id,
                });
              }
            };

            })
          }
      }
    )
    .catch((err) =>
      res
        .status(404)
        .json({
          message: `Encountered ${err}`,
        })
        .end()
    )
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    );
});

router.patch("/patch", async (req, res) => {
  await knex("route_templates")
    .where({ id: req.body.route_id })
    .update({
      name: req.body.name,
      group_id: req.body.group_id,
      instructions: req.body.instructions,
    })
    .then(async () => {
      let stage_templates = req.body.stages;
      for (let i = 0; i < stage_templates.length; i++) {
        let substage_templates = stage_templates[i].substages;
        await knex("stage_templates")
          .where({ id: stage_templates[i].stage_id })
          .update({
            name: stage_templates[i].stage_name,
            suspense_hours: stage_templates[i].suspense_hours,
            instructions: stage_templates[i].stage_instructions,
          })
          .then(async () => {
            for (let j = 0; j < substage_templates.length; j++) {
              await knex("substage_templates")
                .where({ id: substage_templates[j].substage_id })
                .update({
                  group_id: substage_templates[j].group_id,
                  supervisor_id: substage_templates[j].supervisor_id || null,
                });
            }
          });
      }
    })
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

router.delete("/delete", async (req, res) => {
  await knex("route_templates")
    .del()
    .where({
      id: req.body.route_template_id,
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then(res.status(200).json({ message: `Success` }).end());
});

/** ROUTE_STAGE_SUBSTAGE TEMPLATES JOIN TABLES **/
router.get("/:route_id", async (req, res) => {
  await knex("stage_templates")
    .join(
      "route_templates",
      "route_templates.id",
      "stage_templates.route_template_id"
    )
    .where({ route_template_id: req.params.route_id })
    .select(
      "route_templates.id AS route_id",
      "stage_templates.id AS stage_id",
      "stage_templates.name AS stage_name",
      "stage_templates.instructions AS stage_instructions",
      "stage_templates.suspense_hours"
    )
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.get("/:route_id/:stage_id", async (req, res) => {
  await knex("substage_templates")
    .join(
      "stage_templates",
      "stage_templates.id",
      "substage_templates.stage_template_id"
    )
    .where({ stage_template_id: req.params.stage_id })
    .join(
      "route_templates",
      "route_templates.id",
      "stage_templates.route_template_id"
    )
    .where({ route_template_id: req.params.route_id })
    .select(
      "stage_templates.route_template_id AS route_id",
      "substage_templates.stage_template_id AS stage_id",
      "substage_templates.id AS substage_id",
      "substage_templates.group_id"
    )
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.get("/get/all/details", async (req, res) => {
  let results = [];
  await knex("route_templates")
    .select("*")
    .then(async (rows) => {
      for (let i = 0; i < rows.length; i++) {
        results.push({
          route_name: rows[i].name,
          route_id: rows[i].id,
          group_id: rows[i].group_id,
          route_instructions: rows[i].instructions,
          stages: [],
        });

        await knex("stage_templates")
          .select("*")
          .where({ route_template_id: rows[i].id })
          .then(async (rows) => {
            for (let j = 0; j < rows.length; j++) {
              results[i].stages.push({
                stage_id: rows[j].id,
                stage_name: rows[j].name,
                stage_instructions: rows[j].instructions,
                suspense_hours: rows[j].suspense_hours,
                substages: [],
              });

              await knex("substage_templates")
                .select("*")
                .where({ stage_template_id: rows[j].id })
                .then((rows) => {
                  for (let k = 0; k < rows.length; k++) {
                    results[i].stages[j].substages.push({
                      substage_id: rows[k].id,
                      group_id: rows[k].group_id,
                      supervisor_id: rows[k].supervisor_id,
                    });
                  }
                });
            }
          });
      }
      return results;
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.get("/get/all/details/:route_id", async (req, res) => {
  let results = [];
  await knex("route_templates")
    .select("*")
    .where({ id: req.params.route_id })
    .then(async (rows) => {
      for (let i = 0; i < rows.length; i++) {
        results.push({
          route_name: rows[i].name,
          route_id: rows[i].id,
          route_instructions: rows[i].instructions,
          stages: [],
        });

        await knex("stage_templates")
          .select("*")
          .where({ route_template_id: rows[i].id })
          .then(async (rows) => {
            for (let j = 0; j < rows.length; j++) {
              results[i].stages.push({
                stage_id: rows[j].id,
                stage_name: rows[j].name,
                stage_instructions: rows[j].instructions,
                suspense_hours: rows[j].suspense_hours,
                substages: [],
              });

              await knex("substage_templates")
                .select("*")
                .where({ stage_template_id: rows[j].id })
                .then((rows) => {
                  for (let k = 0; k < rows.length; k++) {
                    results[i].stages[j].substages.push({
                      substage_id: rows[k].id,
                      group_id: rows[k].group_id,
                      supervisor_id: rows[k].supervisor_id,
                    });
                  }
                });
            }
          });
      }
      return results;
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

module.exports = router;
