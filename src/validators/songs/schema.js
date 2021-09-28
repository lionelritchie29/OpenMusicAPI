const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().max(50).required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  performer: Joi.string().max(50).required(),
  genre: Joi.string().max(30).required(),
  duration: Joi.number().required(),
});

module.exports = { SongPayloadSchema };
