const express = require("express");
const service = require("../services/dokter");
let router = express.Router();

router.get("/", service.get);
router.get("/getById/:id", service.getById);
router.get("/getByPoli/:kode", service.getByPoli);
router.get("/editState/:id/:state", service.editState);
router.post("/create", service.create);
router.post("/edit/:id", service.edit);
router.get("/remove/:id", service.remove);

module.exports = router;
