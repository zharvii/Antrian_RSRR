const Joi = require("joi");

const schema = Joi.object().keys({
  kode: Joi.string().required(),
  poli: Joi.string().required(),
  bpjs: Joi.string(),
  umum: Joi.string(),
  state: Joi.string(),
  dumum: Joi.string(),
  dbpjs: Joi.string(),
  _id: Joi.string(),
});

module.exports = schema;
