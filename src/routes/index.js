const apiRoute = require("./api");
const utils = require("../utils");
const db = require("../db");

const init = (server) => {
  server.get("/", function (req, res) {
    res.render("home");
  });

  server.get("/display", function (req, res) {
    res.render("display");
  });

  server.get("/print/:no", function (req, res) {
    const { no } = req.params;
    let tgl = utils.formatDate(new Date());
    db.collection("counter").findOne({ no: no }, (err, result) => {
      res.render("print", {
        result,
        tgl,
      });
    });
  });

  server.use("/api", apiRoute);
};

module.exports = {
  init: init,
};
