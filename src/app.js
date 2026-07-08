const express = require("express");
const path = require("path");

const app = express();

const routes = require("./routes");

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", routes);

module.exports = app;