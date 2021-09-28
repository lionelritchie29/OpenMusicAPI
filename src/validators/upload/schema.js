const Joi = require('joi');

const imageMimeTypes = [
  'image/apng',
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg',
  'image/webp',
];

const UploadImageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(...imageMimeTypes)
    .required(),
}).unknown();

module.exports = { UploadImageHeadersSchema };
