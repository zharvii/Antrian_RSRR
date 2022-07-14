const express = require("express");
const poli = require("../../controllers/poli");
const dokter = require("../../controllers/dokter");
const counter = require("../../controllers/counter");
let router = express.Router();
router.use("/poli", poli);
router.use("/dokter", dokter);
router.use("/counter", counter);
module.exports = router;
