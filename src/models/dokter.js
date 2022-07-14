const Joi = require("joi");

const schema = Joi.object().keys({
  nama: Joi.string().required(),
  pelayanan: Joi.string().required(),
  kode: Joi.string().required(),
  state: Joi.string(),
  _id: Joi.string(),
});

module.exports = schema;
