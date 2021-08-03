const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);
const cookieParser = require("cookie-parser");

express().use(cookieParser());

async function encrypt(password, expense) {
  const result = await bcrypt.hash(password, expense);
  return result;
}

async function compareEncrypt(password, hashPassword) {
  const result = await bcrypt.compare(password, hashPassword);
  return result;
}

router.get("/", async (req, res) => {
  await knex("users")
    .select(
      "id",
      "fname",
      "lname",
      "rank",
      "role",
      "email",
      "supervisor_id",
      "password"
    )
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  await knex("users")
    .where("users.id", id)
    .select("*")
    .then(async (user) => {
      let tmpObj = {
        user_id: user[0].id,
        fname: user[0].fname,
        lname: user[0].lname,
        rank: user[0].rank,
        email: user[0].email,
        supervisor_id: user[0].supervisor_id,
      };
      tmpObj.groups = await knex
        .select("groups.id AS group_id", "groups.name AS group_name")
        .from("groups")
        .join("memberships", "groups.id", "=", "memberships.group_id")
        .where("memberships.user_id", user[0].id);
      user[0].supervisor_id
        ? (tmpObj.supervisor_name = await knex("users")
            .where({
              id: user[0].supervisor_id,
            })
            .select("fname", "lname", "rank")
            .then((data) => {
              return `${data[0].fname} ${data[0].lname} (${data[0].rank})`;
            }))
        : (tmpObj.supervisor_name = null);
      return tmpObj;
    })
    .then((data) => {
      res.status(200).json(data).end();
    });
});

router.post("/post", async (req, res) => {
  let password = await encrypt(`${req.body.password}`, 12);
  await knex("users")
    .insert({
      rank: req.body.rank,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: password,
      supervisor_id: req.body.supervisor_id,
    })
    .returning("id")
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch(() =>
      res
        .status(400)
        .json({
          message: `Provided email has already been registered and exists in our database. Please try registering again with a different email or login with the existing email.`,
        })
        .end()
    );
});

router.post("/login", async (req, res) => {
  await knex("users")
    .select("*")
    .where({
      email: req.body.email,
    })
    .then(async (rows) => {
      let match = await compareEncrypt(
        `${req.body.password}`,
        rows[0].password
      );

      if (!match) {
        res
          .status(401)
          .json({
            message:
              "The provided email or password does not match our records. Please try again or register as a new user.",
          })
          .end();
      } else {
        let token = await encrypt(`${req.body.email}`, 12);
        await knex("users")
          .update({ token: token })
          .where({ email: req.body.email });
        res
          .cookie("token", token, { maxAge: 90000000 })
          .json({
            user_id: rows[0].id,
            rank: rows[0].rank,
            fname: rows[0].fname,
            lname: rows[0].lname,
            password: `${req.body.password}`,
            email: rows[0].email,
            role: rows[0].role,
            supervisor_id: rows[0].supervisor_id,
          })
          .status(200)
          .end();
      }
    })
    .catch((err) =>
      res.status(401).json({
        message:
          "The provided email or password does not match our records. Please try again or register as a new user.",
        error: err,
      })
    );
});

router.patch("/patch", async (req, res) => {
  let password = await encrypt(`${req.body.password}`, 12);
  await knex("users")
    .where({
      id: req.body.user_id,
    })
    .update({
      rank: req.body.rank,
      email: req.body.email,
      password: password,
      supervisor_id: req.body.supervisor_id,
    })
    .returning("id")
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch(() =>
      res
        .status(400)
        .json({
          message: `Provided email has already been registered and exists in our database. Please try using a different email or login with the existing email.`,
        })
        .end()
    );
});

router.delete("/delete", async (req, res) => {
  await knex("users")
    .del()
    .where({
      id: req.body.user_id,
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then(res.status(200).json({ message: `Success` }).end());
});

module.exports = router;
