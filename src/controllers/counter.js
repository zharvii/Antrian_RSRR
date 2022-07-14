const express = require("express");
const service = require("../services/counter");
let router = express.Router();

router.get("/", service.get);
router.get("/getByNo/:no", service.getByNo);
router.get("/getByPoli/:kat/:kode", service.getByPoli);
router.get("/call/:no", service.call);
router.post("/create", service.create);
router.get("/reset", service.reset);

module.exports = router;
