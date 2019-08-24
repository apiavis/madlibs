var express = require("express");
var app = express();
var cors = require("cors");
var madlibsController = require("./controllers/madlibsController");

app.use(cors());

app.use("/madlibs", madlibsController);

module.exports = app;
