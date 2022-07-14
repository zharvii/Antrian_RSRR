const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

const dirname = require("./dirname");

const init = (server) => {
  dotenv.config();
  server.set("hostname", process.env.APP_HOST);
  server.set("port", process.env.APP_PORT);
  server.set("views", path.join(dirname.get(), "views"));
  server.set("view engine", "ejs");
  server.use(cors());
  server.use(express.static(dirname.get() + "/public"));
  server.use(morgan("dev"));
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use(express.urlencoded({ extended: false }));
};
module.exports = {
  init: init,
};
