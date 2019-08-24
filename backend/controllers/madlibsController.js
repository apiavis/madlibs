var express = require("express");
var bodyParser = require("body-parser");
var madlibs = require("../madlibs/madlibs");
var madlibsKeys = require("../madlibs/madlibsKeys");

var router = express.Router();

router.use(bodyParser.json());

router.get("/madlibsList", (req, res) => {
  res.status(200).send(Object.keys(madlibs));
});

router.get("/singleMadlib/:madlibTitle", (req, res) => {
  res.status(200).send({
    madlibTitle: req.params.madlibTitle,
    madlibsFormFields: Object.values(madlibsKeys[req.params.madlibTitle])
  });
});

router.post("/createMadlib", (req, res) => {
  if (!req.body.madlibTitle) {
    return res
      .status(400)
      .send("The request body is missing the string madlibTitle.");
  }
  res.status(200).send(madlibs[req.body.madlibTitle](req.body.madlibForm));
});

router.get("/randomMadlib", (req, res) => {
  let randomTitle = Object.keys(madlibs)[Math.floor(Math.random() * Object.keys(madlibs).length)];
  res.status(200).send({
    madlibTitle: randomTitle,
    madlibsFormFields: Object.values(madlibsKeys[randomTitle])
  });
});

module.exports = router;