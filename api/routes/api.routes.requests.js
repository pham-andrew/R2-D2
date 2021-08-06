const express = require("express");
const router = express.Router();
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);
const cookieParser = require("cookie-parser");

express().use(cookieParser());

/** ROUTE REQUEST-ONLY ROUTES**/
router.get("/", async (req, res) => {
  await knex("requests")
    .select("*")
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.post("/post", async (req, res) => {
  await knex("requests")
    .insert({
      subject: req.body.subject,
      initiator_id: req.body.initiator_id,
      route_template_id: req.body.route_template_id,
      comments: req.body.comments,
      change_log: `Name: ${req.body.rank} ${
        req.body.lname
      }, Date: ${new Date().toGMTString()},
      Comments: ${req.body.comments}\n`,
    })
    .returning("id")
    .then(async (data) => {
      let request_stages = req.body.route_template.stages;
      for (let i = 0; i < request_stages.length; i++) {
        let request_substages = request_stages[i].substages;
        await knex("request_stages")
          .insert({
            request_id: data[0],
            name: request_stages[i].stage_name,
            suspense_hours: request_stages[i].suspense_hours,
            instructions: request_stages[i].stage_instructions,
          })
          .returning("id")
          .then(async (data) => {
            for (let j = 0; j < request_substages.length; j++) {
              await knex("request_substages").insert({
                request_stage_id: data[0],
                group_id: request_substages[j].group_id,
                supervisor_id: request_substages[j].supervisor_id || null,
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

router.patch("/patch", async (req, res) => {
  await knex("requests")
    .where({
      id: req.body.request_id,
    })
    .update({
      name: req.body.name,
      group_id: req.body.group_id,
      instructions: req.body.instructions,
      updated_at: `${new Date().toGMTString()}`,
      change_log: `Name: ${req.body.rank} ${
        req.body.lname
      }, Date: ${new Date().toGMTString()},
      Comments: ${req.body.comments}\n`,
      status: req.body.status,
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

router.patch("/resubmit", async (req, res) => {
  const {
    rank,
    lname,
    notes,
    request_stage_id,
    request_id,
    change_log,
    current_stage,
  } = req.body;
  const status = "Pending Action";

  await knex("requests")
    .where({
      id: request_id,
    })
    .update({
      current_stage: current_stage + 1,
      change_log:
        change_log +
        `Name: ${rank} ${lname}, Date: ${new Date().toGMTString()}, Comments: ${notes}\n`,
    })
    .then(async () => {
      await knex("request_stages")
        .where({
          id: request_stage_id,
        })
        .update({
          status: status,
        });
    })
    .then(async () => {
      await knex("request_substages")
        .where({
          id: request_stage_id,
        })
        .update({
          status: status,
          notes: null,
          user_id: null,
        });
    })
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch((error) =>
      res
        .status(404)
        .json({
          message: `Error, you have entered the darkside.`,
          error: error,
        })
        .end()
    );
});

router.patch("/patch/substage/approve", async (req, res) => {
  const {
    rank,
    lname,
    user_id,
    notes,
    substage_id,
    request_stage_id,
    request_id,
    change_log,
    final_stage,
    current_stage,
    next_stage_id,
  } = req.body;
  const status = "Approved";
  let proceed = true;

  await knex("request_substages")
    .where({
      id: substage_id,
    })
    .update({
      status: status,
      notes: notes,
      user_id: user_id,
      completed_at: `${new Date().toGMTString()}`,
    })
    .then(async () => {
      return knex("request_substages").select("status").where({
        request_stage_id: request_stage_id,
      });
    })
    .then(async (rows) => {
      rows.forEach((row) => {
        if (row.status !== "Approved") return (proceed = false);
      });
      if (proceed && request_stage_id) {
        await knex("request_stages")
          .where({
            id: request_stage_id,
          })
          .update({
            status: status,
            completed_at: `${new Date().toGMTString()}`,
          })
          .then(async () => {
            await knex("request_stages")
              .where({
                id: next_stage_id,
              })
              .update({
                status: "Pending Action",
              });
          })
          .then(async () => {
            await knex("request_stages")
              .where({
                id: next_stage_id,
              })
              .update({
                status: "Pending Action",
              });
          });
      }
    })
    .then(async () => {
      if (proceed && final_stage) {
        await knex("requests")
          .where({
            id: request_id,
          })
          .update({
            status: "Completed",
            completed_at: `${new Date().toGMTString()}`,
            change_log:
              change_log +
              `Name: ${rank} ${lname}, Date: ${new Date().toGMTString()}, Comments: ${notes}\n`,
          });
      } else if (proceed) {
        await knex("requests")
          .where({
            id: request_id,
          })
          .update({
            current_stage: current_stage + 1,
            change_log:
              change_log +
              `Name: ${rank} ${lname}, Date: ${new Date().toGMTString()}, Comments: ${notes}\n`,
          });
      } else {
        await knex("requests")
          .where({
            id: request_id,
          })
          .update({
            change_log:
              change_log +
              `Name: ${rank} ${lname}, Date: ${new Date().toGMTString()},
            Comments: ${notes}\n`,
          });
      }
    })
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch((error) =>
      res
        .status(404)
        .json({
          message: `Error, you have entered the darkside.`,
          error: error,
        })
        .end()
    );
});

router.patch("/patch/substage/deny", async (req, res) => {
  const {
    rank,
    lname,
    user_id,
    notes,
    request_stage_id,
    request_id,
    change_log,
    current_stage,
    substage_id,
  } = req.body;
  const status = "Denied";
  let proceed = true;

  await knex("request_substages")
    .where({
      id: substage_id,
    })
    .update({
      status: status,
      notes: notes,
      user_id: user_id,
    })
    .then(async () => {
      return knex("request_substages").select("status").where({
        request_stage_id: request_stage_id,
      });
    })
    .then(async (rows) => {
      rows.forEach((row) => {
        if (row.status === "Approved" || row.status === "Pending Action")
          return (proceed = false);
      });
      if (proceed) {
        await knex("request_stages")
          .where({
            id: request_stage_id,
          })
          .update({
            status: status,
          });
      }
    })
    .then(async () => {
      if (proceed) {
        await knex("requests")
          .where({
            id: request_id,
          })
          .update({
            current_stage: current_stage - 1,
            change_log:
              change_log +
              `Name: ${rank} ${lname}, Date: ${new Date().toGMTString()}, Comments: ${notes}\n`,
          });
      } else {
        await knex("requests")
          .where({
            id: request_id,
          })
          .update({
            change_log:
              change_log +
              `Name: ${rank} ${lname}, Date: ${new Date().toGMTString()},
            Comments: ${notes}\n`,
          });
      }
    })
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch((error) =>
      res
        .status(404)
        .json({
          message: `Error, you have entered the darkside.`,
          error: error,
        })
        .end()
    );
});

router.delete("/delete", async (req, res) => {
  await knex("requests")
    .del()
    .where({
      id: req.body.request_id,
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then(res.status(200).json({ message: `Success` }).end());
});

/** REQUEST_STAGE_SUBSTAGE JOIN TABLES **/
router.get("/:request_id", async (req, res) => {
  await knex("request_stages")
    .join("requests", "requests.id", "request_stages.request_id")
    .where({ request_id: req.params.request_id })
    .select(
      "requests.id AS request_id",
      "request_stages.id AS stage_id",
      "request_stages.name AS stage_name",
      "request_stages.instructions AS stage_instructions",
      "request_stages.suspense_hours"
    )
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.get("/:request_id/:request_stage_id", async (req, res) => {
  await knex("request_substages")
    .join(
      "request_stages",
      "request_stages.id",
      "request_substages.request_stage_id"
    )
    .where({ request_stage_id: req.params.request_stage_id })
    .join("requests", "requests.id", "request_stages.request_id")
    .where({ request_id: req.params.request_id })
    .select(
      "request_stages.request_id AS request_id",
      "request_substages.request_stage_id AS stage_id",
      "request_substages.id AS substage_id",
      "request_substages.group_id",
      "request_substages.supervisor_id"
    )
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.get("/get/all/details", async (req, res) => {
  let results = [];
  await knex("requests")
    .select("*")
    .then(async (rows) => {
      for (let i = 0; i < rows.length; i++) {
        results.push({
          request_subject: rows[i].subject,
          request_id: rows[i].id,
          request_instructions: rows[i].instructions,
          subject: req.body.subject,
          initiator_id: rows[i].initiator_id,
          route_template_id: rows[i].route_template_id,
          comments: rows[i].comments,
          current_stage: rows[i].current_stage,
          status: rows[i].status,
          change_log: rows[i].change_log,
          stages: [],
        });

        await knex("request_stages")
          .select("*")
          .where({ request_id: rows[i].id })
          .orderBy("id")
          .then(async (rows) => {
            for (let j = 0; j < rows.length; j++) {
              results[i].stages.push({
                stage_id: rows[j].id,
                stage_name: rows[j].name,
                stage_instructions: rows[j].instructions,
                suspense_hours: rows[j].suspense_hours,
                completed_at: rows[j].completed_at,
                status: rows[j].status,
                substages: [],
              });

              await knex("request_substages")
                .select("*")
                .where({ request_stage_id: rows[j].id })
                .then((rows) => {
                  for (let k = 0; k < rows.length; k++) {
                    results[i].stages[j].substages.push({
                      stage_id: rows[k].request_stage_id,
                      substage_id: rows[k].id,
                      group_id: rows[k].group_id,
                      supervisor_id: rows[k].supervisor_id || null,
                      status: rows[k].status,
                      notes: rows[k].notes,
                      user_id: rows[k].user_id,
                      completed_at: rows[k].completed_at,
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

router.get("/get/all/details/:request_id", async (req, res) => {
  let results = [];
  await knex("requests")
    .select("*")
    .where({ id: req.params.request_id })
    .then(async (rows) => {
      for (let i = 0; i < rows.length; i++) {
        results.push({
          request_subject: rows[i].subject,
          request_id: rows[i].id,
          request_instructions: rows[i].instructions,
          initiator_id: rows[i].initiator_id,
          route_template_id: rows[i].route_template_id,
          comments: rows[i].comments,
          current_stage: rows[i].current_stage,
          status: rows[i].status,
          change_log: rows[i].change_log,
          stages: [],
        });

        await knex("request_stages")
          .select("*")
          .where({ request_id: rows[i].id })
          .then(async (rows) => {
            for (let j = 0; j < rows.length; j++) {
              results[i].stages.push({
                stage_id: rows[j].id,
                stage_name: rows[j].name,
                stage_instructions: rows[j].instructions,
                suspense_hours: rows[j].suspense_hours,
                completed_at: rows[j].completed_at,
                status: rows[j].status,
                substages: [],
              });

              await knex("request_substages")
                .select("*")
                .where({ request_stage_id: rows[j].id })
                .then((rows) => {
                  for (let k = 0; k < rows.length; k++) {
                    results[i].stages[j].substages.push({
                      stage_id: rows[k].request_stage_id,
                      substage_id: rows[k].id,
                      supervisor_id: rows[k].supervisor_id || null,
                      group_id: rows[k].group_id,
                      status: rows[k].status,
                      notes: rows[k].notes,
                      user_id: rows[k].user_id,
                      completed_at: rows[k].completed_at,
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
