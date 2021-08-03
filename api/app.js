// Dependencies
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

// Routes
const user = require("./routes/api.user.js");
const group = require("./routes/api.group.js");
const routeTemplates = require("./routes/api.routes.templates.js");
const stageTemplates = require("./routes/api.stages.templates.js");
const requests = require("./routes/api.routes.requests.js");
const documents = require("./routes/api.documents.js");

// Declared Dependencies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Declared Routes
app.use("/users", user);
app.use("/groups", group);
app.use("/routes/templates", routeTemplates);
app.use("/stages/templates", stageTemplates);
app.use("/routes/requests", requests);
app.use("/documents", documents);

// Test
app.get("/", (req, res) => {
  res.send("These are not the droids you are looking for!");
});

// Port and Listen
const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
