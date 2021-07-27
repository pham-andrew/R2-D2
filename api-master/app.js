// Dependencies
const express = require('express');
const cors = require('cors');
const app = express();

// Routes
const user = require("./routes/api.user.js");
const group = require("./routes/api.group.js");

// Declared Dependencies
app.use(express.json())
app.use(cors())

// Declared Routes
app.use("/users", user);
app.use("/groups", group);

// Test
app.get('/', (req, res) => {
  res.send('These are not the droids you are looking for!');
})

// Port and Listen3
const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
