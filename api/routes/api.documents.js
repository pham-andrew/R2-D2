const express = require("express");
const router = express.Router();
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);

router.get("/", (req, res) => {
  res.send("Documents Endpoint");
});

module.exports = router;
