const Joi = require("joi");

const schema = Joi.object().keys({
  no: Joi.string(),
  seq: Joi.string(),
  pelayanan: Joi.string().required(),
  kategori: Joi.string().required(),
  kode: Joi.string().required(),
  dokter: Joi.string().required(),
  dipanggil: Joi.string(),
});

module.exports = schema;
